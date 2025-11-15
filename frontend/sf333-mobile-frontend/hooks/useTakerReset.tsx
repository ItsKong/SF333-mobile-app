import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { takerStyles } from "@/styles/taker.style";
import { useTaker } from "@/contexts/TakerContexts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "@/contexts/AuthProvider";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import useGiverRefresh from "@/hooks/useGiverRefresh";
import { MoodItem } from "@/types/data.type";

export default function useTakerReset() {
  const router = useRouter();
  const {
    todaymood,
    settodaymood,
    isButtonPress,
    setIsButtonPress,
    pastmoods,
    setPastMoods,
    star,
    setStar,
    tasks,
    setTasks,
  } = useTaker();
  const { USER_DATA_KEY } = useAuth();
  const [username, setUsername] = useState("");
  const [isTaskPressed, setisTaskPressed] = useState(false);
  const [isdoing, setIsdoing] = useState<boolean>(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const { addMoodColorEmojiIndex, addTaskIndex } = useGiverRefresh();
  const LAST_MOOD_RESET_KEY = "@last_mood_reset";
  const LAST_TASK_CHECK_KEY = "@last_task_check";

  /**
   * Check if we need to reset mood tracking (daily at midnight)
   */
  const checkAndResetMood = useCallback(async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set to midnight
      const todayTimestamp = today.getTime();

      const lastReset = await AsyncStorage.getItem(LAST_MOOD_RESET_KEY);
      const lastResetTimestamp = lastReset ? parseInt(lastReset) : 0;

      // If it's a new day, reset mood
      if (todayTimestamp > lastResetTimestamp) {
        console.log("New day detected - resetting mood");
        setIsButtonPress(false);
        settodaymood(null as any);

        // Save the reset timestamp
        await AsyncStorage.setItem(
          LAST_MOOD_RESET_KEY,
          todayTimestamp.toString()
        );
      }
    } catch (error) {
      console.log("Error checking mood reset:", error);
    }
  }, []);

  /**
   * Check and reset tasks based on due_time
   */
  const checkAndResetTasks = useCallback(async () => {
    try {
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(
        now.getMinutes()
      ).padStart(2, "0")}`;
      const currentDate = now.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

      let shouldResetTaskUI = false;

      // Check each task
      const updatedTasks = tasks.map((task) => {
        // For tasks with due_date, check if date has passed
        if (task.due_date) {
          const taskDate = new Date(task.due_date);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          taskDate.setHours(0, 0, 0, 0);

          // If task date has passed and time has passed
          if (taskDate < today) {
            shouldResetTaskUI = true;
            return { ...task, status: "MISSING" };
          }

          // If same date, check time
          if (taskDate.getTime() === today.getTime()) {
            if (task.due_time && currentTime > task.due_time) {
              shouldResetTaskUI = true;
              if (task.status !== "DONE") {
                return { ...task, status: "MISSING" };
              }
            }
          }
        } else {
          // For tasks without due_date, just check time
          if (task.due_time && currentTime > task.due_time) {
            shouldResetTaskUI = true;
            if (task.status !== "DONE") {
              return { ...task, status: "MISSING" };
            }
          }
        }

        return task;
      });

      // Update tasks if any changed
      if (JSON.stringify(tasks) !== JSON.stringify(updatedTasks)) {
        setTasks(updatedTasks);
      }

      // Reset the task UI state if needed
      if (shouldResetTaskUI && isTaskPressed) {
        setisTaskPressed(false);
        setIsdoing(false);
      }

      // Store last check time
      await AsyncStorage.setItem(LAST_TASK_CHECK_KEY, now.getTime().toString());
    } catch (error) {
      console.log("Error checking task reset:", error);
    }
  }, [tasks, isTaskPressed]);

  /**
   * Daily reset for frequency-based tasks (Daily/Weekly)
   */
  const checkFrequencyBasedReset = useCallback(async () => {
    try {
      const today = new Date();
      const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.

      const updatedTasks = tasks.map((task) => {
        // Reset Daily tasks every day at their due_time
        if (task.frequency === "Daily") {
          const now = new Date();
          const [hours, minutes] = task.due_time.split(":");
          const dueTime = new Date();
          dueTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

          // If current time is past due_time and status is not updated today
          if (now > dueTime && task.status === "DONE") {
            // Check if it was completed today
            // You might want to store completion timestamp for this
            return { ...task, status: "DOING" };
          }
        }

        // Reset Weekly tasks every week on specific day
        if (task.frequency === "Weekly" && dayOfWeek === 1) {
          // Reset on Monday
          return { ...task, status: "DOING" };
        }

        return task;
      });

      if (JSON.stringify(tasks) !== JSON.stringify(updatedTasks)) {
        setTasks(updatedTasks);
      }
    } catch (error) {
      console.log("Error checking frequency reset:", error);
    }
  }, [tasks]);

  const findCurrentTask = useCallback(() => {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}`;
    const currentDate = now.toISOString().split("T")[0];

    // Filter tasks for today
    const todayTasks = tasks.filter((task) => {
      // If task has due_date, check if it's today
      if (task.due_date) {
        const taskDate = new Date(task.due_date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        taskDate.setHours(0, 0, 0, 0);
        return taskDate.getTime() === today.getTime();
      }

      // If no due_date, include Daily and Weekly tasks
      return task.frequency === "Daily" || task.frequency === "Weekly";
    });

    if (todayTasks.length === 0) return null;

    // Sort tasks by due_time
    const sortedTasks = todayTasks.sort((a, b) => {
      return a.due_time.localeCompare(b.due_time);
    });

    // Find the most relevant task:
    // 1. Current active task (within 30 min window and not done)
    // 2. Next upcoming task
    // 3. First pending task

    const activeTask = sortedTasks.find((task) => {
      if (task.status === "DONE") return false;

      const [hours, minutes] = task.due_time.split(":");
      const dueTime = new Date();
      dueTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      const timeDiff = dueTime.getTime() - now.getTime();
      const minutesDiff = timeDiff / (1000 * 60);

      // Task is active if it's within -30 to +30 minutes of due time
      return minutesDiff >= -30 && minutesDiff <= 30;
    });

    if (activeTask) return activeTask;

    // Find next upcoming task
    const upcomingTask = sortedTasks.find((task) => {
      return task.status !== "DONE" && task.due_time > currentTime;
    });

    if (upcomingTask) return upcomingTask;

    // Return first pending task
    return sortedTasks.find((task) => task.status !== "DONE") || sortedTasks[0];
  }, [tasks]);

  /**
   * Get time until task
   */
  const getTimeUntilTask = (dueTime: string) => {
    const now = new Date();
    const [hours, minutes] = dueTime.split(":");
    const due = new Date();
    due.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    const diff = due.getTime() - now.getTime();
    const minutesDiff = Math.round(diff / (1000 * 60));

    if (minutesDiff < 0) return "Now";
    if (minutesDiff === 0) return "Right now!";
    if (minutesDiff < 60) return `in ${minutesDiff} min`;

    const hoursDiff = Math.floor(minutesDiff / 60);
    const remainingMins = minutesDiff % 60;
    return `in ${hoursDiff}h ${remainingMins}m`;
  };
  return {
    checkFrequencyBasedReset,
    checkAndResetTasks,
    checkAndResetMood,
    findCurrentTask,
    getTimeUntilTask,
  };
}

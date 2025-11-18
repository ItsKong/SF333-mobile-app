import { useAuth } from "@/contexts/AuthProvider";
import { useTaker } from "@/contexts/TakerContexts";
import useGiverRefresh from "@/hooks/useGiverRefresh";
import useTakerReset from "@/hooks/useTakerReset";
import { takerStyles } from "@/styles/taker.style";
import { TaskItem } from "@/types/data.type";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
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
/**
 * How to reset Task:
 * Task question need to be reset when due_time come
 * if user not seleted the answer, that task status become 'MISSING'
 * if user seleted 'NO', task status also becom 'MISSING'
 * incoming task have 'DOING' status
 *
 *
 * How to reset Mood:
 * check the time and reset todaymood variable => null and clear todaymood asyneStorage
 */

export default function HomePage() {
  const { handleLogout } = useAuth();
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
    MOOD_STORAGE_KEY,
    MOODTD_STORAGE_KEY,
    TASK_STORAGE_KEY,
    LAST_MOOD_RESET_KEY,
  } = useTaker();
  const { USER_DATA_KEY } = useAuth();
  const [username, setUsername] = useState("");
  const [docId, setDocid] = useState("");
  const [isTaskPressed, setisTaskPressed] = useState(false);
  const [currentTask, setCurrentTask] = useState<TaskItem | null>(null);
  const [isdoing, setIsdoing] = useState<boolean>(false);
  const [isSOSLoading, setIsSOSLoading] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const { addMoodColorEmojiIndex, addTaskIndex, addTDMoodColorEmoji } =
    useGiverRefresh();
  const {
    checkFrequencyBasedReset,
    checkAndResetTasks,
    checkAndResetMood,
    findCurrentTask,
  } = useTakerReset();

  useEffect(() => {
    // If todaymood has data, button is pressed (True)
    // If todaymood is null/undefined, button is not pressed (False)
    if (todaymood) {
      console.log("Hi im not null");
      setIsButtonPress(true);
    } else {
      console.log("Hi im null");
      setIsButtonPress(false);
    }
  }, [todaymood]);

  useFocusEffect(
    useCallback(() => {
      const runResets = async () => {
        await checkAndResetMood(); // Checks date, if new day -> sets todaymood null
        await checkAndResetTasks();
        await checkFrequencyBasedReset();
      };
      runResets();
    }, [])
  );

  /**
   * Update current task periodically
   */

  useEffect(() => {
    const updateCurrentTask = () => {
      const task = findCurrentTask();
      setCurrentTask(task);
    };

    updateCurrentTask();

    // Update every minute
    const interval = setInterval(updateCurrentTask, 60000);

    return () => clearInterval(interval);
  }, [findCurrentTask]);

  // Get task due date --
  const getTaskDueDate = useCallback((task: TaskItem | null) => {
    if (!task) return null;
    if (task.due_date) {
      const parsed = new Date(task.due_date);
      if (!Number.isNaN(parsed.getTime())) {
        return parsed;
      }
    }
    if (task.due_time) {
      const fallback = new Date();
      const [hours, minutes] = task.due_time.split(":");
      fallback.setHours(
        parseInt(hours ?? "0", 10),
        parseInt(minutes ?? "0", 10),
        0,
        0
      );
      return fallback;
    }
    return null;
  }, []);

  // Get prompt task for prompt box
  const promptTask = React.useMemo(() => {
    if (currentTask) return currentTask;
    return tasks.find((task) => task.status !== "DONE") || null;
  }, [currentTask, tasks]);

  // Check if should show prompt box
  const shouldShowPrompt = React.useMemo(() => {
    if (!promptTask) return false;
    const dueDate = getTaskDueDate(promptTask);
    if (!dueDate) return true;
    const now = new Date();
    const leadTimeMs = 15 * 60 * 1000; // 15 minutes before due time
    return now.getTime() >= dueDate.getTime() - leadTimeMs;
  }, [promptTask, getTaskDueDate]);

  const promptDisabled = !shouldShowPrompt || !promptTask;

  useFocusEffect(
    useCallback(() => {
      const fetctUsername = async () => {
        const storeData = await AsyncStorage.getItem(USER_DATA_KEY);
        if (!storeData) {
          router.replace("/(auth)/LoginForm");
          AsyncStorage.clear();
          return;
        } else {
          const parseusername = await JSON.parse(storeData);
          console.log("Username: ", parseusername.userData.username);
          setUsername(parseusername.userData.username);
          setDocid(parseusername.docId);
        }
      };
      fetctUsername();
    }, [])
  );

  // useFocusEffect(
  //   useCallback(() => {
  //     checkAndResetMood();
  //     checkAndResetTasks();
  //     checkFrequencyBasedReset();
  //   }, [checkAndResetMood, checkAndResetTasks, checkFrequencyBasedReset])
  // );

  const onRefresh = React.useCallback(async () => {
    // fetch server
    setRefreshing(true);
    try {
      const getId = await AsyncStorage.getItem(USER_DATA_KEY);
      if (!getId) {
        router.replace("/(auth)/LoginForm");
        AsyncStorage.clear();
        return;
      }
      const parseID = JSON.parse(getId);
      const userTaskreq = await fetch(
        `${process.env.EXPO_PUBLIC_GET_TASKDATA_BYUSER}/${parseID.docId}`
      );
      const userMoodreq = await fetch(
        `${process.env.EXPO_PUBLIC_GET_MOODDATA_BYUSER}/${parseID.docId}`
      );
      const userMoodTDreq = await fetch(
        `${process.env.EXPO_PUBLIC_GET_MOODTODAY_BYUSER}/${parseID.docId}`
      );
      const userTaskData = await userTaskreq.json();
      const userMoodData = await userMoodreq.json();
      const userMoodTDres = await userMoodTDreq.json();
      console.log(userMoodTDres.moods.length);

      const hastomood = userMoodTDres.moods.length > 0;
      console.log("refresh hastomood: ", hastomood);
      if (hastomood) {
        const formatTDMood = addTDMoodColorEmoji(userMoodTDres);
        await AsyncStorage.setItem(
          MOODTD_STORAGE_KEY,
          JSON.stringify({
            todayMood: formatTDMood,
          })
        );

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        await AsyncStorage.setItem(
          LAST_MOOD_RESET_KEY,
          today.getTime().toString()
        );

        settodaymood(formatTDMood);
      } else {
        console.log("hastomood is 0. set todaymood to null.");
        settodaymood(null as any);
      }
      if (userTaskData.success && userMoodData.success) {
        const formatMood = addMoodColorEmojiIndex(
          userMoodData.moods.slice(0, 7)
        );
        const formatTask = addTaskIndex(userTaskData.tasks);
        await AsyncStorage.setItem(
          TASK_STORAGE_KEY,
          JSON.stringify({
            tasks: formatTask,
          })
        );

        await AsyncStorage.setItem(
          MOOD_STORAGE_KEY,
          JSON.stringify({
            pastmoods: formatMood,
          })
        );
        console.log(parseID.userData.stars_point);
        setPastMoods(formatMood);
        setTasks(formatTask);
        setStar(parseID.userData.stars_point);
      } else {
        console.log("Error fetching data: ", userTaskData);
      }
    } catch (e) {
      console.log("Refresh Error: ", e);
      Alert.alert("Error refreshing", `Something wrong. Error: ${e}`);
    } finally {
      setRefreshing(false);
    }
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const handleMoodtracking = () => {
    if (todaymood) {
      console.log("Today mood: ", todaymood);
      setIsButtonPress(true);
      null;
    } else {
      router.push("/(app)/(taker)/moodTracking");
    }
  };
  const handleTaskChoice = async (choice: boolean, taskId: any) => {
    try {
      if (choice) {
        // Add star
        const newTotalStars = star + 1;
        setStar(newTotalStars);
        console.log("newTotalStars", newTotalStars);
        // Update task status
        const updatedTasks = tasks.map((task) =>
          task.id === taskId ? { ...task, status: "DONE" } : task
        );
        setTasks(updatedTasks);

        const taskdata = updatedTasks.find((task) => task.id === taskId);
        const newstarPayload = {
          stars_point: newTotalStars, // 👈 Send the number we calculated
        };
        // update server
        const taskreq = await fetch(
          `${process.env.EXPO_PUBLIC_POST_TASKDATA}/${taskId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(taskdata),
          }
        );
        const starreq = await fetch(
          `${process.env.EXPO_PUBLIC_POST_USERDATA}/${docId}/stars`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newstarPayload),
          }
        );
        const taskres = await taskreq.json();
        const starres = await starreq.json();
        if (taskres.success) {
          console.log("Server task send success: ", taskres.message);
        } else {
          console.log("Server task send failed: ", taskres.error);
        }

        if (starres.success) {
          console.log("Server star send success: ", starres.message);
        } else {
          console.log("Server star send failed: ", starres.error);
        }
      } else {
        // Seleted NO
        // Update task status
        const updatedTasks = tasks.map((task) =>
          task.id === taskId ? { ...task, status: "MISSING" } : task
        );
        setTasks(updatedTasks);
        const taskdata = updatedTasks.find((task) => task.id === taskId);
        // update server
        const taskreq = await fetch(
          `${process.env.EXPO_PUBLIC_POST_TASKDATA}/${taskId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(taskdata),
          }
        );
        const taskres = await taskreq.json();
        if (taskres.success) {
          console.log("Server success", taskres.message);
        } else {
          console.log("Server error:", taskres.error);
        }
      }
    } catch (e) {
      console.log("Fail to send task to server: ", e);
    } finally {
      setisTaskPressed(true);
      setIsdoing(choice);
    }
  };

  const TaskOutput = () => {
    return (
      <>
        {isdoing ? (
          <Text style={takerStyles.ratingTitle}>Greate job. You got a ⭐</Text>
        ) : (
          <Text style={takerStyles.ratingTitle}>
            that's ok, don't forget to do it.
          </Text>
        )}

        <Text>Your star:</Text>
        {/* stars go here! */}
        <View style={takerStyles.starRow}>
          {Array.from({ length: star as any }).map((_, index) => (
            <Text key={index} style={takerStyles.star}>
              ⭐
            </Text>
          ))}
        </View>
      </>
    );
  };

  const handleSOS = async () => {
    // 1. Prevent Spamming: If already loading, stop immediately
    if (isSOSLoading) return;

    // 2. Lock the button and start process
    setIsSOSLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Location permission is required to send SOS."
        );
        return;
      }

      // Get current location
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = location.coords;
      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

      const sosreq = await fetch(`${process.env.EXPO_PUBLIC_POST_SOS}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: docId,
          mapLink: googleMapsUrl,
        }),
      });

      const sosres = await sosreq.json();

      if (sosres.success) {
        Alert.alert(
          "SOS Sent",
          "Your emergency alert has been sent successfully."
        );
      } else {
        Alert.alert("SOS Failed", sosres.error || "Failed to send SOS.");
      }
    } catch (e) {
      console.log("SOS error: ", e);
      Alert.alert("SOS Error", `Could not send emergency alert: ${e}`);
    } finally {
      setIsSOSLoading(false);
    }
  };

  // ---------- Home ----------
  return (
    <View style={[{ flex: 1, position: "relative" }]}>
      <ScrollView
        contentContainerStyle={takerStyles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={takerStyles.greeting}>Hello {username}.</Text>
        <Pressable
          style={takerStyles.moodBox}
          onPress={() => handleMoodtracking()}
        >
          {isButtonPress ? (
            <View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View
                  style={[
                    takerStyles.moodCircle,
                    { backgroundColor: todaymood?.color },
                  ]}
                />
                <Text style={takerStyles.todayyouare}>
                  {"  "}Today you are {todaymood?.mood} {todaymood?.emoji}
                </Text>
              </View>
              <View style={{ marginTop: 25 }}>
                <Text style={takerStyles.moodpastdays}>
                  Your pass 7 day mood:
                </Text>
                {/* balls go here! */}
                <View style={takerStyles.moodRow}>
                  {pastmoods.map((pastmood, i) => (
                    <View
                      key={i}
                      style={[
                        takerStyles.moodCircle,
                        { backgroundColor: pastmood.color, marginTop: 10 },
                      ]}
                    />
                  ))}
                </View>
              </View>
            </View>
          ) : (
            <View>
              <Text style={takerStyles.howareyoutoday}>
                How are you feeling today?{" "}
              </Text>
            </View>
          )}
        </Pressable>

        {/* Shower Box */}
        <View style={takerStyles.box}>
          {isTaskPressed ? (
            TaskOutput()
          ) : (
            <>
              <Text style={takerStyles.taskContext}>
                {shouldShowPrompt && promptTask
                  ? `Did you ${promptTask.title}?` // Show prompt task title
                  : "You're all caught up for now."}
              </Text>
              <View style={takerStyles.showerRow}>
                <Pressable
                  disabled={promptDisabled}
                  style={({ pressed }) => [
                    takerStyles.teskchoice,
                    {
                      backgroundColor: promptDisabled
                        ? "#A5D6A7"
                        : pressed
                        ? "#86cd89ff"
                        : "#66BB6A",
                    },
                  ]}
                  onPress={() =>
                    promptTask && handleTaskChoice(true, promptTask.id)
                  }
                >
                  <Text style={takerStyles.teskchoiceText}>YES</Text>
                </Pressable>
                <Pressable
                  disabled={promptDisabled}
                  style={({ pressed }) => [
                    takerStyles.teskchoice,
                    {
                      backgroundColor: promptDisabled
                        ? "#f5b5b5"
                        : pressed
                        ? "#df8989ff"
                        : "#E57373",
                    },
                  ]}
                  onPress={() =>
                    promptTask && handleTaskChoice(false, promptTask.id)
                  }
                >
                  <Text style={takerStyles.teskchoiceText}>NO</Text>
                </Pressable>
              </View>
            </>
          )}
        </View>

        {/* Today Task */}
        <Text style={takerStyles.taskHeader}>Today's Tasks:</Text>
        <View style={takerStyles.taskBox}>
          {tasks.map((task) => (
            <View key={task.id} style={takerStyles.taskCard}>
              <View style={takerStyles.statusBarContent}>
                {task.status === "DONE" ? (
                  <View
                    style={[
                      takerStyles.statusBar,
                      { backgroundColor: "#73E34A" },
                    ]}
                  />
                ) : (
                  <View
                    style={[
                      takerStyles.statusBar,
                      { backgroundColor: "#FF2222" },
                    ]}
                  />
                )}
                <Text style={takerStyles.taskTitle}>{task.title}</Text>
              </View>
              <Text style={takerStyles.taskTime}>{task.due_time}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={takerStyles.sosContainer}>
        <View style={takerStyles.leftspacer} />
        <Pressable
          style={[
            takerStyles.sosButton,
            // Optional: Dim the button when loading so they know it's disabled
            isSOSLoading && { opacity: 0.6, backgroundColor: "#F56C6C" },
          ]}
          onPress={() => handleSOS()}
          disabled={isSOSLoading} // 👈 Physical disable to prevent clicks
        >
          <Text style={takerStyles.sosText}>
            SOS
          </Text>
        </Pressable>
        <Pressable
          style={takerStyles.logoutButton}
          onPress={() => handleLogout()}
        >
          <MaterialIcons
            style={{ textAlign: "center" }}
            name="logout"
            size={24}
            color={"#ffffff"}
          />
          <Text style={takerStyles.logoutText}>Logout</Text>
        </Pressable>
      </View>
    </View>
  );
}

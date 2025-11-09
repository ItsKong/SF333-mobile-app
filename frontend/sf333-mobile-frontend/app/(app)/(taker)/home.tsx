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
import { TaskItem } from "@/types/data.type";
import useTakerReset from "@/hooks/useTakerReset";
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
    TAKER_STORAGE_KEY,
  } = useTaker();
  const { USER_DATA_KEY } = useAuth();
  const [username, setUsername] = useState("");
  const [docId, setDocid] = useState("");
  const [isTaskPressed, setisTaskPressed] = useState(false);
  const [currentTask, setCurrentTask] = useState<TaskItem | null>(null);
  const [isdoing, setIsdoing] = useState<boolean>(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const { addMoodColorEmojiIndex, addTaskIndex } = useGiverRefresh();
  const {
    checkFrequencyBasedReset,
    checkAndResetTasks,
    checkAndResetMood,
    findCurrentTask,
  } = useTakerReset();

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

  useFocusEffect(
    useCallback(() => {
      checkAndResetMood();
      checkAndResetTasks();
      checkFrequencyBasedReset();
    }, [checkAndResetMood, checkAndResetTasks, checkFrequencyBasedReset])
  );

  const onRefresh = React.useCallback(async () => {
    // fetch server
    setRefreshing(true);
    try {
      const getId = await AsyncStorage.getItem(USER_DATA_KEY);
      if (!getId) {
        router.replace("/(auth)/LoginForm");
        return;
      }
      const parseID = JSON.parse(getId);
      const userTaskreq = await fetch(
        `${process.env.EXPO_PUBLIC_GET_TASKDATA_BYUSER}/${parseID.docId}`
      );
      const userMoodreq = await fetch(
        `${process.env.EXPO_PUBLIC_GET_MOODDATA_BYUSER}/${parseID.docId}`
      );

      const userTaskData = await userTaskreq.json();
      const userMoodData = await userMoodreq.json();

      if (userTaskData.success && userMoodData.success) {
        const formatMood = addMoodColorEmojiIndex(userMoodData.moods);
        const formatTask = addTaskIndex(userTaskData.tasks);
        setPastMoods(formatMood);
        setTasks(formatTask);
      }
    } catch (e) {
      console.log("Refresh Error: ", e);
    }
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const addStar = async () => {
    try {
      setStar((prev: number[]) => {
        const newStarCount = prev.length + 1;
        return Array.from({ length: newStarCount }, (_, i) => i + 1);
      });
    } catch (e) {
      console.log("Add Star Error: ", e);
    }
  };
  const handleMoodtracking = () => {
    if (todaymood) {
      null;
    } else {
      router.push("/(app)/(taker)/moodTracking");
    }
  };
  const handleTaskChoice = async (choice: boolean, taskId: any) => {
    try {
      if (choice) {
        // Add star
        setStar((prev: number[]) => {
          const newStarCount = prev.length + 1;
          return Array.from({ length: newStarCount }, (_, i) => i + 1);
        });

        // Update task status
        const updatedTasks = tasks.map((task) =>
          task.id === taskId ? { ...task, status: "DONE" } : task
        );
        setTasks(updatedTasks);

        const taskdata = updatedTasks.find((task) => task.id === taskId);
        const newstar = {
          stars_point: star.length,
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
            body: JSON.stringify(newstar),
          }
        );
        const taskres = await taskreq.json();
        const starres = await starreq.json();
        if (taskres.success) {
          console.log(taskres.message);
        } else {
          console.log(taskres.error);
        }

        if (starres.success) {
          console.log(starres.message);
        } else {
          console.log(starres.error);
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
          console.log(taskres.message);
        } else {
          console.log(taskres.error);
        }
      }
    } catch (e) {
      console.log("Task choice error: ", e);
    } finally {
      setisTaskPressed(true);
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
          {star.map((star) => (
            <Text key={star} style={takerStyles.star}>
              ⭐
            </Text>
          ))}
        </View>
        {/* <Pressable
          style={({ pressed }) => [
            takerStyles.teskchoice,
            { backgroundColor: pressed ? "#86cd89ff" : "#66BB6A" },
          ]}
          onPress={() => handleTaskChoice(false)}
        >
          <Text style={takerStyles.teskchoiceText}>back</Text>
        </Pressable> */}
      </>
    );
  };

  const handleLogout = async () => {
    try {
      Alert.alert("Logout", "Are you sure you want to logout?", [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            // Add your logout logic here
            console.log("User logged out");
            await AsyncStorage.clear();
            router.replace("/(auth)/LoginForm");
            // Example: clear auth tokens, navigate to login, etc.
          },
        },
      ]);
    } catch (error) {
      console.log("Error logout: ", error);
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
                  {pastmoods.map((pastmood) => (
                    <View
                      key={pastmood.index}
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
                Did you {currentTask?.title}
              </Text>
              <View style={takerStyles.showerRow}>
                <Pressable
                  style={({ pressed }) => [
                    takerStyles.teskchoice,
                    { backgroundColor: pressed ? "#86cd89ff" : "#66BB6A" },
                  ]}
                  onPress={() => handleTaskChoice(true, currentTask?.id)}
                >
                  <Text style={takerStyles.teskchoiceText}>YES</Text>
                </Pressable>
                <Pressable
                  style={({ pressed }) => [
                    takerStyles.teskchoice,
                    { backgroundColor: pressed ? "#df8989ff" : "#E57373" },
                  ]}
                  onPress={() => handleTaskChoice(false, currentTask?.id)}
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
          style={takerStyles.sosButton}
          onPress={() => console.log("SOS Pressed")}
        >
          <Text style={takerStyles.sosText}>SOS</Text>
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

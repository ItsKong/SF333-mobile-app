// app/giver/CareGiverHome.tsx

import { useAuth } from "@/contexts/AuthProvider";
import { useGiver } from "@/contexts/GiverContexts";
import useGiverRefresh from "@/hooks/useGiverRefresh";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function GiverHome() {
  const router = useRouter();
  const [refreshing, setRefreshing] = React.useState(false);
  const [username, setUsername] = useState("");
  const {
    pastMoods,
    tasks,
    todayMood,
    setTasks,
    setPastMoods,
    setTodayMood,
    TASK_STORAGE_KEY,
    MOOD_STORAGE_KEY,
    MOODTD_STORAGE_KEY,
  } = useGiver();
  const { USER_DATA_KEY } = useAuth();
  const { addMoodColorEmojiIndex, addTaskIndex } = useGiverRefresh();

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
        }
      };
      fetctUsername();
    }, [])
  );

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
        `${process.env.EXPO_PUBLIC_GET_TASKDATA_BYUSER}/${parseID.userData.linked_to}`
      );
      const userMoodreq = await fetch(
        `${process.env.EXPO_PUBLIC_GET_MOODDATA_BYUSER}/${parseID.userData.linked_to}`
      );

      const userTaskData = await userTaskreq.json();
      const userMoodData = await userMoodreq.json();

      if (userTaskData.success && userMoodData.success) {
        const formatMood = addMoodColorEmojiIndex(userMoodData.moods);
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

        setPastMoods(formatMood);
        setTasks(formatTask);
      } else {
        console.log("Error fetching data: ", userTaskData);
      }
    } catch (e) {
      console.log("Refresh Error: ", e);
      Alert.alert("Error refreshing", `Something wrong. Error: ${e}`);
    }
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Today's Mood */}
      <Text style={styles.header}>{username}’s today Mood</Text>
      <Text style={styles.moodEmoji}>{todayMood? todayMood.emoji: ""}</Text>

      {/* Mood History */}
      <Text style={styles.subHeader}>{username}'s mood in past 7 days:</Text>
      <View style={styles.moodRow}>
        {pastMoods.map((item, index) => (
          <Text key={index} style={styles.moodHistory}>
            {item.emoji}
          </Text>
        ))}
      </View>

      {/* Task status */}
      <Text style={styles.subHeader}>Today's tasks status</Text>
      <View style={styles.taskContainer}>
        {tasks.map((task, index) => (
          <View key={index} style={styles.taskCard}>
            <Text style={styles.taskTitle}>{task.title}</Text>
            <Text
              style={[
                styles.taskStatus,
                task.status === "DONE" ? styles.done : styles.missed,
              ]}
            >
              {task.status}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#F7F9FC",
  },
  header: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  moodEmoji: {
    fontSize: 60,
    textAlign: "center",
    marginVertical: 10,
  },
  subHeader: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: "600",
  },
  moodRow: {
    flexDirection: "row",
    marginTop: 5,
    gap: 12,
  },
  moodHistory: {
    fontSize: 30,
    marginRight: 5,
  },
  taskContainer: {
    marginTop: 20,
    backgroundColor: "#DBE8F5",
    padding: 15,
    borderRadius: 10,
  },
  taskCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  taskTitle: {
    fontSize: 18,
    color: "#000",
  },
  taskStatus: {
    fontSize: 18,
    color: "#000",
    fontWeight: "600",
  },
  done: {
    color: "green",
  },
  missed: {
    color: "red",
  },
});

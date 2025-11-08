// app/giver/CareGiverHome.tsx

import { useAuth } from "@/contexts/AuthProvider";
import { useGiver } from "@/contexts/GiverContexts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback } from "react";
import {
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
  const {
    pastMoods,
    tasks,
    todayMood,
    setTasks,
    setPastMoods,
    setTodayMood,
    STORAGE_KEY,
  } = useGiver();
  const {USER_DATA_KEY} = useAuth()

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
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      const userData = await AsyncStorage.getItem(USER_DATA_KEY);
      const userTaskreq = await fetch(
        `${process.env.EXPO_PUBLIC_GET_TASKDATA_BYUSER}/${parseID.docId}`
      );
      const userMoodreq = await fetch(
        `${process.env.EXPO_PUBLIC_GET_MOODDATA_BYUSER}/${parseID.docId}`
      );

      const userTaskData = await userTaskreq.json();
      const userMoodData = await userMoodreq.json();

      if (data && userData) {
        const parseData = JSON.parse(data);
        setPastMoods(parseData.pastmoods);
        setTasks(parseData.tasks);
        // setStar(parseData.star);
      }
    } catch (e) {
      console.log("Refresh Error: ", e);
    }
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <View style={{ flex: 1, position: "relative" }}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Today's Mood */}
        <Text style={styles.header}>Poom’s today Mood</Text>
        <Text style={styles.moodEmoji}>{todayMood.emoji}</Text>

        {/* Mood History */}
        <Text style={styles.subHeader}>Poom’s mood in past 7 days:</Text>
        <View style={styles.moodRow}>
          {pastMoods.map((item) => (
            <Text key={item.date} style={styles.moodHistory}>
              {item.emoji}
            </Text>
          ))}
        </View>

        {/* Task status */}
        <Text style={styles.subHeader}>Today's tasks status</Text>
        <View style={styles.taskContainer}>
          {tasks.map((task) => (
            <View key={task.id} style={styles.taskCard}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
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

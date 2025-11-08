import React, { useCallback, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { useGiver } from "@/contexts/GiverContexts";
import { useFocusEffect, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "@/contexts/AuthProvider";

// Mock StatsCard Component
const StatsCard = ({ title, value }: { title: string; value: string }) => (
  <View style={styles.statsCard}>
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Text style={styles.statsTitle}>{title}</Text>
      <Text style={styles.statsValue}>{value}</Text>
    </View>
  </View>
);

// Mock MoodIndicator Component
const MoodIndicator = ({ mood }: { mood: "happy" | "angry" | "sad" }) => {
  const emoji = mood === "happy" ? "😀" : mood === "angry" ? "😡" : "😢";
  return (
    <View style={styles.moodIndicator}>
      <Text style={styles.moodEmoji}>{emoji}</Text>
    </View>
  );
};

interface TaskHistoryItem {
  task: string;
  date: string;
  status: "y" | "n";
}

interface MoodHistoryItem {
  mood: "happy" | "angry" | "sad";
  date: string;
}

export default function Dashboard() {
  const router = useRouter();
  const { pastMoods, tasks, STORAGE_KEY, setPastMoods, setTasks } = useGiver();
  const { USER_DATA_KEY } = useAuth();
  const [percent, setPercent] = useState(0);
  const [refreshing, setRefreshing] = React.useState(false);

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

  useFocusEffect(
    useCallback(() => {
      percentageCal();
      return () => null;
    }, [])
  );

  const percentageCal = () => {
    let done = 0;
    let count = 0;
    for (let i of tasks) {
      if (i.status === "DONE") {
        done++;
      }
      count++;
    }
    setPercent((done / count) * 100);
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Stats Overview */}
      <StatsCard title="Percentage of completed tasks" value={percent + "%"} />

      {/* Weekly Task History */}
      <Text style={styles.cardTitle}>Weekly Task History</Text>
      <View style={styles.card}>
        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText, { flex: 2 }]}>Tasks</Text>
          <Text style={[styles.tableHeaderText, { flex: 1 }]}>Date</Text>
          <Text style={[styles.tableHeaderText, { flex: 1 }]}>Y/N</Text>
        </View>

        {tasks.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={[styles.taskText, { flex: 2 }]}>{item.title}</Text>
            <Text style={[styles.dateText, { flex: 1 }]}>{item.date}</Text>
            <Text
              style={[
                styles.statusText,
                { flex: 1 },
                item.status === "DONE" ? styles.success : styles.destructive,
              ]}
            >
              {item.status}
            </Text>
          </View>
        ))}
      </View>

      {/* Mood History */}
      <Text style={styles.cardTitle}>Mood History</Text>
      <View style={styles.card}>
        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText, { flex: 1 }]}>Mood</Text>
          <Text style={[styles.tableHeaderText, { flex: 1 }]}>Date</Text>
        </View>

        {pastMoods.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            {/* <MoodIndicator mood={item.mood} /> */}
            <View style={styles.moodIndicator}>
              <Text style={styles.moodEmoji}>{item.emoji}</Text>
            </View>
            <Text style={[styles.dateText, { flex: 1 }]}>{item.date}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F9FC", padding: 20 },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  statsCard: {
    backgroundColor: "#DBE8F5",
    padding: 16,
    borderRadius: 12,
    marginTop: 10,
    marginBottom: 20,
  },
  statsTitle: { fontSize: 16, fontWeight: "600", marginBottom: 8 },
  statsValue: { fontSize: 28, fontWeight: "bold", color: "#5E6CA8" },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: { fontSize: 18, fontWeight: "600", marginBottom: 12 },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingBottom: 6,
    marginBottom: 8,
  },
  tableHeaderText: {
    fontWeight: "600",
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
  tableRow: { flexDirection: "row", alignItems: "center", paddingVertical: 5 },
  taskText: { fontSize: 14, textAlign: "left", color: "#111827" },
  dateText: { fontSize: 14, textAlign: "center", color: "#6B7280" },
  statusText: { fontSize: 14, fontWeight: "600", textAlign: "center" },
  success: { color: "#10B981" },
  destructive: { color: "#EF4444" },
  moodIndicator: { flex: 1, alignItems: "center" },
  moodEmoji: { fontSize: 24 },
});

import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useGiver } from "@/contexts/GiverContexts";

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
  const {pastMoods} = useGiver();

  const taskHistory: TaskHistoryItem[] = [
    { task: "Taking a shower", date: "21 Aug 2025", status: "y" },
  ];

  const moodHistory: MoodHistoryItem[] = [
    { mood: "happy", date: "21 Aug 2025" },
    { mood: "angry", date: "22 Aug 2025" },
    { mood: "sad", date: "23 Aug 2025" },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Stats Overview */}
      <StatsCard title="Percentage of completed tasks" value="83%" />

      {/* Weekly Task History */}
      <Text style={styles.cardTitle}>Weekly Task History</Text>
      <View style={styles.card}>
        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText, { flex: 2 }]}>Tasks</Text>
          <Text style={[styles.tableHeaderText, { flex: 1 }]}>Date</Text>
          <Text style={[styles.tableHeaderText, { flex: 1 }]}>Y/N</Text>
        </View>

        {taskHistory.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={[styles.taskText, { flex: 2 }]}>{item.task}</Text>
            <Text style={[styles.dateText, { flex: 1 }]}>{item.date}</Text>
            <Text
              style={[
                styles.statusText,
                { flex: 1 },
                item.status === "y" ? styles.success : styles.destructive,
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

        {moodHistory.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <MoodIndicator mood={item.mood} />
            <Text style={[styles.dateText, { flex: 1 }]}>{item.date}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F9FC", padding: 16 },
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
  tableRow: { flexDirection: "row", alignItems: "center", paddingVertical: 6 },
  taskText: { fontSize: 14, textAlign: "left", color: "#111827" },
  dateText: { fontSize: 14, textAlign: "center", color: "#6B7280" },
  statusText: { fontSize: 14, fontWeight: "600", textAlign: "center" },
  success: { color: "#10B981" },
  destructive: { color: "#EF4444" },
  moodIndicator: { flex: 1, alignItems: "center" },
  moodEmoji: { fontSize: 24 },
});

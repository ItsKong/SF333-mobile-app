// app/giver/CareGiverHome.tsx

import { useGiver } from "@/contexts/GiverContexts";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export default function GiverHome() {
  const router = useRouter();
  const {pastMoods, tasks, todayMood} = useGiver();

  // const todayMood = "😕"; // mood วันนี้
  // const pastMoods = ["🙂", "😀", "😐", "😴", "🙂", "😀", "😕"]; // mood 7 วัน

  // const tasks = [
  //   { id: 1, title: "Take a shower", status: "DONE" },
  //   { id: 2, title: "Have a lunch", status: "DONE" },
  //   { id: 3, title: "Brush teeth", status: "MISSED" },
  //   { id: 4, title: "Brush teeth", status: "MISSED" },
  // ];



  return (
    <View style={{ flex: 1, position: "relative" }}>
      <ScrollView style={styles.container}>
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

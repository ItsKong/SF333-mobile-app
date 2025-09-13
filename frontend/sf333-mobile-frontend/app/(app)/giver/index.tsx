import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export default function CareGiverHome() {
  const router = useRouter();

  const todayMood = "😕"; // mood วันนี้
  const pastMoods = ["🙂", "😀", "😐", "😴", "🙂", "😀", "😕"]; // mood 7 วัน

  const tasks = [
    { id: 1, title: "Take a shower", status: "DONE" },
    { id: 2, title: "Have a lunch", status: "DONE" },
    { id: 3, title: "Brush teeth", status: "MISSED" },
  ];

  return (
    <View style={{ flex: 1, position: "relative" }}>
      <ScrollView style={styles.container}>
        {/* Back Button */}
        <Pressable style={styles.backButton} onPress={() => router.replace("/(auth)/login")}>
          <AntDesign name="left-circle" size={37} color="#5E6CA8" />
        </Pressable>

        {/* Today's Mood */}
        <Text style={styles.header}>Poom’s today mood</Text>
        <Text style={styles.moodEmoji}>{todayMood}</Text>

        {/* Mood History */}
        <Text style={styles.subHeader}>Poom’s mood in past 7 days:</Text>
        <View style={styles.moodRow}>
          {pastMoods.map((m, index) => (
            <Text key={index} style={styles.moodHistory}>{m}</Text>
          ))}
        </View>

        {/* Task status */}
        <Text style={styles.subHeader}>Today's tasks status</Text>
        <View style={styles.taskContainer}>
          {tasks.map((task) => (
            <View key={task.id} style={styles.taskCard}>
              <Text style={styles.taskTitle}>{task.title}</Text>
              <Text style={[styles.taskStatus, task.status === "DONE" ? styles.done : styles.missed]}>
                {task.status}
              </Text>
            </View>
          ))}
        </View>

        {/* Add Another Task */}
        <Pressable style={styles.addTaskBtn} onPress={() => router.replace("/giver/add-task")}>
          <Text style={styles.addTaskText}>ADD ANOTHER TASK</Text>
        </Pressable>
      </ScrollView>

      {/* Bottom padding fixed at bottom */}
      <View style={{ height: 100, width: "100%", backgroundColor: "#5A5A5A",
         position: "absolute", bottom: 0, justifyContent: "center", alignItems: "center" }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  backButton: {
    position: "absolute",
    left: "7%",
    top: "5%",
  },
  header: {
    marginTop: 60,
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
    color: "#000"
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
  addTaskBtn: {
    marginTop: 20,
    backgroundColor: "#CADDF0",
    padding: 15,
    borderRadius: 10,
    borderColor: "#323B45",
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  addTaskText: {
    color: "#323B45",
    fontSize: 16,
    fontWeight: "bold",
  },
});

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

interface TaskItem {
  id: string;
  name: string;
  date?: string;
  time: string;
  frequency?: "everyday" | "weekly";
}

export default function AddTask() {
  const router = useRouter();

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState<TaskItem[]>([
    {
      id: "1",
      name: "Take a shower",
      date: "Everyday",
      time: "08:00 AM",
      frequency: "everyday",
    },
    {
      id: "2",
      name: "Have a lunch",
      date: "Everyday",
      time: "08:15 AM",
      frequency: "everyday",
    },
    {
      id: "3",
      name: "Brush teeth",
      date: "Everyday",
      time: "08:30 AM",
      frequency: "everyday",
    },
    {
      id: "4",
      name: "Meet friends",
      date: "15/09/25",
      time: "01:30 PM",
      frequency: "weekly",
    },
  ]);

  // Add new task
  const handleAddTask = () => {
    if (task.trim() !== "" && time.trim() !== "") {
      const newTask: TaskItem = {
        id: Date.now().toString(),
        name: task,
        date: date.trim() !== "" ? date : "Everyday",
        time,
        frequency: "everyday",
      };
      setTasks([...tasks, newTask]);
      setTask("");
      setDate("");
      setTime("");
    }
  };

  // Delete task
  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  // Go to edit-task page
  const handleEditTask = (task: TaskItem) => {
    router.push({
      pathname: "/giver/edit-task",
      params: {
        id: task.id,
        name: task.name,
        date: task.date || "",
        time: task.time,
      },
    });
  };

  return (
    <LinearGradient colors={["#f8fafc", "#f1f5f9"]} style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.header}>ADD ANOTHER TASK</Text>
      </View>

      {/* Add Task Form */}
      <View style={styles.card}>
        {/* Date Today */}
        <View style={styles.dateBox}>
          <Text style={styles.dateText}>
            {new Date()
              .toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "2-digit",
              })
              .replace(/\s/g, " / ")}
          </Text>
        </View>

        {/* Task Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Task name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter task name"
            value={task}
            onChangeText={setTask}
          />
        </View>

        {/* Time */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Time</Text>
          <TextInput
            style={styles.input}
            placeholder="12:00 AM"
            value={time}
            onChangeText={setTime}
          />
        </View>

        {/* Add Button */}
        <Pressable onPress={handleAddTask} style={styles.addBtnWrapper}>
          <LinearGradient colors={["#5E6CA8", "#5463a8ff"]} style={styles.addBtn}>
            <Text style={styles.addBtnText}>ADD TASK</Text>
          </LinearGradient>
        </Pressable>
      </View>

      {/* Task List */}
      <Text style={styles.taskTitle}>ALL TASKS</Text>
      <FlatList
        data={tasks}
        numColumns={2}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => handleEditTask(item)}
            style={{ flex: 1 }}
          >
            <View style={styles.taskCard}>
              <View style={styles.taskHeader}>
                <View>
                  <Text style={styles.taskName}>{item.name}</Text>
                  <Text style={styles.taskFrequency}>
                    {item.frequency || ""}
                  </Text>
                </View>
                <Pressable onPress={() => handleDeleteTask(item.id)}>
                  <Ionicons name="trash-outline" size={20} color="#e11d48" />
                </Pressable>
              </View>
              <View style={styles.timeBox}>
                <Text style={styles.taskTime}>{item.time}</Text>
              </View>
            </View>
          </Pressable>
        )}
        contentContainerStyle={styles.taskGrid}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e293b",
    flex: 1,
  },
  card: {
    backgroundColor: "#DBE8F5",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 30,
  },
  dateBox: {
    backgroundColor: "#F9F9F9",
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: "center",
  },
  dateText: {
    color: "#737171ff",
    fontWeight: "600",
  },
  inputGroup: { marginBottom: 15 },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 6,
    color: "#334155",
  },
  input: {
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  addBtnWrapper: { marginTop: 10 },
  addBtn: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  addBtnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  taskTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 10,
  },
  taskGrid: { paddingBottom: 40 },
  taskCard: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    margin: 6,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3,
  },
  taskHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  taskName: { fontSize: 16, fontWeight: "600", color: "#0f172a" },
  taskFrequency: { fontSize: 12, color: "#64748b", textTransform: "capitalize" },
  timeBox: {
    backgroundColor: "#f1f5f9",
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: "center",
  },
  taskTime: { fontSize: 14, fontWeight: "500", color: "#1e293b" },
});

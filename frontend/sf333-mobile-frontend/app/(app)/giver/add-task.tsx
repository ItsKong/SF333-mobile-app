import AntDesign from "@expo/vector-icons/AntDesign";
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
}

export default function AddTask() {
  const router = useRouter();

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState<TaskItem[]>([
    { id: "1", name: "Take a shower", date: "Everyday", time: "08:00 AM" },
    { id: "2", name: "Have a lunch", date: "Everyday", time: "08:15 AM" },
    { id: "3", name: "Brush teeth", date: "Everyday", time: "08:30 AM" },
    { id: "4", name: "Meet friends", date: "15/09/25", time: "01:30 PM" },
  ]);

  const handleAddTask = () => {
    if (task.trim() !== "" && time.trim() !== "") {
      const newTask: TaskItem = {
        id: Date.now().toString(),
        name: task,
        date: date.trim() !== "" ? date : "Everyday",
        time,
      };
      setTasks([...tasks, newTask]);
      setTask("");
      setDate("");
      setTime("");
    }
  };

  return (
    <View style={styles.container}>
      {/* Back button */}
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <AntDesign name="left-circle" size={37} color="#5E6CA8" />
      </Pressable>

      {/* Header */}
      <Text style={styles.header}>ADD ANOTHER TASK</Text>

      {/* Task input box */}
      <View style={styles.inputBox}>
        <TextInput
          style={styles.dateInput}
          placeholder="dd / mm / yy"
          value={date}
          onChangeText={setDate}
        />
        <TextInput
          style={styles.taskInput}
          placeholder="Task name"
          value={task}
          onChangeText={setTask}
        />
        <TextInput
          style={styles.timeInput}
          placeholder="12:00 AM"
          value={time}
          onChangeText={setTime}
        />
      </View>

      {/* Add button */}
      <Pressable style={styles.addBtn} onPress={handleAddTask}>
        <Text style={styles.addBtnText}>ADD TASK</Text>
      </Pressable>

      {/* Task list */}
      <Text style={styles.taskTitle}>ALL TASK</Text>
      <FlatList
        data={[...tasks, { id: "plus", name: "+", time: "" }]}
        numColumns={2}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            style={[
              styles.taskBox,
              item.id === "plus" ? { backgroundColor: "#FFF4DC" } : {},
            ]}
            onPress={item.id === "plus" ? handleAddTask : undefined}
          >
            {item.id !== "plus" && (
              <>
                <Text style={styles.taskDate}>{item.date}</Text>
                <Text style={styles.taskText}>{item.name}</Text>
                <Text style={styles.taskTime}>{item.time}</Text>
              </>
            )}
            {item.id === "plus" && <Text style={styles.taskText}>+</Text>}
          </Pressable>
        )}
        contentContainerStyle={styles.taskGrid}
      />
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
    marginTop: 80,
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },
  inputBox: {
    marginTop: 20,
    backgroundColor: "#E6EEF8",
    borderRadius: 10,
    padding: 15,
  },
  dateInput: {
    backgroundColor: "#A7C7E7",
    borderRadius: 10,
    padding: 10,
    textAlign: "center",
    fontSize: 16,
    marginBottom: 10,
  },
  taskInput: {
    backgroundColor: "#D9D9D9",
    borderRadius: 10,
    padding: 10,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  timeInput: {
    backgroundColor: "#D9D9D9",
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    textAlign: "center",
  },
  addBtn: {
    marginTop: 20,
    backgroundColor: "#5E6CA8",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  addBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  taskTitle: {
    fontSize: 23,
    marginTop: 30,
    fontWeight: "600",
  },
  taskGrid: {
    marginTop: 20,
  },
  taskBox: {
    flex: 1,
    height: 100,
    margin: 8,
    backgroundColor: "#e6eefc",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
  },
  taskText: {
    fontSize: 16,
    fontWeight: "600",
  },
  taskDate: {
    fontSize: 12,
    color: "#333",
  },
  taskTime: {
    fontSize: 14,
    color: "#333",
  },
});

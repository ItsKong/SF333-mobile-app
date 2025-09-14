import AntDesign from "@expo/vector-icons/AntDesign";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function EditTask() {
  const router = useRouter();
  const { id, name, date, time, description } = useLocalSearchParams();

  const [task, setTask] = useState(name as string);
  const [taskDate, setTaskDate] = useState(date as string);
  const [taskTime, setTaskTime] = useState(time as string);
  const [taskDescription, setTaskDescription] = useState(
    (description as string) || ""
  );

  const handleSave = () => {
    // TODO: update tasks in global state /storage
    console.log("Saving task:", {
      id,
      task,
      taskDate,
      taskTime,
      taskDescription,
    });
    router.back();
  };

  return (
    <LinearGradient colors={["#f8fafc", "#f1f5f9"]} style={styles.container}>
      {/* Back Button for Home Screen */}
      <View style={styles.backButton}>
        <Pressable onPress={() => router.replace("/(auth)/login")}>
          <AntDesign name="left-circle" size={37} color="#5E6CA8" />
        </Pressable>
      </View>

      <View style={styles.headerContainer}>
        <Text style={styles.header}>EDIT TASK</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Task name</Text>
          <TextInput style={styles.input} value={task} onChangeText={setTask} />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Date</Text>
          <TextInput
            style={styles.input}
            value={taskDate}
            onChangeText={setTaskDate}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Time</Text>
          <TextInput
            style={styles.input}
            value={taskTime}
            onChangeText={setTaskTime}
          />
        </View>

        {/* New Description Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, { height: 80, textAlignVertical: "top" }]}
            value={taskDescription}
            onChangeText={setTaskDescription}
            placeholder="Enter task details..."
            multiline
          />
        </View>

        <Pressable onPress={handleSave} style={styles.saveBtnWrapper}>
          <LinearGradient
            colors={["#5E6CA8", "#5463a8ff"]}
            style={styles.saveBtn}
          >
            <Text style={styles.saveBtnText}>SAVE TASK</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  backButton: {
    position: "absolute",
    left: "7%",
    top: "5%",
  },
  container: { flex: 1, padding: 20 },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 80,
    marginBottom: 20,
    gap: 10,
  },
  header: { fontSize: 24, fontWeight: "bold", color: "#1e293b" },
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
  inputGroup: { marginBottom: 15 },
  label: { fontSize: 14, fontWeight: "500", marginBottom: 6, color: "#334155" },
  input: {
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  saveBtnWrapper: { marginTop: 10 },
  saveBtn: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  saveBtnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});

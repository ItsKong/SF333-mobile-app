import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import useDatePicker from "@/hooks/useDatePicker";
import { iosDatePicker } from "@/styles/iosDatePicker";
import useTimePicker from "@/hooks/useTimePicker";
import DropDownPicker from "react-native-dropdown-picker";

interface TaskParams {
  id: string;
  title: string;
  due_time: string;
  date: string;
  frequency: string;
  description?: string; // description is optional
  pageState: string;
  docId: string;
  linked_id: string;
}

export default function EditmodifyTaskTask() {
  const router = useRouter();
  const params = useLocalSearchParams() as unknown as Partial<TaskParams>;
  const [id, setId] = useState("");
  const [paramTime, setParamTime] = useState("");
  const [paramDate, setParamDate] = useState("");
  const [paramtask, setparamTask] = useState("");
  const [paramtaskDescription, setparamTaskDescription] = useState("");
  const [task, setTask] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [pageState, setPageState] = useState("");
  const [pardocId, setDocId] = useState("");
  const [parlinked_id, setLinked_id] = useState("");

  //dropdown value here!
  const [frequen, setFrequen] = useState(null);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: "Daily", value: "Daily" },
    { label: "Weekly", value: "Weekly" },
    { label: "Once", value: "Once" },
  ]);
  //===========================
  const { dateOfBirth, toggleDatepicker, renderDatePicker, setDateOfBirth } =
    useDatePicker();
  const { selectedTime, toggleTimepicker, renderTimePicker } = useTimePicker();

  useFocusEffect(
    useCallback(() => {
      const {
        id,
        title,
        date,
        due_time,
        description,
        pageState,
        docId,
        linked_id,
      } = params;
      setPageState(pageState as any);
      if (id) setId(id);
      if (title) setparamTask(title);
      if (date) setParamDate(date);
      if (due_time) setParamTime(due_time);
      if (docId) setDocId(docId);
      if (linked_id) setLinked_id(linked_id);
      setparamTaskDescription((description as string) || "");
      // console.log(docId, linked_id);
      return () => null;
    }, [params])
  );

  const handleSave = async () => {
    // TODO: update tasks in global state /storage
    // 1.update local first for UI update
    // 2.synce to server
    // const {
    //   title,
    //   content,
    //   due_time,
    //   status,
    //   frequency,
    //   created_by, // Firestore document ID (e.g., "abc123xyz") of the user creating the task
    //   assigned_to, // Optional: Firestore document ID to override auto-assignment
    // } = req.body;
    if (pageState === "add") {
      try {
        const formdata = {
          title: task,
          content: taskDescription ? taskDescription : paramtaskDescription,
          due_time: selectedTime ? selectedTime : paramTime,
          status: "MISSING",
          frequency: frequen,
          created_by: pardocId,
          assigned_to: parlinked_id,
        };

        const addTaskreq = await fetch(
          process.env.EXPO_PUBLIC_POST_TASKDATA as string,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formdata),
          }
        );

        const addTaskData = await addTaskreq.json();

        if (addTaskData.success) {
          console.log(addTaskData.message);
          console.log("Task data: ", addTaskData.data);
        } else {
          console.log("Add task Error: ", addTaskData.error);
          Alert.alert("Error", "Something wrong.");
        }
      } catch (e) {
        console.log("Try add task Error: ", e);
      }
    } else {
      try {
        const formdata = {
          title: task,
          content: taskDescription ? taskDescription : paramtaskDescription,
          due_time: selectedTime ? selectedTime : paramTime,
          frequency: frequen,
          created_by: pardocId,
          assigned_to: parlinked_id,
        };
      } catch (e) {
        console.log("Edit task Error: ", e);
      }
    }
  };

  return (
    <LinearGradient colors={["#f8fafc", "#f1f5f9"]} style={styles.container}>
      {/* Back Button for Home Screen */}
      <View style={styles.backButton}>
        <Pressable onPress={() => router.replace("/tasks")}>
          <MaterialCommunityIcons
            name="arrow-left-circle"
            size={43}
            color="#5E6CA8"
          />
        </Pressable>
      </View>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>
          {pageState === "add" ? "ADD TASK" : "EDIT TASK"}
        </Text>
      </View>
      <View style={styles.card}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Task name</Text>
          <TextInput
            style={styles.input}
            value={task ? task : paramtask}
            onChangeText={setTask}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Date</Text>
          <Pressable onPress={toggleDatepicker}>
            <Text style={[styles.input]}>
              {dateOfBirth ? dateOfBirth : paramDate}
            </Text>
          </Pressable>
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Time</Text>
          <Pressable onPress={toggleTimepicker}>
            <Text style={[styles.input]}>
              {selectedTime ? selectedTime : paramTime}
            </Text>
          </Pressable>
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Frequency</Text>
          <DropDownPicker
            open={open}
            value={frequen}
            items={items}
            setOpen={setOpen}
            setValue={setFrequen}
            setItems={setItems}
            placeholder=""
            listMode="SCROLLVIEW"
            style={styles.FrequencyDropdown}
          />
        </View>
        {/* New Description Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, { height: 80, textAlignVertical: "top" }]}
            value={taskDescription ? taskDescription : paramtaskDescription}
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
        {renderDatePicker()}
        {renderTimePicker()}
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
  FrequencyDropdown: {
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
});

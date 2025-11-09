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
import { useGiver } from "@/contexts/GiverContexts";
import { TaskItem } from "@/types/data.type";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface TaskParams {
  id: string;
  pageState: string;
  docId: string;
  linked_id: string;
}

export default function EditmodifyTaskTask() {
  const router = useRouter();
  const params = useLocalSearchParams() as unknown as Partial<TaskParams>;
  const { tasks } = useGiver();
  const [id, setId] = useState("");
  const [task, setTask] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [pageState, setPageState] = useState("");
  const [pardocId, setDocId] = useState("");
  const [parlinked_id, setLinked_id] = useState("");
  const [matchedTask, setmatchedTask] = useState<TaskItem>();

  //dropdown value here!
  const [frequen, setFrequen] = useState(null);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: "Daily", value: "Daily" },
    { label: "Weekly", value: "Weekly" },
    { label: "Once", value: "Once" },
  ]);
  //===========================
  const {
    date,
    setDate,
    formatedDate,
    toggleDatepicker,
    renderDatePicker,
    setFormatedDate,
  } = useDatePicker();
  const { selectedTime, setSelectedTime, toggleTimepicker, renderTimePicker } =
    useTimePicker();

  useFocusEffect(
    useCallback(() => {
      const { id, pageState, docId, linked_id } = params;
      setPageState(pageState as any);
      if (id) setId(id);
      if (docId) setDocId(docId);
      if (linked_id) setLinked_id(linked_id);
      const getmatch = tasks.find((task) => task.id === id);
      console.log("enter modify task date: ", getmatch?.due_date);
      if (getmatch) {
        setmatchedTask(getmatch);
        setTask(getmatch.title);
        setFrequen(getmatch.frequency as any);
        setFormatedDate(getmatch.due_date as any);
        setTaskDescription(getmatch.content as any);
        setSelectedTime(getmatch.due_time);
      }
      console.log("Modify page: ", matchedTask);
      return () => null;
    }, [])
  );

  const handleSave = async () => {
    // TODO: update tasks in global state /storage
    // 1.update local first for UI update
    // 2.synce to server

    if (pageState === "add") {
      if (!formatedDate) {
        Alert.alert("Please enter date");
        return;
      }
      const [day, month, year] = formatedDate.split("/");
      const formDate = `${year}-${month}-${day}T${selectedTime}:00Z`;
      console.log("ISO DATE: ", formDate);
      try {
        const formdata = {
          title: task,
          content: taskDescription,
          due_date: formDate,
          due_time: selectedTime,
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
          Alert.alert("Add Task Successfully.", "Task have been added.", [
            {
              text: "OK",
              onPress: () => {
                router.back();
              },
            },
          ]);
        } else {
          console.log("Add task Error: ", addTaskData.error);
          Alert.alert(
            "Edit task Error.",
            "Something wrong. Please try again later.",
            [
              {
                text: "OK",
                onPress: () => {},
              },
            ]
          );
        }
      } catch (e) {
        console.log("Try add task Error: ", e);
        Alert.alert("Edit task Error.", `Error: ${e}`, [
          {
            text: "OK",
            onPress: () => {},
          },
        ]);
      }
    } else {
      try {
        // edit => update obj and sync server
        const [day, month, year] = formatedDate.split("/");
        const formDate = `${year}-${month}-${day}T${selectedTime? selectedTime: matchedTask?.due_time}:00Z`;
        const formdata = {
          title: task ? task : matchedTask?.title,
          content: taskDescription ? taskDescription : matchedTask?.content,
          due_time: selectedTime ? selectedTime : matchedTask?.due_time,
          due_date: formatedDate ? formDate : matchedTask?.due_date,
          frequency: frequen ? frequen : matchedTask?.frequency,
          created_by: pardocId,
          assigned_to: parlinked_id,
        };

        const editreq = await fetch(
          `${process.env.EXPO_PUBLIC_POST_TASKDATA}/${id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formdata),
          }
        );

        const editres = await editreq.json();
        if (editreq.ok) {
          console.log("Edit task Success: ", editres.message);
          Alert.alert("Edit Task Successfully.", "Task have been updated.", [
            {
              text: "OK",
              onPress: () => {
                router.back();
              },
            },
          ]);
        } else {
          console.log("Edit task Error: ", editres.error);
          Alert.alert(
            "Edit task Error.",
            "Something wrong. Please try again later.",
            [
              {
                text: "OK",
                onPress: () => {},
              },
            ]
          );
        }
      } catch (e) {
        console.log("Edit task Error: ", e);
        Alert.alert("Edit task Error.", `Error: ${e}`, [
          {
            text: "OK",
            onPress: () => {},
          },
        ]);
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
          <TextInput style={styles.input} value={task} onChangeText={setTask} />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Date</Text>
          <Pressable onPress={toggleDatepicker}>
            <Text style={[styles.input]}>{formatedDate}</Text>
          </Pressable>
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Time</Text>
          <Pressable onPress={toggleTimepicker}>
            <Text style={[styles.input]}>{selectedTime}</Text>
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

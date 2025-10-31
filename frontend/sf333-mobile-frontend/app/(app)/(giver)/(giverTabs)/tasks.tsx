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
import { taskStyle } from "@/styles/giverTasks.style";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
interface TaskItem {
  id: string;
  name: string;
  date?: string;
  time: string;
  frequency?: "everyday" | "weekly";
}

export default function tasks() {
  const router = useRouter();
  const ICON_SIZE = 64; // Match your icon size

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
  // Helper function to create a deep copy of the array and duplicate items
  const duplicateTasks = (
    originalTasks: TaskItem[],
    duplicateCount: number
  ): TaskItem[] => {
    let newTasks: TaskItem[] = [...originalTasks]; // Start with the original tasks
    let nextId = originalTasks.length + 1; // Start IDs after the last original ID (4 in your case)

    // Loop 'duplicateCount' times to generate the desired number of copies
    for (let i = 0; i < duplicateCount; i++) {
      // Loop through each task in the original list
      originalTasks.forEach((task) => {
        // Create a shallow copy of the task object
        const duplicatedTask = { ...task };

        // Assign a new, unique ID to the duplicated task
        duplicatedTask.id = String(nextId++);

        // Add the duplicated task to the new array
        newTasks.push(duplicatedTask);
      });
    }

    return newTasks;
  };
  const DUPLICATION_FACTOR = 5;
  const initialTasks: TaskItem[] = [
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
  ];

  const longerTaskList = duplicateTasks(initialTasks, DUPLICATION_FACTOR);

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
      pathname: "/modifyTask",
      params: {
        id: task.id,
        name: task.name,
        date: task.date || "",
        time: task.time,
      },
    });
  };

  return (
    // <View style={{ flex: 1, position: "relative" }}>
    <LinearGradient colors={["#f8fafc", "#f1f5f9"]} style={taskStyle.container}>
      {/* Task List */}
      <Text style={taskStyle.header}>ALL TASKS</Text>
      <FlatList
        data={tasks}
        numColumns={2}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable onPress={() => handleEditTask(item)} style={{ flex: 1 }}>
            <View style={taskStyle.taskCard}>
              <View style={taskStyle.taskHeader}>
                <View>
                  <Text style={taskStyle.taskName}>{item.name}</Text>
                  <Text style={taskStyle.taskFrequency}>
                    {item.frequency || ""}
                  </Text>
                </View>
                <Pressable onPress={() => handleDeleteTask(item.id)}>
                  <Ionicons name="trash-outline" size={20} color="#e11d48" />
                </Pressable>
              </View>
              <View style={taskStyle.timeBox}>
                <Text style={taskStyle.taskTime}>{item.time}</Text>
              </View>
            </View>
          </Pressable>
        )}
        contentContainerStyle={taskStyle.taskGrid}
      />
      <View style={taskStyle.addTask}>
        <Pressable
          style={[
            taskStyle.addTaskBtn,
            {
              width: ICON_SIZE,
              height: ICON_SIZE,
              borderRadius: ICON_SIZE / 2, // Half of width/height makes a circle
              // backgroundColor: "#5E6CA8",
            },
          ]}
          onPress={() => {
            router.push("/modifyTask");
          }}
        >
          {/* <Entypo name="circle-with-plus" size={64} color="#5E6CA8"/> */}
          <FontAwesome name="plus-circle" size={ICON_SIZE} color="#c6d0fbff" />
        </Pressable>
      </View>
    </LinearGradient>
    // </View>
  );
}

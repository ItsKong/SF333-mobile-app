import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { taskStyle } from "@/styles/giverTasks.style";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useGiver } from "@/contexts/GiverContexts";

export default function tasks() {
  const router = useRouter();
  const ICON_SIZE = 64; // Match your icon size
  const {tasks} = useGiver();

  // Delete task
  const handleDeleteTask = (id: string) => {
    null;
  };

  const handleTaskInteract = (pageState: string, item?: any) => {
    if (item) {
      router.push({
        pathname: "/modifyTask",
        params: {
          id: item.id,
          name: item.title,
          date: item.date || "",
          time: item.due_time,
          pageState: pageState,
        },
      });
    } else {
      router.push({
        pathname: "/modifyTask",
        params: {
          pageState: pageState,
        },
      });
    }
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
          <Pressable
            onPress={() => handleTaskInteract("edit", item)}
            style={{ flex: 1 }}
          >
            <View style={taskStyle.taskCard}>
              <View style={taskStyle.taskHeader}>
                <View>
                  <Text style={taskStyle.taskName}>{item.title}</Text>
                  <Text style={taskStyle.taskFrequency}>
                    {item.frequency || ""}
                  </Text>
                </View>
                <Pressable onPress={() => handleDeleteTask(item.id)}>
                  <Ionicons name="trash-outline" size={20} color="#e11d48" />
                </Pressable>
              </View>
              <View style={taskStyle.timeBox}>
                <Text style={taskStyle.taskTime}>{item.due_time}</Text>
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
            handleTaskInteract("add");
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

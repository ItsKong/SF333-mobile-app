import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { taskStyle } from "@/styles/giverTasks.style";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useGiver } from "@/contexts/GiverContexts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "@/contexts/AuthProvider";

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


export default function tasks() {
  const router = useRouter();
  const ICON_SIZE = 64; // Match your icon size
  const { tasks } = useGiver();
  const { USER_DATA_KEY } = useAuth();
  const [docId, setDocId] = useState("");
  const [linked_id, setLinked_id] = useState("");

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const userD = await AsyncStorage.getItem(USER_DATA_KEY);
          if (!userD) {
            router.replace('/(auth)/LoginForm');
            AsyncStorage.clear();
            return;
          } else {
            const parseUser = await JSON.parse(userD)
            console.log("Task page:", parseUser.docId);
            setDocId(parseUser.docId)
            setLinked_id(parseUser.userData.linked_to)
          }
        } catch (error) {
          console.error("Error reading storage:", error);
        }
      };

      fetchData();
      return () => null;
    }, [])
  );

  // Delete task
  const handleDeleteTask = (id: string) => {
    null;
  };

  const handleTaskInteract = (pageState: string, item?: TaskParams) => {
    if (item) {
      router.push({
        pathname: "/modifyTask",
        params: {
          id: item.id,
          title: item.title,
          date: item.date || "",
          due_time: item.due_time,
          frequency: item.frequency,
          pageState: pageState,
          docId: docId,
          linked_id: linked_id,
        },
      });
    } else {
      router.push({
        pathname: "/modifyTask",
        params: {
          pageState: pageState,
          docId: docId,
          linked_id: linked_id,
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
            onPress={() => handleTaskInteract("edit", item as TaskParams)}
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

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { taskStyle } from "@/styles/giverTasks.style";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useGiver } from "@/contexts/GiverContexts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "@/contexts/AuthProvider";
import useGiverRefresh from "@/hooks/useGiverRefresh";

export default function tasks() {
  const router = useRouter();
  const ICON_SIZE = 64; // Match your icon size
  const { tasks, setTasks, STORAGE_KEY } = useGiver();
  const { USER_DATA_KEY } = useAuth();
  const [docId, setDocId] = useState("");
  const [linked_id, setLinked_id] = useState("");
  const [refreshing, setRefreshing] = React.useState(false);
  const { addTaskIndex } = useGiverRefresh();

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const userD = await AsyncStorage.getItem(USER_DATA_KEY);
          if (!userD) {
            router.replace("/(auth)/LoginForm");
            AsyncStorage.clear();
            return;
          } else {
            const parseUser = await JSON.parse(userD);
            console.log("Task page:", parseUser.docId);
            setDocId(parseUser.docId);
            setLinked_id(parseUser.userData.linked_to);
          }
        } catch (error) {
          console.error("Error reading storage:", error);
        }
      };

      fetchData();
      return () => null;
    }, [])
  );

  const onRefresh = React.useCallback(async () => {
    // fetch server
    setRefreshing(true);
    try {
      const getId = await AsyncStorage.getItem(USER_DATA_KEY);
      if (!getId) {
        router.replace("/(auth)/LoginForm");
        AsyncStorage.clear();
        return;
      }
      const parseID = JSON.parse(getId);
      const userTaskreq = await fetch(
        `${process.env.EXPO_PUBLIC_GET_TASKDATA_BYUSER}/${parseID.userData.linked_to}`
      );
      const userMoodreq = await fetch(
        `${process.env.EXPO_PUBLIC_GET_MOODDATA_BYUSER}/${parseID.userData.linked_to}`
      );

      const userTaskData = await userTaskreq.json();
      const userMoodData = await userMoodreq.json();

      if (userTaskData.success && userMoodData.success) {
        const formatTask = addTaskIndex(userTaskData.tasks);
        setTasks(formatTask);
      } else {
        console.log("Error fetching data: ", userTaskData);
      }
    } catch (e) {
      console.log("Refresh Error: ", e);
      Alert.alert("Error refreshing", `Something wrong. Error: ${e}`);
    }
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

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
    <View style={{ flex: 1, position: "relative" }}>
      <LinearGradient
        colors={["#f8fafc", "#f1f5f9"]}
        style={taskStyle.container}
      >
        {/* Task List */}
        <Text style={taskStyle.header}>ALL TASKS</Text>
        <FlatList
          data={tasks}
          numColumns={2}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => handleTaskInteract("edit", item as any)}
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
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
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
            <FontAwesome
              name="plus-circle"
              size={ICON_SIZE}
              color="#c6d0fbff"
            />
          </Pressable>
        </View>
      </LinearGradient>
    </View>
  );
}

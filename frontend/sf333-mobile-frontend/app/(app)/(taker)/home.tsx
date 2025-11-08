import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { takerStyles } from "@/styles/taker.style";
import { useTaker } from "@/contexts/TakerContexts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "@/contexts/AuthProvider";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

interface MoodItem {
  color: string;
  date: number;
  mood: string;
  emoji?: string | null;
}
interface TaskItem {
  id: string;
  title: string;
  due_time: string;
  date?: string;
  status?: string;
  created_by?: string;
  assigned_to?: string;
  describtion?: string;
  frequency?: "everyday" | "weekly";
}

const moodColors: Record<string, string> = {
  happy: "#BCE69B",
  sad: "#FFF176",
  angry: "#EE9A9A",
  neutral: "#C0C0C0",
};

const moodemoji: Record<string, string> = {
  happy: "😀",
  sad: "😥",
  angry: "😠",
};

export default function HomePage() {
  const router = useRouter();
  const {
    mood,
    setMood,
    date,
    setDate,
    isButtonPress,
    setIsButtonPress,
    pastmoods,
    setPastMoods,
    star,
    setStar,
    tasks,
    setTasks,
    TAKER_STORAGE_KEY,
  } = useTaker();
  const { USER_DATA_KEY } = useAuth();
  const [username, setUsername] = useState("");
  const [ispressed, setIspressed] = useState(false);
  const [isTaskPressed, setisTaskPressed] = useState(false);
  const [isdoing, setIsdoing] = useState<boolean>(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [todayMood, setTodayMood] = useState<MoodItem>({
    color: "#BCE69B",
    date: 0,
    mood: "neutral",
  });

  const handleLogout = async () => {
    try {
      Alert.alert("Logout", "Are you sure you want to logout?", [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            // Add your logout logic here
            console.log("User logged out");
            await AsyncStorage.clear();
            router.replace("/(auth)/LoginForm");
            // Example: clear auth tokens, navigate to login, etc.
          },
        },
      ]);
    } catch (error) {
      console.log("Error logout: ", error);
    }
  };

  const onRefresh = React.useCallback(async () => {
    // fetch server
    setRefreshing(true);
    try {
      const getId = await AsyncStorage.getItem(USER_DATA_KEY);
      if (!getId) {
        router.replace("/(auth)/LoginForm");
        return;
      }
      const parseID = JSON.parse(getId);
      const data = await AsyncStorage.getItem(TAKER_STORAGE_KEY);
      const userData = await AsyncStorage.getItem(USER_DATA_KEY);
      const userTaskreq = await fetch(
        `${process.env.EXPO_PUBLIC_GET_TASKDATA_BYUSER}/${parseID.docId}`
      );
      const userMoodreq = await fetch(
        `${process.env.EXPO_PUBLIC_GET_MOODDATA_BYUSER}/${parseID.docId}`
      );

      const userTaskData = await userTaskreq.json();
      const userMoodData = await userMoodreq.json();

      if (data && userData) {
        const parseData = JSON.parse(data);
        setPastMoods(parseData.pastmoods);
        setTasks(parseData.tasks);
        setStar(parseData.star);
      }
    } catch (e) {
      console.log("Refresh Error: ", e);
    }
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const addStar = async () => {
    try {
      setStar((prev: number[]) => {
        const newStarCount = prev.length + 1;
        return Array.from({ length: newStarCount }, (_, i) => i + 1);
      });
    } catch (e) {
      console.log("Add Star Error: ", e);
    }
  };
  const handerMoodtracking = () => {
    router.push("/(app)/(taker)/moodTracking");
    setIspressed(!ispressed);
    console.log(todayMood);
  };
  const handleTaskChoice = (choice: boolean) => {
    if (choice) addStar();
    setIsdoing(choice);
    setisTaskPressed(!isTaskPressed);
    console.log(!isdoing);
  };

  const TaskOutput = () => {
    return (
      <>
        {isdoing ? (
          <Text style={takerStyles.ratingTitle}>Greate job. You got a ⭐</Text>
        ) : (
          <Text style={takerStyles.ratingTitle}>
            that's ok, don't forget to do it.
          </Text>
        )}

        <Text>Your star:</Text>
        {/* stars go here! */}
        <View style={takerStyles.starRow}>
          {star.map((star) => (
            <Text key={star} style={takerStyles.star}>
              ⭐
            </Text>
          ))}
        </View>
        <Pressable
          style={({ pressed }) => [
            takerStyles.teskchoice,
            { backgroundColor: pressed ? "#86cd89ff" : "#66BB6A" },
          ]}
          onPress={() => handleTaskChoice(false)}
        >
          <Text style={takerStyles.teskchoiceText}>back</Text>
        </Pressable>
      </>
    );
  };

  // ---------- Home ----------
  return (
    <View style={[{ flex: 1, position: "relative" }]}>
      <ScrollView
        contentContainerStyle={takerStyles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={takerStyles.greeting}>Hello {"username"}.</Text>
        <Pressable
          style={takerStyles.moodBox}
          onPress={() => handerMoodtracking()}
        >
          {isButtonPress ? (
            <View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View
                  style={[
                    takerStyles.moodCircle,
                    { backgroundColor: todayMood.color },
                  ]}
                />
                <Text style={takerStyles.todayyouare}>
                  {"  "}Today you are {todayMood.mood} {todayMood.emoji}
                </Text>
              </View>
              <View style={{ marginTop: 25 }}>
                <Text style={takerStyles.moodpastdays}>
                  Your pass 7 day mood:
                </Text>
                {/* balls go here! */}
                <View style={takerStyles.moodRow}>
                  {pastmoods.map((pastmood) => (
                    <View
                      key={pastmood.date}
                      style={[
                        takerStyles.moodCircle,
                        { backgroundColor: pastmood.color, marginTop: 10 },
                      ]}
                    />
                  ))}
                </View>
              </View>
            </View>
          ) : (
            <View>
              <Text style={takerStyles.howareyoutoday}>
                How are you feeling today?{" "}
              </Text>
            </View>
          )}
        </Pressable>

        {/* Shower Box */}
        <View style={takerStyles.box}>
          {isTaskPressed ? (
            TaskOutput()
          ) : (
            <>
              <Text style={takerStyles.taskContext}>
                Did you take a shower?
              </Text>
              <View style={takerStyles.showerRow}>
                <Pressable
                  style={({ pressed }) => [
                    takerStyles.teskchoice,
                    { backgroundColor: pressed ? "#86cd89ff" : "#66BB6A" },
                  ]}
                  onPress={() => handleTaskChoice(true)}
                >
                  <Text style={takerStyles.teskchoiceText}>YES</Text>
                </Pressable>
                <Pressable
                  style={({ pressed }) => [
                    takerStyles.teskchoice,
                    { backgroundColor: pressed ? "#df8989ff" : "#E57373" },
                  ]}
                  onPress={() => handleTaskChoice(false)}
                >
                  <Text style={takerStyles.teskchoiceText}>NO</Text>
                </Pressable>
              </View>
            </>
          )}
        </View>

        {/* Today Task */}
        <Text style={takerStyles.taskHeader}>Today's Tasks:</Text>
        <View style={takerStyles.taskBox}>
          {tasks.map((task) => (
            <View key={task.id} style={takerStyles.taskCard}>
              <View style={takerStyles.statusBarContent}>
                {task.status === "DONE" ? (
                  <View
                    style={[
                      takerStyles.statusBar,
                      { backgroundColor: "#73E34A" },
                    ]}
                  />
                ) : (
                  <View
                    style={[
                      takerStyles.statusBar,
                      { backgroundColor: "#FF2222" },
                    ]}
                  />
                )}
                <Text style={takerStyles.taskTitle}>{task.title}</Text>
              </View>
              <Text style={takerStyles.taskTime}>{task.due_time}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={takerStyles.sosContainer}>
        <View style={takerStyles.leftspacer} />
        <Pressable
          style={takerStyles.sosButton}
          onPress={() => console.log("SOS Pressed")}
        >
          <Text style={takerStyles.sosText}>SOS</Text>
        </Pressable>
        <Pressable
          style={takerStyles.logoutButton}
          onPress={() => handleLogout()}
        >
          <MaterialIcons
            style={{ textAlign: "center" }}
            name="logout"
            size={24}
            color={"#ffffff"}
          />
          <Text style={takerStyles.logoutText}>Logout</Text>
        </Pressable>
      </View>
    </View>
  );
}

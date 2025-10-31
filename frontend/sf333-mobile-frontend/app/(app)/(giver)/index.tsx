// FETCHING TASK MOOD DATA

import { cache, use, useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useGiver } from "@/contexts/GiverContexts";

// FETCHING DATA IN HERE!
// SEND USERNAME TO GET USER DATA.
interface TaskItem {
  id: number;
  title: string;
  time: string;
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

const STORAGE_KEY = "takerdata";

export default function AppIndex() {
  const { setPastMoods, setTasks, setTodayMood } = useGiver();
  const [isLoading, setIsLoading] = useState(true);
  const [minload, setminload] = useState(false);
  const { userRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchingUserData = async () => {
      try {

        const todayMood = { mood: "angry", date:0, color: "#EE9A9A", emoji: "😠"};
        const mooddata = [
          { date: 1, mood: "happy" },
          { date: 2, mood: "sad" },
          { date: 3, mood: "angry" },
          { date: 4, mood: "happy" },
          { date: 5, mood: "sad" },
          { date: 6, mood: "angry" },
          { date: 7, mood: "angry" },
        ];

        const tasks = [
          { id: 1, title: "Take a shower", status: "DONE" },
          { id: 2, title: "Have a lunch", status: "DONE" },
          { id: 3, title: "Brush teeth", status: "MISSED" },
          { id: 4, title: "Brush teeth", status: "MISSED" },
          { id: 5, title: "Brush teeth", status: "MISSED" },
          { id: 6, title: "Brush teeth", status: "MISSED" },
          { id: 7, title: "Brush teeth", status: "MISSED" },
        ];

        const stardata = 3;
        const starArr = Array.from({ length: stardata }, (_, i) => i + 1);

        const withColorEmoji = mooddata.map((item) => ({
          ...item,
          color: moodColors[item.mood],
          emoji: moodemoji[item.mood],
        }));

        // await AsyncStorage.setItem(
        //   STORAGE_KEY,
        //   JSON.stringify({
        //     pastmoods: withColor,
        //     tasks: tasksdata,
        //     star: starArr,
        //   })
        // );
        console.log(withColorEmoji)
        setPastMoods(withColorEmoji);
        setTasks(tasks);
        setTodayMood(todayMood);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load data:", error);
      }
    };

    fetchingUserData();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setminload(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // 2.
  useEffect(() => {
    if (!isLoading && minload) {
      router.replace("/(app)/(giver)/(giverTabs)/home");
    }
  }, [isLoading, minload, router]);

  // Show loading while redirecting
  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/fantistic-high-resolution-logo-transparent.png")} // ใส่ path ของรูปโลโก้คุณ
        style={styles.logo}
        resizeMode="contain"
      />
      <ActivityIndicator size="large" color="#000" style={{ marginTop: 20 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#DBE8F5",
  },
  logo: {
    width: 200,
    height: 200,
  },
});

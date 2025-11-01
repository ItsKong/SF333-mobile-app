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
  id: string;
  title: string;
  due_time: string;
  date: string;
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

export default function AppIndex() {
  const { setPastMoods, setTasks, setTodayMood, STORAGE_KEY } = useGiver();
  const [isLoading, setIsLoading] = useState(true);
  const [minload, setminload] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchingUserData = async () => {
      try {
        const storedData = await AsyncStorage.getItem(STORAGE_KEY);
        // fetching local is not สบาย for testing so skipy skipy
        if (!storedData) {
          // Parse and use stored data
          // const parsed = JSON.parse(storedData);
          // setPastMoods(parsed.pastmoods || []);
          // setTasks(parsed.tasks || []);
          // setTodayMood(parsed.todayMood || null);
        } else {
          const todayMood = {
            mood: "angry",
            date: 0,
            color: "#EE9A9A",
            emoji: "😠",
          };
          const mooddata = [
            { date: 1, mood: "happy"},
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

          const initialTasks: TaskItem[] = [
            {
              id: "1",
              title: "Take a shower",
              date: "1 Nov 2025",
              due_time: "08:00",
              frequency: "everyday",
              status: "DONE",
            },
            {
              id: "2",
              title: "Have a lunch",
              date: "15/09/25",
              due_time: "08:15",
              frequency: "everyday",
              status: "DONE",
            },
            {
              id: "3",
              title: "Brush teeth",
              date: "15/09/25",
              due_time: "08:30",
              frequency: "weekly",
              status: "DONE",
            },
            {
              id: "4",
              title: "Meet friends",
              date: "15/09/25",
              due_time: "01:30",
              frequency: "weekly",
              status: "DONE",
            },
             {
              id: "5",
              title: "Meet friends",
              date: "15/09/25",
              due_time: "01:30",
              frequency: "weekly",
              status: "MISSED"
            },
          ];

          // const stardata = 3;
          // const starArr = Array.from({ length: stardata }, (_, i) => i + 1);

          const withColorEmoji = mooddata.map((item) => ({
            ...item,
            color: moodColors[item.mood],
            emoji: moodemoji[item.mood],
          }));

          await AsyncStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
              pastmoods: withColorEmoji,
              tasks: initialTasks,
              todayMood: todayMood,
            })
          );

          console.log(withColorEmoji);
          setPastMoods(withColorEmoji);
          setTasks(initialTasks);
          setTodayMood(todayMood);
        }
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

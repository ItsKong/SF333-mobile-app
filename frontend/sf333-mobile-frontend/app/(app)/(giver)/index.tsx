// FETCHING TASK MOOD DATA

import { cache, use, useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useGiver } from "@/contexts/GiverContexts";
import { MoodItem } from "@/types/data.type";

// FETCHING DATA IN HERE!
// SEND USERNAME TO GET USER DATA.

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
  const {
    setPastMoods,
    setTasks,
    setTodayMood,
    TASK_STORAGE_KEY,
    MOOD_STORAGE_KEY,
    MOODTD_STORAGE_KEY,
  } = useGiver();
  const { USER_DATA_KEY } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [minload, setminload] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchingUserData = async () => {
      try {
        const storedData = await AsyncStorage.multiGet([
          TASK_STORAGE_KEY,
          MOODTD_STORAGE_KEY,
          MOOD_STORAGE_KEY,
        ]);
        const userdata = await AsyncStorage.getItem(USER_DATA_KEY);
        const taskDataString = storedData[0][1];
        const moodTodayDataString = storedData[1][1];
        const moodPastDataString = storedData[2][1];
        // fetching local is not สบาย for testing so skipy skipy
        if (taskDataString && moodTodayDataString && moodPastDataString) {
          // Parse and use stored data
          // storedData will look like this:
          // [
          //   [TASK_STORAGE_KEY, '{"tasks": [...]}' || null],
          //   [MOODTD_STORAGE_KEY, '{"todayMood": {...}}' || null],
          //   [MOOD_STORAGE_KEY, '{"pastmoods": [...]}' || null]
          // ]

          // Initialize variables for the parsed data
          let tasks = [];
          let todayMood = [];
          let pastMoods = [];
          // Parse the JSON strings if they exist
          tasks = JSON.parse(taskDataString).tasks;
          todayMood = JSON.parse(moodTodayDataString).todayMood;
          pastMoods = JSON.parse(moodPastDataString).pastmoods;
          console.log("Tasks:", tasks);
          console.log("Today's Mood:", todayMood);
          console.log("Past Moods:", pastMoods);
          setPastMoods(pastMoods);
          setTasks(tasks);
        } else if (!userdata) {
          router.replace("/(auth)/LoginForm");
          AsyncStorage.clear();
          return;
        } else {
          console.log("Giver loading fix data:");
          const parseUser = JSON.parse(userdata);
          const docId = parseUser.userData.linked_to;
          const userTaskreq = await fetch(
            `${process.env.EXPO_PUBLIC_GET_TASKDATA_BYUSER}/${docId}`
          );
          const userMoodreq = await fetch(
            `${process.env.EXPO_PUBLIC_GET_MOODDATA_BYUSER}/${docId}`
          );
          const userMoodTDreq = await fetch(
            `${process.env.EXPO_PUBLIC_GET_MOODTODAY_BYUSER}/${docId}`
          );
          console.log(
            "API path: ",
            `${process.env.EXPO_PUBLIC_GET_MOODTODAY_BYUSER}/${docId}`
          );
          const userTaskData = await userTaskreq.json();
          const userMoodData = await userMoodreq.json();
          const userMoodTDres = await userMoodTDreq.json();
          // console.log("userTask", userTaskData);
          // console.log("userMood", userMoodData);
          if (userMoodTDres.success) {
            console.log(userMoodTDres.moods);
          } else {
            console.log(userMoodTDres.error);
          }

          const rawtdmood = userMoodTDres.moods[0];
          const today_mood = {
            ...rawtdmood,
            color: moodColors[rawtdmood.mood],
            emoji: moodemoji[rawtdmood.mood],
            index: 1,
          };

          const taskwithIndexNum = userTaskData.tasks.map(
            (item: any, index: number) => {
              if (item.due_date && item.due_date._seconds !== undefined) {
                const firebasetime = item.due_date;
                // console.log("firebasetime", firebasetime);
                const milliseconds =
                  firebasetime._seconds * 1000 +
                  firebasetime._nanoseconds / 1000000;
                const dateObject = new Date(milliseconds);
                return {
                  ...item,
                  index: index + 1,
                  due_date: dateObject.toISOString(),
                };
              }
              return {
                ...item,
                index: index + 1,
              };
            }
          );

          const moodwithColorEmojiIndex = userMoodData.moods.map(
            (item: any, index: number) => {
              if (item.due_date && item.due_date._seconds !== undefined) {
                const firebasetime = item.due_date;
                // console.log("firebasetime", firebasetime);
                const milliseconds =
                  firebasetime._seconds * 1000 +
                  firebasetime._nanoseconds / 1000000;
                const dateObject = new Date(milliseconds);
                console.log(
                  "dateObject",
                  dateObject,
                  "Due time: ",
                  item.due_time
                );
                return {
                  ...item,
                  index: index + 1,
                  color: moodColors[item.mood],
                  emoji: moodemoji[item.mood],
                  due_date: dateObject,
                };
              }
              return {
                ...item,
                color: moodColors[item.mood],
                emoji: moodemoji[item.mood],
                index: index + 1,
              };
            }
          );

          // console.log("moodwithColorEmojiIndex: ", moodwithColorEmojiIndex)
          console.log("today_mood", today_mood);
          await AsyncStorage.setItem(
            TASK_STORAGE_KEY,
            JSON.stringify({
              tasks: taskwithIndexNum,
            })
          );

          await AsyncStorage.setItem(
            MOOD_STORAGE_KEY,
            JSON.stringify({
              pastmoods: moodwithColorEmojiIndex,
            })
          );

          await AsyncStorage.setItem(
            MOODTD_STORAGE_KEY,
            JSON.stringify({
              todayMood: today_mood,
            })
          );

          setPastMoods(moodwithColorEmojiIndex);
          setTasks(taskwithIndexNum);
          setTodayMood(today_mood);
        }
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setIsLoading(false);
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

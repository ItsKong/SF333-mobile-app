import { cache, use, useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTaker } from "@/contexts/TakerContexts";
import useGiverRefresh from "@/hooks/useGiverRefresh";

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
    setStar,
    MOOD_STORAGE_KEY,
    MOODTD_STORAGE_KEY,
    TASK_STORAGE_KEY,
    settodaymood,
    LAST_MOOD_RESET_KEY,
  } = useTaker();
  const { addMoodColorEmojiIndex, addTaskIndex, addTDMoodColorEmoji } =
    useGiverRefresh();
  const [isLoading, setIsLoading] = useState(true);
  const [minload, setminload] = useState(false);
  const { USER_DATA_KEY } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchingUserData = async () => {
      try {
        const userdata = await AsyncStorage.getItem(USER_DATA_KEY);
        if (!userdata) {
          router.replace("/(auth)/LoginForm");
          AsyncStorage.clear();
          return;
        }

        const storedData = await AsyncStorage.multiGet([
          TASK_STORAGE_KEY,
          MOODTD_STORAGE_KEY,
          MOOD_STORAGE_KEY,
        ]);

        const taskDataString = storedData[0][1];
        const moodTodayDataString = storedData[1][1];
        const moodPastDataString = storedData[2][1];

        if (taskDataString && moodTodayDataString && moodPastDataString) {
          let tasks = [];
          let todayMood = [];
          let pastMoods = [];
          // Parse the JSON strings if they exist
          const parseUser = JSON.parse(userdata);
          const star = parseUser.userData.stars_point;
          tasks = JSON.parse(taskDataString).tasks;
          todayMood = JSON.parse(moodTodayDataString).todayMood;
          pastMoods = JSON.parse(moodPastDataString).pastmoods;
          settodaymood(todayMood);
          setPastMoods(pastMoods);
          setTasks(tasks);
          setStar(star);
        } else {
          const parseUser = JSON.parse(userdata);
          console.log("Inside taker loaded userdata:", parseUser);
          const docId = parseUser.docId;
          const userTaskreq = await fetch(
            `${process.env.EXPO_PUBLIC_GET_TASKDATA_BYUSER}/${docId}`
          );
          const userMoodreq = await fetch(
            `${process.env.EXPO_PUBLIC_GET_MOODDATA_BYUSER}/${docId}`
          );
          const userMoodTDreq = await fetch(
            `${process.env.EXPO_PUBLIC_GET_MOODTODAY_BYUSER}/${docId}`
          );

          const userTaskData = await userTaskreq.json();
          const userMoodData = await userMoodreq.json();
          const userMoodTDres = await userMoodTDreq.json();
          // console.log("userTask", userTaskData);
          // console.log("userMood", userMoodData);
          // if (userMoodTDres.success) {
          //   console.log("userMoodTDres.message", userMoodTDres);
          // } else {
          //   console.log(userMoodTDres.error);
          // }
          const hastdmood = userMoodTDres.moods.length > 0;
          console.log("hastdmood", hastdmood);
          if (hastdmood) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            await AsyncStorage.setItem(
              LAST_MOOD_RESET_KEY,
              today.getTime().toString()
            );
            const today_mood = addTDMoodColorEmoji(userMoodTDres);
            console.log("today_mood", today_mood);
            settodaymood(today_mood);
            await AsyncStorage.setItem(
              MOODTD_STORAGE_KEY,
              JSON.stringify({
                todayMood: today_mood,
              })
            );
          } else {
            settodaymood(null as any);
          }
          const taskwithIndexNum = addTaskIndex(userTaskData.tasks);
          const moodwithColorEmojiIndex = addMoodColorEmojiIndex(
            userMoodData.moods.slice(0, 7)
          );

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

          setPastMoods(moodwithColorEmojiIndex);
          setTasks(taskwithIndexNum);
          setStar(parseUser.userData.stars_point);
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
      router.replace("/(app)/(taker)/home");
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

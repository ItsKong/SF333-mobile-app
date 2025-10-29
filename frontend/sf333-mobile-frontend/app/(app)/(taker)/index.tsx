import { cache, use, useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTaker } from "@/contexts/TakerContexts";

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


const STORAGE_KEY = "takerdata";

export default function AppIndex() {
  // const [pastmoods, setPastMoods] = useState<MoodItem[]>([]);
  // const [star, setStar] = useState<number[]>([]);
  // const [tasks, setTasks] = useState<TaskItem[]>([]);
  const { setPastMoods, setTasks, setStar } = useTaker();
  const [isLoading, setIsLoading] = useState(true);
  const [minload, setminload] = useState(false);
  const { userRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchingUserData = async () => {
      try {
        const mooddata = [
          { date: 1, mood: "happy" },
          { date: 2, mood: "sad" },
          { date: 3, mood: "angry" },
          { date: 4, mood: "happy" },
          { date: 5, mood: "sad" },
          { date: 6, mood: "angry" },
          { date: 7, mood: "angry" },
        ];

        const tasksdata: TaskItem[] = [
          { id: 1, title: "Make a bed", time: "08:00 AM" },
          { id: 2, title: "Brush teeth", time: "08:15 AM" },
          { id: 3, title: "Take a shower", time: "08:30 AM" },
          { id: 4, title: "Make a bed", time: "08:00 AM" },
          { id: 5, title: "Brush teeth", time: "08:15 AM" },
          { id: 7, title: "Take a shower", time: "08:30 AM" },
        ];

        const stardata = 3;
        const starArr = Array.from({ length: stardata }, (_, i) => i + 1);

        const withColor = mooddata.map((item) => ({
          ...item,
          color: moodColors[item.mood],
        }));

        // await AsyncStorage.setItem(
        //   STORAGE_KEY,
        //   JSON.stringify({
        //     pastmoods: withColor,
        //     tasks: tasksdata,
        //     star: starArr,
        //   })
        // );

        setPastMoods(withColor);
        setTasks(tasksdata);
        setStar(starArr);
        setIsLoading(false)
      } catch (error) {
        console.error("Failed to load data:", error);
      }
    };

    fetchingUserData();
  }, []);

    useEffect(() => {
      const timer = setTimeout(() => {
          setminload(true)
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

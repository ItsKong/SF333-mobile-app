import { cache, use, useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTaker } from "@/contexts/TakerContexts";

// FETCHING DATA IN HERE!
// SEND USERNAME TO GET USER DATA.

export default function AppIndex() {
  // const [pastmoods, setPastMoods] = useState<MoodItem[]>([]);
  // const [star, setStar] = useState<number[]>([]);
  // const [tasks, setTasks] = useState<TaskItem[]>([]);
  // const {setPastMoods, setTasks, setStar} = useTaker();
  const { userRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
      if (userRole === "caregiver") {
        router.replace("/(app)/(giver)");
      } else {
        router.replace("/(app)/(taker)");
      }
  }, []);

  // Show loading while redirecting
  return (
    <></>
  );
}
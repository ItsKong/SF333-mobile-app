import { router, useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { takerStyles } from "@/styles/taker.style";
import { useTaker } from "@/contexts/TakerContexts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "@/contexts/AuthProvider";
import { MoodItem } from "@/types/data.type";

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

export default function MoodTracking() {
  const {
    todaymood,
    settodaymood,
    setIsButtonPress,
    MOODTD_STORAGE_KEY,
    LAST_MOOD_RESET_KEY,
  } = useTaker();
  const { USER_DATA_KEY } = useAuth();
  const handlePress = async (mood: string) => {
    try {
      const userstorage = await AsyncStorage.getItem(USER_DATA_KEY);
      if (!userstorage) {
        router.replace("/(auth)/LoginForm");
        AsyncStorage.clear();
        return;
      } else {
        const parseuser = await JSON.parse(userstorage);
        const newMood = {
          color: moodColors[mood],
          date: new Date(),
          mood: mood,
          emoji: moodemoji[mood],
        };
        settodaymood(newMood as MoodItem);

        await AsyncStorage.setItem(
          MOODTD_STORAGE_KEY,
          JSON.stringify({
            today_mood: newMood,
          })
        );

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        await AsyncStorage.setItem(
          LAST_MOOD_RESET_KEY,
          today.getTime().toString()
        );

        const moodform = {
          mood: mood,
          record_by: parseuser.docId,
          record_time: new Date(),
        };

        const tdmoodreq = await fetch(
          `${process.env.EXPO_PUBLIC_POST_MOODDATA}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(moodform),
          }
        );

        const tdmoodres = await tdmoodreq.json();
        if (tdmoodres.success) {
          console.log("Send TDmoon success: ", tdmoodres.message);
        } else {
          console.log("Send TDmoon Failed: ", tdmoodres.error);
        }
      }
    } catch (e) {
      console.log("Failed to send to server: ", e);
    } finally {
      setIsButtonPress(true);
      router.back();
    }
  };

  return (
    <View style={takerStyles.moodContainer}>
      {/* Back Button */}
      <Text style={takerStyles.headerBox}>Mood tracking</Text>
      <Text style={takerStyles.question}>How are you feeling?...</Text>

      <Pressable
        style={[takerStyles.moodButton, { backgroundColor: "#A5D6A7" }]}
        onPress={() => handlePress("happy")}
      >
        <Text style={takerStyles.moodText}>HAPPY</Text>
      </Pressable>

      <Pressable
        style={[takerStyles.moodButton, { backgroundColor: "#FFF176" }]}
        onPress={() => handlePress("sad")}
      >
        <Text style={takerStyles.moodText}>SAD</Text>
      </Pressable>

      <Pressable
        style={[takerStyles.moodButton, { backgroundColor: "#EF9A9A" }]}
        onPress={() => handlePress("angry")}
      >
        <Text style={takerStyles.moodText}>ANGRY</Text>
      </Pressable>
    </View>
  );
}

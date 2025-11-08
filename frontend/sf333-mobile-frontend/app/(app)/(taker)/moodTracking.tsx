import { router, useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { takerStyles } from "@/styles/taker.style";
import { useTaker } from "@/contexts/TakerContexts";

export default function MoodTracking() {
  const { setMood, setDate, setIsButtonPress } = useTaker();
  const handlePress = async (mood: string) => {
    try {
      setMood(mood);
      setDate(0);
      setIsButtonPress(true);
    } catch (e) {
      console.log("MoodTracking Error: ", e);
    } finally {
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

import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export default function HomePage() {
  const [rating, setRating] = useState(0);
  const [showerTaken, setShowerTaken] = useState<boolean | null>(null);

  const tasks = [
    { id: "1", title: "Make a bed", time: "08:00 AM" },
    { id: "2", title: "Brush teeth", time: "08:15 AM" },
    { id: "3", title: "Take a shower", time: "08:30 AM" },
  ];

  return (
    <View style={{ flex: 1, position: "relative" }}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <Text style={styles.header}>How are you feeling today?</Text>

        {/* Mood Box */}
        <View style={styles.moodBox}>
          <View style={styles.moodRow}>
            {["#BCE69B", "#EE9A9A", "#BCE69B", "#FFF176"].map((color, index) => (
              <Pressable
                key={index}
                style={[styles.moodCircle, { backgroundColor: color }]}
                onPress={() => console.log(`Mood: ${color}`)}
              />
            ))}
          </View>
        </View>

        {/* Rating Box */}
        <View style={styles.box}>
          <Text style={styles.boxTitle}>You did great!</Text>
          <View style={styles.starRow}>
            {[1, 2, 3].map((star) => (
              <Pressable key={star} onPress={() => setRating(star)}>
                <Text
                  style={[
                    styles.star,
                    rating >= star && styles.starActive,
                  ]}
                >
                  ★
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Shower Box */}
        <View style={styles.box}>
          <Text style={styles.showerText}>Did you take a shower?</Text>
          <View style={styles.showerRow}>
            <Pressable
              style={[styles.showerButton, { backgroundColor: "#A8D5BA" }]}
              onPress={() => setShowerTaken(true)}
            >
              <Text style={styles.showerButtonText}>YES</Text>
            </Pressable>
            <Pressable
              style={[styles.showerButton, { backgroundColor: "#E69A9A" }]}
              onPress={() => setShowerTaken(false)}
            >
              <Text style={styles.showerButtonText}>NO</Text>
            </Pressable>
          </View>
        </View>

        {/* Today Task */}
        <Text style={styles.taskHeader}>Today's Tasks:</Text>
        <View style={styles.taskBox}>
          {tasks.map((task) => (
            <View key={task.id} style={styles.taskCard}>
              <Text style={styles.taskTitle}>{task.title}</Text>
              <Text style={styles.taskTime}>{task.time}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* SOS Button at bottom */}
      <View style={styles.sosContainer}>
        <Pressable
          style={styles.sosButton}
          onPress={() => console.log("SOS Pressed")}
        >
          <Text style={styles.sosText}>SOS</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#F9F9F9",
    alignItems: "stretch",
    gap: 15,
  },
  header: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
    marginTop: 50,
    marginBottom: 10,
  },
  moodBox: {
    backgroundColor: "#F4EEE0",
    borderRadius: 12,
    padding: 15,
  },
  moodRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 15,
  },
  moodCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  box: {
    backgroundColor: "#DBE8F5",
    borderRadius: 12,
    padding: 15,
  },
  boxTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  starRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  star: {
    fontSize: 28,
    color: "#ccc",
    marginRight: 5,
  },
  starActive: {
    color: "#FFF176",
  },
  showerText: {
    fontSize: 15,
    fontWeight: "500",
    marginBottom: 10,
  },
  showerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  showerButton: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  showerButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  taskHeader: {
    fontSize: 20,
    fontWeight: "600",
    marginVertical: 10,
  },
  taskBox: {
    backgroundColor: "#DFE9F5",
    borderRadius: 12,
    padding: 15,
  },
  taskCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  taskTitle: {
    fontSize: 18,
    color: "#000",
  },
  taskTime: {
    fontSize: 18,
    color: "#000",
    fontWeight: "600",
  },
  sosContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 100,         
    backgroundColor: "#000",
    alignItems: "center", 
    justifyContent: "center", 
  },
  sosButton: {
    width: 90,
    height: 90,
    borderRadius: 50,
    backgroundColor: "#F56C6C",
    justifyContent: "center",
    alignItems: "center",
    marginTop: -80
  },
  sosText: {
    color: "#fff",
    fontSize: 25,
    fontWeight: "bold",
  },
});

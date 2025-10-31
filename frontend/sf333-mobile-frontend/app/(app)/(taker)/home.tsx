import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { takerStyles } from "@/styles/taker.style";
import { useTaker } from "@/contexts/TakerContexts";
// import { useTaker } from "@/hooks/useTaker";

interface MoodItem {
  color: string;
  date: number;
  mood: string;
  emoji?: string | null;
}

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

export default function HomePage() {
  const router = useRouter();
  const { mood, date, isButtonPress, pastmoods, star, tasks, setStar } = useTaker();
  // const { pastmoods, star, tasks} = useTaker();
  const [ispressed, setIspressed] = useState(false);
  const [isTaskPressed, setisTaskPressed] = useState(false);
  const [isdoing, setIsdoing] = useState<boolean>(false);
  // const [pastmoods, setPastMoods] = useState<MoodItem[]>([]);
  // const [star, setStar] = useState<number[]>([]);
  // const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [todayMood, setTodayMood] = useState<MoodItem>({
    color: "#BCE69B",
    date: 0,
    mood: "neutral",
  });

  //Build today mood useFocusEffect(
  useFocusEffect(
    useCallback(() => {
      setTodayMood({
        color: moodColors[mood],
        date: date,
        mood: mood,
        emoji: moodemoji[mood],
      });
      return () => null;
    }, [mood, date])
  );

  // let star = 3;
  // const stararr = Array.from({ length: star }, (_, i) => i + 1);
  const addStar = () => {
    setStar((prev: number[]) => {
      const newStarCount = prev.length + 1;
      return Array.from({ length: newStarCount }, (_, i) => i + 1);
    });
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
            <Text key={star} style={takerStyles.star}>⭐</Text>
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
    <View style={{ flex: 1, position: "relative" }}>
      <ScrollView contentContainerStyle={takerStyles.container}>
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
              <Text style={takerStyles.taskTitle}>{task.title}</Text>
              <Text style={takerStyles.taskTime}>{task.time}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
      
      <View style={takerStyles.sosContainer}>
        <Pressable
          style={takerStyles.sosButton}
          onPress={() => console.log("SOS Pressed")}
        >
          <Text style={takerStyles.sosText}>SOS</Text>
        </Pressable>
      </View>
    </View>
  );
}

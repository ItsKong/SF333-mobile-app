import { useState, useEffect } from "react";
import { MoodProvider, useMood } from "@/contexts/TakerContexts";

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

export const useTaker = () => {
  //   const [mood, setMood] = useState("neutral");
  //   const [date, setDate] = useState(new Date().getDate());
  //   const { mood, setMood, date, setDate } = useMood();
  const [pastmoods, setPastMoods] = useState<MoodItem[]>([]);
  const [star, setStar] = useState<number[]>([]);
  const [tasks, setTasks] = useState<TaskItem[]>([]);

  // Fetch moods when app starts / page enters
  useEffect(() => {
    const fetchMood = async () => {
      //   const res = await fetch("/api/mood/today");
      //   const data = await res.json();
      //   setMood(data.mood);
      //   setDate(data.date);
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

      setPastMoods(withColor);
      setTasks(tasksdata);
      setStar(starArr);
    };
    fetchMood();
  }, []);

  // Update server when mood changes
//   const updateMood = async (newMood: string) => {
//     // setMood(newMood);
//     await fetch("/api/mood/update", {
//       method: "POST",
//       body: JSON.stringify({ mood: newMood, date }),
//     });
//   };

  return { tasks, star, pastmoods };
};

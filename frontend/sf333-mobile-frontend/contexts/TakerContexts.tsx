// SharedContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

interface TakerContextType {
  date: number;
  setDate: (value: number) => void;
  mood: string;
  setMood: (value: string) => void;
  pastmoods: MoodItem[];
  setPastMoods: (value: MoodItem[]) => void;
  isButtonPress: boolean;
  star: number[]
  setStar: (star: number[] | ((prev: number[]) => number[])) => void;
  tasks: TaskItem[]
  setTasks: (value: TaskItem[]) => void;
  setIsButtonPress: (value: boolean) => void;
  TAKER_STORAGE_KEY: string;
}

interface MoodItem {
  color: string;
  date: number;
  mood: string;
  emoji?: string | null;
}

interface TaskItem {
  id: string;
  title: string;
  due_time: string;
  date?: string;
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

const TakerContext = createContext<TakerContextType | undefined>(undefined);

export const TakerProvider = ({ children }: { children: ReactNode }) => {
  const [mood, setMood] = useState("");
  const [date, setDate] = useState(0);
  const [isButtonPress, setIsButtonPress] = useState(false);
  const [pastmoods, setPastMoods] = useState<MoodItem[]>([]);
  const [star, setStar] = useState<number[]>([]);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const TAKER_STORAGE_KEY = '@care_taker';

  return (
    <TakerContext.Provider
      value={{
        mood,
        setMood,
        date,
        setDate,
        isButtonPress,
        setIsButtonPress,
        pastmoods,
        setPastMoods,
        star,
        setStar,
        tasks,
        setTasks,
        TAKER_STORAGE_KEY,
      }}
    >
      {children}
    </TakerContext.Provider>
  );
};

export const useTaker = () => {
  const context = useContext(TakerContext);
  if (!context) throw new Error("useShared must be used within SharedProvider");
  return context;
};

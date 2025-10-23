// SharedContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";
import { Int32 } from "react-native/Libraries/Types/CodegenTypes";

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
}

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

const TakerContext = createContext<TakerContextType | undefined>(undefined);

export const TakerProvider = ({ children }: { children: ReactNode }) => {
  const [mood, setMood] = useState("");
  const [date, setDate] = useState(0);
  const [isButtonPress, setIsButtonPress] = useState(false);
  const [pastmoods, setPastMoods] = useState<MoodItem[]>([]);
  const [star, setStar] = useState<number[]>([]);
  const [tasks, setTasks] = useState<TaskItem[]>([]);

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

// SharedContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";
import { TaskItem, MoodItem } from "@/types/data.type";

interface TakerContextType {
  todaymood: MoodItem | null;
  settodaymood: (value: MoodItem | null) => void;
  pastmoods: MoodItem[];
  setPastMoods: (value: MoodItem[]) => void;
  isButtonPress: boolean;
  star: number
  setStar: (star: number ) => void;
  tasks: TaskItem[]
  setTasks: (value: TaskItem[]) => void;
  setIsButtonPress: (value: boolean) => void;
  TASK_STORAGE_KEY: string;
  MOOD_STORAGE_KEY: string;
  MOODTD_STORAGE_KEY: string;
}

const TakerContext = createContext<TakerContextType | undefined>(undefined);

export const TakerProvider = ({ children }: { children: ReactNode }) => {
  const [todaymood, settodaymood] = useState<MoodItem | null>(null);
  const [date, setDate] = useState(0);
  const [isButtonPress, setIsButtonPress] = useState(false);
  const [pastmoods, setPastMoods] = useState<MoodItem[]>([]);
  const [star, setStar] = useState<number>(0);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const TASK_STORAGE_KEY = "@task_care_giver";
  const MOOD_STORAGE_KEY = "@mood_care_giver";
  const MOODTD_STORAGE_KEY = "@moodtd_care_giver";

  return (
    <TakerContext.Provider
      value={{
        todaymood,
        settodaymood,
        isButtonPress,
        setIsButtonPress,
        pastmoods,
        setPastMoods,
        star,
        setStar,
        tasks,
        setTasks,
        MOOD_STORAGE_KEY,
        MOODTD_STORAGE_KEY,
        TASK_STORAGE_KEY,
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

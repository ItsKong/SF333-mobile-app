// SharedContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";
import { TaskItem, MoodItem } from "@/types/data.type";

interface GiverContextType {
  todayMood: MoodItem | null;
  setTodayMood: (value: MoodItem) => void;
  pastMoods: MoodItem[];
  setPastMoods: (value: MoodItem[]) => void;
  tasks: TaskItem[];
  setTasks: (value: TaskItem[]) => void;
  TASK_STORAGE_KEY: string;
  MOOD_STORAGE_KEY: string;
  MOODTD_STORAGE_KEY: string;
}

const GiverContext = createContext<GiverContextType | undefined>(undefined);

export const GiverProvider = ({ children }: { children: ReactNode }) => {
  const [pastMoods, setPastMoods] = useState<MoodItem[]>([]);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [todayMood, setTodayMood] = useState<MoodItem | null>(null);
  const TASK_STORAGE_KEY = "@task_care_giver";
  const MOOD_STORAGE_KEY = "@mood_care_giver";
  const MOODTD_STORAGE_KEY = "@moodtd_care_giver";

  return (
    <GiverContext.Provider
      value={{
        pastMoods,
        setPastMoods,
        tasks,
        setTasks,
        todayMood,
        setTodayMood,
        TASK_STORAGE_KEY,
        MOOD_STORAGE_KEY,
        MOODTD_STORAGE_KEY,
      }}
    >
      {children}
    </GiverContext.Provider>
  );
};

export const useGiver = () => {
  const context = useContext(GiverContext);
  if (!context) throw new Error("useShared must be used within SharedProvider");
  return context;
};

// SharedContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

interface MoodItem {
  color?: string;
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

interface GiverContextType {
  todayMood: MoodItem;
  setTodayMood: (value: MoodItem) => void;
  pastMoods: MoodItem[];
  setPastMoods: (value: MoodItem[]) => void;
  tasks: TaskItem[];
  setTasks: (value: TaskItem[]) => void;
  STORAGE_KEY: string;
}

const GiverContext = createContext<GiverContextType | undefined>(undefined);

export const GiverProvider = ({ children }: { children: ReactNode }) => {
  const [pastMoods, setPastMoods] = useState<MoodItem[]>([]);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [todayMood, setTodayMood] = useState<MoodItem>({
    color: "#BCE69B",
    date: 0,
    mood: "happy",
  });
  const STORAGE_KEY = "@care_giver";

  return (
    <GiverContext.Provider
      value={{ pastMoods, setPastMoods, tasks, setTasks, todayMood, setTodayMood, STORAGE_KEY}}
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

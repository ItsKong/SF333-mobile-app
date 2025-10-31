// SharedContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

interface MoodItem {
  color?: string;
  date: number;
  mood: string;
  emoji?: string | null;
}

interface TaskItem {
  id: number;
  title: string;
  time?: string;
  status?: string;
  describtion?: string;
}

interface GiverContextType {
  todayMood: MoodItem;
  setTodayMood: (value: MoodItem) => void;
  pastMoods: MoodItem[];
  setPastMoods: (value: MoodItem[]) => void;
  tasks: TaskItem[];
  setTasks: (value: TaskItem[]) => void;
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

  return (
    <GiverContext.Provider
      value={{ pastMoods, setPastMoods, tasks, setTasks, todayMood, setTodayMood }}
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

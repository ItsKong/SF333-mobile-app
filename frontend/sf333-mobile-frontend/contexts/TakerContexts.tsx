// SharedContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";
import { TaskItem, MoodItem } from "@/types/data.type";

interface TakerContextType {
  todaymood: MoodItem | null;
  settodaymood: (value: MoodItem | null) => void;
  pastmoods: MoodItem[];
  setPastMoods: (value: MoodItem[]) => void;
  isButtonPress: boolean;
  star: number[]
  setStar: (star: number[] | ((prev: number[]) => number[])) => void;
  tasks: TaskItem[]
  setTasks: (value: TaskItem[]) => void;
  setIsButtonPress: (value: boolean) => void;
  TAKER_STORAGE_KEY: string;
  TODAY_MOOD_KEY: string
}

const TakerContext = createContext<TakerContextType | undefined>(undefined);

export const TakerProvider = ({ children }: { children: ReactNode }) => {
  const [todaymood, settodaymood] = useState<MoodItem | null>(null);
  const [date, setDate] = useState(0);
  const [isButtonPress, setIsButtonPress] = useState(false);
  const [pastmoods, setPastMoods] = useState<MoodItem[]>([]);
  const [star, setStar] = useState<number[]>([]);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const TAKER_STORAGE_KEY = '@care_taker';
  const TODAY_MOOD_KEY = '@today_mood'

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
        TAKER_STORAGE_KEY,
        TODAY_MOOD_KEY,
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

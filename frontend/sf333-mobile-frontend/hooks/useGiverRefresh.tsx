import { TaskItem, MoodItem } from "@/types/data.type";

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

export default function useGiverRefresh() {
  const addTaskIndex = (userTaskData: TaskItem[]) => {
    const taskwithIndexNum = userTaskData.map(
      (item: any, index: number) => ({
        ...item,
        index: index + 1,
      })
    );
    return taskwithIndexNum;
  };

  const addMoodColorEmojiIndex = (userMoodData: MoodItem[]) => {
    const moodwithColorEmojiIndex = userMoodData.map(
      (item: any, index: number) => ({
        ...item,
        color: moodColors[item.mood],
        emoji: moodemoji[item.mood],
        index: index + 1,
      })
    );
    return moodwithColorEmojiIndex;
  };
  return {addTaskIndex, addMoodColorEmojiIndex};
}

import { TaskItem, MoodItem } from "@/types/data.type";

interface FirestoreTimestamp {
  _seconds: number;
  _nanoseconds: number;
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

export default function useGiverRefresh() {
  const addTaskIndex = (userTaskData: TaskItem[]) => {
    const taskwithIndexNum = userTaskData.map((item: any, index: number) => {
      // 1. Check if the 'due_date' field exists AND is in the Timestamp object format
      if (
        item.due_date &&
        typeof item.due_date === "object" &&
        item.due_date._seconds !== undefined
      ) {
        const firebasetime: FirestoreTimestamp = item.due_date;

        // 2. Convert seconds and nanoseconds to total milliseconds
        const milliseconds =
          firebasetime._seconds * 1000 + firebasetime._nanoseconds / 1000000;

        // 3. Create a new JavaScript Date object
        const dateObject = new Date(milliseconds);

        // 4. Return the new item with the converted date and the index
        return {
          ...item,
          index: index + 1,
          due_date: dateObject.toISOString(),
        };
      }

      // 5. If it's not a Firestore Timestamp, just attach the index and return the item as is
      return {
        ...item,
        index: index + 1,
      };
    });
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

  const addTDMoodColorEmoji = (userMoodTDres: any) => {
    const rawtdmood = userMoodTDres.moods[0] ? userMoodTDres.moods[0] : "";
    const today_mood = {
      ...rawtdmood,
      color: moodColors[rawtdmood.mood],
      emoji: moodemoji[rawtdmood.mood],
      index: 1,
    };
    return today_mood;
  };
  return { addTaskIndex, addMoodColorEmojiIndex, addTDMoodColorEmoji };
}

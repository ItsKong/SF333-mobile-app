export interface TaskItem {
  id: string;
  title: string;
  due_time: string;
  due_date: string;
  status?: string;
  created_by?: string;
  assigned_to?: string;
  content?: string;
  frequency: string;
  index: number;
}

export interface MoodItem {
  color?: string;
  date: number;
  mood: string;
  emoji?: string | null;
  index?: number;
}

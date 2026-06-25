export type TaskPriority = "alta" | "media" | "baixa";

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority?: TaskPriority;
  category?: string;
  tags?: string[];
  dueDate?: string;
  estimatedTime?: number;
  completed: boolean;
  deletedAt?: string;
  createdAt: string;
}

export type NewTask = Omit<Task, "id" | "createdAt" | "deletedAt">;

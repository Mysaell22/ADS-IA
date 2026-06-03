import { useState, useEffect } from "react";

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority?: string;
  category?: string;
  dueDate?: string;
}

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (task: Omit<Task, "id">) => {
    setTasks(prev => [...prev, { ...task, id: Date.now().toString() }]);
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  return { tasks, addTask, deleteTask, updateTask };
};
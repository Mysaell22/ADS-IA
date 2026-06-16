"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { showError, showSuccess } from "@/utils/toast";

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority?: "alta" | "media" | "baixa";
  category?: string;
  dueDate?: string;
  tags?: string[];
  estimatedTime?: number;
  createdAt: string;
  user_id?: string;
}

type Filter = "all" | "active" | "completed" | "overdue" | "today";

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"dueDate" | "priority" | "createdAt">("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  // -----------------------------------------------------------------
  // Auth
  // -----------------------------------------------------------------
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      setUser(s?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // -----------------------------------------------------------------
  // Fetch tasks for the logged‑in user
  // -----------------------------------------------------------------
  const fetchTasks = async () => {
    if (!user) {
      setTasks([]);
      return;
    }
    setIsLoading(true);
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user.id)
      .order(sortBy, { ascending: sortOrder === "asc" });

    if (error) {
      showError("Falha ao carregar tarefas.");
      console.error("[fetchTasks] Supabase error:", error);
      setIsLoading(false);
      return;
    }
    setTasks(data ?? []);
    setIsLoading(false);
  };

  useEffect(() => {
    void fetchTasks();
  }, [user, sortBy, sortOrder]);

  // -----------------------------------------------------------------
  // CRUD helpers
  // -----------------------------------------------------------------
  const addTask = async (task: Omit<Task, "id" | "user_id">) => {
    if (!user) {
      showError("Você precisa estar logado para adicionar tarefas.");
      return;
    }
    setIsLoading(true);
    const { data, error } = await supabase
      .from("tasks")
      .insert({ ...task, user_id: user.id })
      .select()
      .single();

    if (error || !data) {
      showError("Falha ao adicionar tarefa.");
      console.error("[addTask] Supabase error:", error);
      setIsLoading(false);
      return;
    }
    setTasks([data, ...tasks]);
    showSuccess("Tarefa adicionada.");
    setIsLoading(false);
  };

  const updateTask = async (task: Task) => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("tasks")
      .update({
        title: task.title,
        description: task.description,
        completed: task.completed,
        priority: task.priority,
        category: task.category,
        dueDate: task.dueDate,
        tags: task.tags,
        estimatedTime: task.estimatedTime,
      })
      .eq("id", task.id)
      .select()
      .single();

    if (error || !data) {
      showError("Falha ao atualizar tarefa.");
      console.error("[updateTask] Supabase error:", error);
      setIsLoading(false);
      return;
    }
    setTasks(tasks.map(t => (t.id === task.id ? data : t)));
    showSuccess("Tarefa atualizada.");
    setIsLoading(false);
  };

  const deleteTask = async (id: string) => {
    setIsLoading(true);
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (error) {
      showError("Falha ao excluir tarefa.");
      console.error("[deleteTask] Supabase error:", error);
      setIsLoading(false);
      return;
    }
    setTasks(tasks.filter(t => t.id !== id));
    showSuccess("Tarefa excluída.");
    setIsLoading(false);
  };

  const clearCompleted = async () => {
    if (!user) return;
    const completedIds = tasks.filter(t => t.completed).map(t => t.id);
    if (!completedIds.length) return;
    setIsLoading(true);
    const { error } = await supabase.from("tasks").delete().in("id", completedIds);
    if (error) {
      showError("Falha ao limpar concluídas.");
      console.error("[clearCompleted] Supabase error:", error);
      setIsLoading(false);
      return;
    }
    setTasks(tasks.filter(t => !t.completed));
    showSuccess("Concluídas removidas.");
    setIsLoading(false);
  };

  // -----------------------------------------------------------------
  // Filtering
  // -----------------------------------------------------------------
  const now = new Date();

  const filteredTasks = tasks.filter(t => {
    if (searchTerm && !t.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;

    if (filter === "active" && t.completed) return false;
    if (filter === "completed" && !t.completed) return false;
    if (filter === "overdue") {
      if (!t.dueDate) return false;
      return new Date(t.dueDate) < now && !t.completed;
    }
    if (filter === "today") {
      if (!t.dueDate) return false;
      const d = new Date(t.dueDate);
      return (
        d.getFullYear() === now.getFullYear() &&
        d.getMonth() === now.getMonth() &&
        d.getDate() === now.getDate()
      );
    }
    return true;
  });

  // -----------------------------------------------------------------
  // Stats
  // -----------------------------------------------------------------
  const stats = {
    total: tasks.length,
    active: tasks.filter(t => !t.completed).length,
    completed: tasks.filter(t => t.completed).length,
    overdue: tasks.filter(t => t.dueDate && new Date(t.dueDate) < now && !t.completed).length,
    today: tasks.filter(t => {
      if (!t.dueDate) return false;
      const d = new Date(t.dueDate);
      return (
        d.getFullYear() === now.getFullYear() &&
        d.getMonth() === now.getMonth() &&
        d.getDate() === now.getDate()
      );
    }).length,
  };

  const categories = [...new Set(tasks.map(t => t.category).filter(Boolean))] as string[];

  return {
    tasks: filteredTasks,
    filter,
    setFilter,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    addTask,
    updateTask,
    deleteTask,
    clearCompleted,
    stats,
    categories,
    isLoading,
    refetch: fetchTasks,
  };
};
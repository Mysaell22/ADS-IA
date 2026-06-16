"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { showError, showSuccess } from "@/utils/toast";

/**
 * Colunas da tabela `tarefas` no Supabase:
 * - id (uuid)
 * - user_id (uuid)
 * - title (text)
 * - description (text)
 * - priority (text) – values: "alta" | "media" | "baixa"
 * - category (text)
 * - tag (text) – pode ser armazenado como string simples (não array)
 * - due_date (timestamp with time zone)
 * - time_minutes (integer)
 * - completed (boolean)
 * - created_at (timestamp)
 */
export interface Task {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  priority?: "alta" | "media" | "baixa";
  category?: string;
  tag?: string; // se for um único tag; se houver múltiplos, ajuste no front‑end
  dueDate?: string; // ISO string
  estimatedTime?: number; // time_minutes
  completed: boolean;
  createdAt: string;
}

/** Filtros aceitos */
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
  // Auth – garante que o usuário está logado antes de acessar dados
  // -----------------------------------------------------------------
  useEffect(() => {
    const loadUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    loadUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      },
    );
    return () => subscription.unsubscribe();
  }, []);

  // -----------------------------------------------------------------
  // Fetch tasks (only when a user is logged in)
  // -----------------------------------------------------------------
  const fetchTasks = async () => {
    if (!user) {
      setTasks([]);
      return;
    }
    setIsLoading(true);
    const { data, error } = await supabase
      .from("tarefas")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: sortOrder === "asc" });

    if (error) {
      // Log detalhado para depuração      console.error("[fetchTasks] Supabase error:", error);
      showError("Falha ao carregar tarefas.");
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
  // INSERT – cria uma nova tarefa
  // -----------------------------------------------------------------
  const addTask = async (task: Omit<Task, "id" | "user_id">) => {
    if (!user) {
      showError("Você precisa estar logado para adicionar tarefas.");
      return;
    }
    setIsLoading(true);
    const { data, error } = await supabase
      .from("tarefas")
      .insert({
        ...task,
        user_id: user.id,
        // Supabase pode preencher `created_at` automaticamente;
        // se não, pode usar supabase.fn.now()
      })
      .select()
      .single();

    if (error || !data) {
      console.error("[addTask] Supabase error:", error);
      showError("Falha ao adicionar tarefa.");
      setIsLoading(false);
      return;
    }
    setTasks([data, ...tasks]);
    showSuccess("Tarefa adicionada.");
    setIsLoading(false);
  };

  // -----------------------------------------------------------------
  // UPDATE – edita uma tarefa existente  // -----------------------------------------------------------------
  const updateTask = async (task: Task) => {
    if (!user) return;
    setIsLoading(true);
    const { data, error } = await supabase
      .from("tarefas")
      .update({
        title: task.title,
        description: task.description,
        priority: task.priority,
        category: task.category,
        tag: task.tag,
        dueDate: task.dueDate,
        estimatedTime: task.estimatedTime,
        completed: task.completed,
      })
      .eq("id", task.id)
      .select()
      .single();

    if (error || !data) {
      console.error("[updateTask] Supabase error:", error);
      showError("Falha ao atualizar tarefa.");
      setIsLoading(false);
      return;
    }
    setTasks(tasks.map((t) => (t.id === task.id ? data : t)));
    showSuccess("Tarefa atualizada.");
    setIsLoading(false);
  };

  // -----------------------------------------------------------------
  // DELETE – remove uma tarefa
  // -----------------------------------------------------------------
  const deleteTask = async (id: string) => {
    if (!user) return;
    setIsLoading(true);
    const { error } = await supabase.from("tarefas").delete().eq("id", id);
    if (error) {
      console.error("[deleteTask] Supabase error:", error);
      showError("Falha ao excluir tarefa.");
      setIsLoading(false);
      return;
    }
    setTasks(tasks.filter((t) => t.id !== id));
    showSuccess("Tarefa excluída.");
    setIsLoading(false);
  };

  // -----------------------------------------------------------------
  // DELETE multiple completed tasks
  // -----------------------------------------------------------------
  const clearCompleted = async () => {
    if (!user) return;
    const completedIds = tasks.filter((t) => t.completed).map((t) => t.id);
    if (!completedIds.length) return;
    setIsLoading(true);
    const { error } = await supabase
      .from("tarefas")
      .delete()
      .in("id", completedIds);
    if (error) {
      console.error("[clearCompleted] Supabase error:", error);
      showError("Falha ao limpar concluídas.");
      setIsLoading(false);
      return;
    }
    setTasks(tasks.filter((t) => !t.completed));
    showSuccess("Concluídas removidas.");
    setIsLoading(false);
  };

  // -----------------------------------------------------------------  // FILTERING LOGIC
  // -----------------------------------------------------------------
  const now = new Date();

  const filteredTasks = tasks.filter((t) => {
    // SEARCH
    if (searchTerm && !t.title.toLowerCase().includes(searchTerm.toLowerCase()))
      return false;

    // STATUS FILTERS
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

    return true; // "all"
  });

  // -----------------------------------------------------------------
  // STATISTICS
  // -----------------------------------------------------------------
  const stats = {
    total: tasks.length,
    active: tasks.filter((t) => !t.completed).length,
    completed: tasks.filter((t) => t.completed).length,
    overdue: tasks.filter(
      (t) =>
        t.dueDate && new Date(t.dueDate) < now && !t.completed,
    ).length,
    today: tasks.filter((t) => {
      if (!t.dueDate) return false;
      const d = new Date(t.dueDate);
      return (
        d.getFullYear() === now.getFullYear() &&
        d.getMonth() === now.getMonth() &&
        d.getDate() === now.getDate()
      );
    }).length,
  };

  // Deduce distinct categories (use the `category` column)
  const categories = [
    ...new Set(tasks.map((t) => t.category).filter(Boolean)),
  ] as string[];

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
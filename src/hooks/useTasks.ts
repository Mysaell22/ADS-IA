import { useCallback, useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { showError, showSuccess } from "@/utils/toast";
import type { NewTask, Task } from "@/types/task";

export type TaskFilter = "all" | "active" | "completed" | "overdue" | "today";

type DatabaseTask = {
  id: string;
  title: string;
  description: string | null;
  priority: Task["priority"] | null;
  category: string | null;
  tag: string | null;
  due_date: string | null;
  time_minutes: number | null;
  completed: boolean | null;
  created_at: string;
};

const fromDatabase = (row: DatabaseTask): Task => ({
  id: row.id,
  title: row.title,
  description: row.description || undefined,
  priority: row.priority || undefined,
  category: row.category || undefined,
  tags: row.tag
    ? String(row.tag).split(",").map((tag) => tag.trim()).filter(Boolean)
    : undefined,
  dueDate: row.due_date || undefined,
  estimatedTime: row.time_minutes ?? undefined,
  completed: Boolean(row.completed),
  createdAt: row.created_at,
});

const toDatabase = (task: NewTask | Task) => ({
  title: task.title,
  description: task.description || null,
  priority: task.priority || null,
  category: task.category || null,
  tag: task.tags?.join(", ") || null,
  due_date: task.dueDate || null,
  time_minutes: task.estimatedTime ?? null,
  completed: task.completed,
});

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<TaskFilter>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"dueDate" | "priority" | "createdAt">("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    void supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setUser(session?.user ?? null),
    );
    return () => subscription.unsubscribe();
  }, []);

  const fetchTasks = useCallback(async () => {
    if (!user) {
      setTasks([]);
      return;
    }

    setIsLoading(true);
    const { data, error } = await supabase
      .from("tarefas")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setIsLoading(false);

    if (error) {
      console.error("[fetchTasks]", error);
      showError("Falha ao carregar tarefas.");
      return;
    }
    setTasks(((data ?? []) as DatabaseTask[]).map(fromDatabase));
  }, [user]);

  useEffect(() => {
    void fetchTasks();
  }, [fetchTasks]);

  const addTask = async (task: NewTask) => {
    if (!user) {
      showError("Você precisa estar conectado para adicionar tarefas.");
      return false;
    }
    setIsLoading(true);
    const { data, error } = await supabase
      .from("tarefas")
      .insert({ ...toDatabase(task), user_id: user.id })
      .select()
      .single();
    setIsLoading(false);

    if (error || !data) {
      console.error("[addTask]", error);
      showError("Falha ao adicionar tarefa.");
      return false;
    }
    setTasks((current) => [fromDatabase(data as DatabaseTask), ...current]);
    showSuccess("Tarefa adicionada.");
    return true;
  };

  const updateTask = async (task: Task) => {
    if (!user) return false;
    setIsLoading(true);
    const { data, error } = await supabase
      .from("tarefas")
      .update(toDatabase(task))
      .eq("id", task.id)
      .eq("user_id", user.id)
      .select()
      .single();
    setIsLoading(false);

    if (error || !data) {
      console.error("[updateTask]", error);
      showError("Falha ao atualizar tarefa.");
      return false;
    }
    const updated = fromDatabase(data as DatabaseTask);
    setTasks((current) => current.map((item) => item.id === task.id ? updated : item));
    showSuccess("Tarefa atualizada.");
    return true;
  };

  const deleteTask = async (id: string) => {
    if (!user) return false;
    setIsLoading(true);
    const { error } = await supabase
      .from("tarefas")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);
    setIsLoading(false);

    if (error) {
      console.error("[deleteTask]", error);
      showError("Falha ao excluir tarefa.");
      return false;
    }
    setTasks((current) => current.filter((item) => item.id !== id));
    showSuccess("Tarefa excluída.");
    return true;
  };

  const clearCompleted = async () => {
    if (!user) return false;
    const completedIds = tasks.filter((task) => task.completed).map((task) => task.id);
    if (!completedIds.length) return true;
    setIsLoading(true);
    const { error } = await supabase
      .from("tarefas")
      .delete()
      .eq("user_id", user.id)
      .in("id", completedIds);
    setIsLoading(false);

    if (error) {
      console.error("[clearCompleted]", error);
      showError("Falha ao limpar tarefas concluídas.");
      return false;
    }
    setTasks((current) => current.filter((task) => !task.completed));
    showSuccess("Tarefas concluídas removidas.");
    return true;
  };

  const visibleTasks = useMemo(() => {
    const now = new Date();
    const priorityWeight = { alta: 3, media: 2, baixa: 1 } as const;
    return tasks
      .filter((task) => {
        if (searchTerm && !`${task.title} ${task.description || ""}`.toLowerCase().includes(searchTerm.toLowerCase())) return false;
        if (filter === "active") return !task.completed;
        if (filter === "completed") return task.completed;
        if (filter === "overdue") return Boolean(task.dueDate && new Date(task.dueDate) < now && !task.completed);
        if (filter === "today") return Boolean(task.dueDate && new Date(task.dueDate).toDateString() === now.toDateString());
        return true;
      })
      .sort((a, b) => {
        let comparison = 0;
        if (sortBy === "priority") comparison = (priorityWeight[a.priority || "baixa"] - priorityWeight[b.priority || "baixa"]);
        else comparison = new Date(a[sortBy] || 0).getTime() - new Date(b[sortBy] || 0).getTime();
        return sortOrder === "asc" ? comparison : -comparison;
      });
  }, [tasks, filter, searchTerm, sortBy, sortOrder]);

  const stats = {
    total: tasks.length,
    active: tasks.filter((task) => !task.completed).length,
    completed: tasks.filter((task) => task.completed).length,
    overdue: tasks.filter((task) => task.dueDate && new Date(task.dueDate) < new Date() && !task.completed).length,
    today: tasks.filter((task) => task.dueDate && new Date(task.dueDate).toDateString() === new Date().toDateString()).length,
  };

  return {
    tasks: visibleTasks, filter, setFilter, searchTerm, setSearchTerm,
    sortBy, setSortBy, sortOrder, setSortOrder, addTask, updateTask,
    deleteTask, clearCompleted, stats,
    categories: [...new Set(tasks.map((task) => task.category).filter(Boolean))] as string[],
    isLoading, refetch: fetchTasks,
  };
};

"use client";

import React, { useEffect, useState } from "react";
import { TaskForm } from "./TaskForm";
import { TaskItem } from "./TaskItem";
import { TaskFilters } from "./TaskFilters";
import { useTasks } from "@/hooks/useTasks";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArchiveRestore,
  AlertTriangle,
  CheckCircle,
  Circle,
  ClipboardList,
  Clock,
  ListTodo,
  LogOut,
  Sparkles,
  User,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { showSuccess } from "@/utils/toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export const TaskList: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<SupabaseUser | null>(null);

  const {
    tasks,
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
    restoreTask,
    clearCompleted,
    stats,
    categories,
    isLoading,
  } = useTasks();

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    void load();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error(error);
    showSuccess("Desconectado.");
    navigate("/login", { replace: true });
  };

  const StatCard = ({
    label,
    value,
    icon,
    onClick,
  }: {
    label: string;
    value: number;
    icon: React.ReactNode;
    onClick?: () => void;
  }) => (
    <Card
      className={onClick ? "cursor-pointer border-none bg-white/85 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md" : "border-none bg-white/85 shadow-sm"}
      onClick={onClick}
    >
      <CardContent className="p-4 text-center">
        {icon}
        <div className="text-2xl font-bold text-slate-950">{value}</div>
        <div className="text-xs text-muted-foreground">{label}</div>
      </CardContent>
    </Card>
  );

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4">
      <div className="flex items-start justify-between gap-4 rounded-lg border bg-white/90 p-5 shadow-sm">
        <div className="min-w-0 flex-1 space-y-2">
          <div className="inline-flex items-center gap-2 rounded bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
            <Sparkles className="h-4 w-4" />
            Meu To Do Aurora
          </div>
          <h1 className="text-3xl font-bold text-slate-950 md:text-5xl">
            Painel de tarefas com lixeira reversível
          </h1>
          <p className="max-w-2xl text-muted-foreground">
            Cadastre, acompanhe, exclua com confirmação e restaure tarefas sem perder o histórico.
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full bg-white">
              <User className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <div className="px-2 py-1 text-sm font-medium">
              {user?.user_metadata?.name || "Usuário"}
            </div>
            <div className="truncate px-2 py-1 text-sm text-muted-foreground">
              {user?.email}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-6">
        <StatCard
          label="Total"
          value={stats.total}
          icon={<ListTodo className="mx-auto mb-2 h-6 w-6 text-slate-900" />}
          onClick={() => setFilter("all")}
        />
        <StatCard
          label="Ativas"
          value={stats.active}
          icon={<Circle className="mx-auto mb-2 h-6 w-6 text-cyan-600" />}
          onClick={() => setFilter("active")}
        />
        <StatCard
          label="Concluídas"
          value={stats.completed}
          icon={<CheckCircle className="mx-auto mb-2 h-6 w-6 text-emerald-600" />}
          onClick={() => setFilter("completed")}
        />
        <StatCard
          label="Atrasadas"
          value={stats.overdue}
          icon={<AlertTriangle className="mx-auto mb-2 h-6 w-6 text-red-500" />}
          onClick={() => setFilter("overdue")}
        />
        <StatCard
          label="Hoje"
          value={stats.today}
          icon={<Clock className="mx-auto mb-2 h-6 w-6 text-amber-500" />}
          onClick={() => setFilter("today")}
        />
        <StatCard
          label="Lixeira"
          value={stats.deleted}
          icon={<ArchiveRestore className="mx-auto mb-2 h-6 w-6 text-violet-500" />}
          onClick={() => setFilter("deleted")}
        />
      </div>

      <div className="rounded-lg border bg-white/90 p-5 shadow-sm">
        <TaskForm onAdd={addTask} />
      </div>

      <Card className="border-none bg-white/90 shadow-sm">
        <CardContent className="p-4">
          <TaskFilters
            filter={filter}
            setFilter={setFilter}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            stats={stats}
            categories={categories}
            onClearCompleted={clearCompleted}
          />
        </CardContent>
      </Card>

      {isLoading ? (
        <p className="text-center text-muted-foreground">Carregando...</p>
      ) : tasks.length === 0 ? (
        <Card className="border-none bg-white/90 shadow-sm">
          <CardContent className="p-8 text-center">
            <ClipboardList className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">
              {filter === "deleted" ? "Nenhuma tarefa na lixeira." : searchTerm ? "Nenhuma tarefa encontrada" : "Nenhuma tarefa ainda. Adicione uma acima!"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onUpdate={updateTask}
              onDelete={deleteTask}
              onRestore={restoreTask}
            />
          ))}
        </div>
      )}
    </div>
  );
};

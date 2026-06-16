"use client";

import React, { useState, useEffect } from "react";
import { TaskForm } from "./TaskForm";
import { TaskItem } from "./TaskItem";
import { TaskFilters } from "./TaskFilters";
import { useTasks } from "@/hooks/useTasks";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ClipboardList,
  ListTodo,
  CheckCircle,
  Circle,
  AlertTriangle,
  Clock,
  User,
  LogOut,
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

export const TaskList: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

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
    clearCompleted,
    stats,
    categories,
    isLoading,
  } = useTasks();

  // -----------------------------------------------------------------
  // Load logged‑in user for the header menu
  // -----------------------------------------------------------------
  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    load();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      setUser(s?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error(error);
    showSuccess("Desconectado.");
    navigate("/login", { replace: true });
  };

  // -----------------------------------------------------------------
  // Helper to render a clickable statistic card
  // -----------------------------------------------------------------
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
      className={onClick ? "cursor-pointer hover:shadow-md transition-shadow" : ""}
      onClick={onClick}
    >
      <CardContent className="p-4 text-center">
        {icon}
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-xs text-muted-foreground">{label}</div>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header with user menu */}
      <div className="flex items-center justify-between">
        <div className="flex-1 text-center space-y-2">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Gerenciador de Tarefas Profissional
          </h1>
          <p className="text-muted-foreground">
            Organize sua vida com eficiência e controle total
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <User className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <div className="px-2 py-1 text-sm font-medium">
              {user?.user_metadata?.name || "Usuário"}
            </div>
            <div className="px-2 py-1 text-sm text-muted-foreground truncate">
              {user?.email}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Statistic cards – now clickable */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard
          label="Total"
          value={stats.total}
          icon={<ListTodo className="h-6 w-6 mx-auto mb-2 text-primary" />}
          onClick={() => setFilter("all")}
        />
        <StatCard
          label="Ativas"
          value={stats.active}
          icon={<Circle className="h-6 w-6 mx-auto mb-2 text-blue-500" />}
          onClick={() => setFilter("active")}
        />
        <StatCard
          label="Concluídas"
          value={stats.completed}
          icon={<CheckCircle className="h-6 w-6 mx-auto mb-2 text-green-500" />}
          onClick={() => setFilter("completed")}
        />
        <StatCard
          label="Atrasadas"
          value={stats.overdue}
          icon={<AlertTriangle className="h-6 w-6 mx-auto mb-2 text-red-500" />}
          onClick={() => setFilter("overdue")}
        />
        <StatCard
          label="Hoje"
          value={stats.today}
          icon={<Clock className="h-6 w-6 mx-auto mb-2 text-orange-500" />}
          onClick={() => setFilter("today")}
        />
      </div>

      {/* Form to add a new task */}
      <TaskForm onAdd={addTask} />

      {/* Filters */}
      <Card>
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

      {/* Task list */}
      {isLoading ? (
        <p className="text-center text-muted-foreground">Carregando...</p>
      ) : tasks.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <ClipboardList className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {searchTerm ? "Nenhuma tarefa encontrada" : "Nenhuma tarefa ainda. Adicione uma acima!"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {tasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onUpdate={updateTask}
              onDelete={deleteTask}
            />
          ))}
        </div>
      )}
    </div>
  );
};
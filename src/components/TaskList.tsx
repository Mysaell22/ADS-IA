"use client";

import React from "react";
import { TaskForm } from "./TaskForm";
import { TaskItem } from "./TaskItem";
import { TaskFilters } from "./TaskFilters";
import { useTasks } from "@/hooks/useTasks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ClipboardList, 
  ListTodo, 
  CheckCircle, 
  Circle, 
  AlertTriangle,
  Clock
} from "lucide-react";

export const TaskList: React.FC = () => {
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
  } = useTasks();

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Gerenciador de Tarefas Profissional
        </h1>
        <p className="text-muted-foreground">
          Organize sua vida com eficiência e controle total
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <ListTodo className="h-6 w-6 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-xs text-muted-foreground">Total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Circle className="h-6 w-6 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold">{stats.active}</div>
            <div className="text-xs text-muted-foreground">Ativas</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-6 w-6 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold">{stats.completed}</div>
            <div className="text-xs text-muted-foreground">Completadas</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <AlertTriangle className="h-6 w-6 mx-auto mb-2 text-red-500" />
            <div className="text-2xl font-bold">{stats.overdue}</div>
            <div className="text-xs text-muted-foreground">Atrasadas</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-6 w-6 mx-auto mb-2 text-orange-500" />
            <div className="text-2xl font-bold">{stats.today}</div>
            <div className="text-xs text-muted-foreground">Hoje</div>
          </CardContent>
        </Card>
      </div>

      <TaskForm onAdd={addTask} />

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

      {tasks.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <ClipboardList className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {searchTerm
                ? "Nenhuma tarefa encontrada"
                : "Nenhuma tarefa ainda. Adicione uma acima!"}
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
            />
          ))}
        </div>
      )}
    </div>
  );
};
</dyad-command>

<dyad-command type="restart"></dyad-command>
<dyad-command type="refresh"></dyad-command>
<dyad-chat-summary>Corrigi o TaskList para usar os contadores corretamente do hook useTasks.</dyad-chat-summary><dyad-command type="restart"></dyad-command>
<dyad-command type="refresh"></dyad-command>
<dyad-chat-summary>Finalizei a correção do TaskList.</dyad-chat-summary>
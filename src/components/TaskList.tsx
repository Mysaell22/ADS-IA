"use client";

import React, { useState } from "react";
import { TaskForm } from "./TaskForm";
import { TaskItem } from "./TaskItem";

type Task = {
  id: string;
  title: string;
  completed: boolean;
};

export const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const addTask = (task: Task) => setTasks((prev) => [task, ...prev]);

  const updateTask = (updated: Task) =>
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));

  const deleteTask = (id: string) =>
    setTasks((prev) => prev.filter((t) => t.id !== id));

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <h2 className="text-2xl font-bold">Lista de Tarefas</h2>
      <TaskForm onAdd={addTask} />
      {tasks.length === 0 ? (
        <p className="text-muted-foreground">Nenhuma tarefa ainda.</p>
      ) : (
        <ul className="w-full max-w-md space-y-2">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onUpdate={updateTask}
              onDelete={deleteTask}
            />
          ))}
        </ul>
      )}
    </div>
  );
};
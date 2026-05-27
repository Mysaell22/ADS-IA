"use client";

import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Task = {
  id: string;
  title: string;
  completed: boolean;
};

type Props = {
  onAdd: (task: Task) => void;
};

export const TaskForm: React.FC<Props> = ({ onAdd }) => {
  const [title, setTitle] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const newTask: Task = { id: uuidv4(), title: title.trim(), completed: false };
    onAdd(newTask);
    setTitle("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-md">
      <Input
        placeholder="Nova tarefa"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Button type="submit">Adicionar</Button>
    </form>
  );
};
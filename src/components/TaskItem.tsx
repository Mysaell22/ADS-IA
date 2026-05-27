"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

type Task = {
  id: string;
  title: string;
  completed: boolean;
};

type Props = {
  task: Task;
  onUpdate: (task: Task) => void;
  onDelete: (id: string) => void;
};

export const TaskItem: React.FC<Props> = ({ task, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);

  const handleToggle = () => {
    onUpdate({ ...task, completed: !task.completed });
  };

  const handleSave = () => {
    if (editTitle.trim()) {
      onUpdate({ ...task, title: editTitle.trim() });
      setIsEditing(false);
    }
  };

  return (
    <li className="flex items-center justify-between p-2 bg-card rounded-md">
      <div className="flex items-center gap-2">
        <Checkbox checked={task.completed} onCheckedChange={handleToggle} />
        {isEditing ? (
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-48"
          />
        ) : (
          <span className={task.completed ? "line-through text-muted-foreground" : ""}>
            {task.title}
          </span>
        )}
      </div>
      <div className="flex gap-2">
        {isEditing ? (
          <Button variant="outline" size="sm" onClick={handleSave}>
            Salvar
          </Button>
        ) : (
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            Editar
          </Button>
        )}
        <Button variant="destructive" size="sm" onClick={() => onDelete(task.id)}>
          Excluir
        </Button>
      </div>
    </li>
  );
};
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Task } from "@/types/task";
import { Edit, Trash2, Calendar, Clock, Tag, AlertTriangle } from "lucide-react";
import { format, isAfter, isToday, isYesterday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { TaskForm } from "./TaskForm";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

type Props = {
  task: Task;
  onUpdate: (task: Task) => void;
  onDelete: (id: string) => void;
  onEdit?: (task: Task) => void;
};

export const TaskItem: React.FC<Props> = ({ task, onUpdate, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleToggle = () => {
    onUpdate({ ...task, completed: !task.completed });
  };

  const handleEdit = (updatedTask: Task) => {
    onUpdate(updatedTask);
    setIsEditing(false);
    if (onEdit) onEdit(updatedTask);
  };

  const getPriorityColor = (priority?: Task["priority"]) => {
    switch (priority) {
      case "alta": return "border-l-red-500";
      case "media": return "border-l-yellow-500";
      case "baixa": return "border-l-green-500";
      default: return "border-l-gray-200";
    }
  };

  const getDueDateStatus = () => {
    if (!task.dueDate) return null;
    
    const dueDate = new Date(task.dueDate);
    
    if (isToday(dueDate)) return { text: "Hoje", color: "text-orange-500" };
    if (isYesterday(dueDate)) return { text: "Ontem", color: "text-red-500" };
    if (isAfter(dueDate, new Date())) return { text: format(dueDate, "MMM d", { locale: ptBR }), color: "text-blue-500" };
    return { text: format(dueDate, "MMM d", { locale: ptBR }), color: "text-red-500" };
  };

  const dueStatus = getDueDateStatus();

  return (
    <Dialog open={isEditing} onOpenChange={setIsEditing}>
      <Card className={`border-l-4 ${getPriorityColor(task.priority)} transition-all ${
        task.completed ? "opacity-60" : "hover:shadow-md"
      }`}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              <Checkbox
                checked={task.completed}
                onCheckedChange={handleToggle}
                className="mt-1"
              />
              <div className="flex-1">
                <h3 className={`font-semibold ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                  {task.title}
                </h3>
                {task.description && (
                  <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                )}
                <div className="flex flex-wrap gap-3 mt-2 text-xs text-muted-foreground">
                  {dueStatus && (
                    <span className={dueStatus.color}>
                      <Calendar className="h-3 w-3 inline mr-1" />
                      {dueStatus.text}
                    </span>
                  )}
                  {task.estimatedTime && (
                    <span>
                      <Clock className="h-3 w-3 inline mr-1" />
                      {task.estimatedTime}min
                    </span>
                  )}
                  {task.category && (
                    <span className="bg-secondary px-2 py-0.5 rounded">
                      {task.category}
                    </span>
                  )}
                </div>
                {task.tags && task.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {task.tags.map((tag) => (
                      <span key={tag} className="text-xs bg-accent px-2 py-0.5 rounded">
                        <Tag className="h-3 w-3 inline mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-1">
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(task.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <DialogContent>
        <TaskForm
          initialTask={task}
          onSubmit={handleEdit}
        />
      </DialogContent>
    </Dialog>
  );
};
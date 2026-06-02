"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Tag, X } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

type Props = {
  onAdd: (task: Task) => void;
  initialTask?: Task;
  onSubmit?: (task: Task) => void;
};

export const TaskForm: React.FC<Props> = ({ onAdd, initialTask, onSubmit }) => {
  const [title, setTitle] = useState(initialTask?.title || "");
  const [description, setDescription] = useState(initialTask?.description || "");
  const [priority, setPriority] = useState<Task["priority"]>(initialTask?.priority || "media");
  const [category, setCategory] = useState(initialTask?.category || "");
  const [tags, setTags] = useState<string[]>(initialTask?.tags || []);
  const [estimatedTime, setEstimatedTime] = useState(initialTask?.estimatedTime?.toString() || "");
  const [dueDate, setDueDate] = useState<Date | undefined>(
    initialTask?.dueDate ? new Date(initialTask.dueDate) : undefined
  );
  const [newTag, setNewTag] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const task: Task = {
      id: initialTask?.id || crypto.randomUUID(),
      title: title.trim(),
      description: description.trim() || undefined,
      completed: initialTask?.completed || false,
      dueDate: dueDate?.toISOString(),
      priority,
      category: category || undefined,
      tags: tags.length > 0 ? tags : undefined,
      estimatedTime: estimatedTime ? parseInt(estimatedTime) : undefined,
      createdAt: initialTask?.createdAt || new Date().toISOString(),
    };

    if (onSubmit) {
      onSubmit(task);
    } else {
      onAdd(task);
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Título da tarefa *"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="text-lg"
      />

      <Textarea
        placeholder="Descrição (opcional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Select value={priority} onValueChange={(v) => setPriority(v as Task["priority"])}>
          <SelectTrigger>
            <SelectValue placeholder="Prioridade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="alta">Alta</SelectItem>
            <SelectItem value="media">Média</SelectItem>
            <SelectItem value="baixa">Baixa</SelectItem>
          </SelectContent>
        </Select>

        <Input
          placeholder="Categoria"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <Input
          type="number"
          placeholder="Tempo (min)"
          value={estimatedTime}
          onChange={(e) => setEstimatedTime(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dueDate ? format(dueDate, "PPP", { locale: ptBR }) : "Data de vencimento"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={dueDate}
              onSelect={setDueDate}
              locale={ptBR}
            />
          </PopoverContent>
        </Popover>

        <div className="flex gap-2">
          <Input
            placeholder="Tag"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddTag}
            disabled={!newTag.trim()}
          >
            <Tag className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      <Button type="submit" className="w-full">
        {initialTask ? "Salvar Tarefa" : "Adicionar Tarefa"}
      </Button>
    </form>
  );
};
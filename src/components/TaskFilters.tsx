"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FilterType } from "@/hooks/useTasks";
import { 
  Search, 
  ListTodo, 
  CheckCircle, 
  Circle, 
  Clock, 
  AlertTriangle,
  ArrowUpDown,
  RotateCcw
} from "lucide-react";

type Props = {
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sortBy: "createdAt" | "dueDate" | "priority" | "title";
  setSortBy: (sort: "createdAt" | "dueDate" | "priority" | "title") => void;
  sortOrder: "asc" | "desc";
  setSortOrder: (order: "asc" | "desc") => void;
  stats: { 
    total: number; 
    active: number; 
    completed: number; 
    overdue: number;
    today: number;
  };
  categories: Record<string, number>;
  onClearCompleted: () => void;
};

export const TaskFilters: React.FC<Props> = ({
  filter,
  setFilter,
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  stats,
  categories,
  onClearCompleted,
}) => {
  const sortOptions = [
    { value: "createdAt", label: "Data" },
    { value: "dueDate", label: "Vencimento" },
    { value: "priority", label: "Prioridade" },
    { value: "title", label: "Título" },
  ];

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por título, descrição ou tags..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          variant={filter === "todas" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("todas")}
        >
          <ListTodo className="h-4 w-4 mr-1" />
          Todas ({stats.total})
        </Button>
        <Button
          variant={filter === "ativas" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("ativas")}
        >
          <Circle className="h-4 w-4 mr-1" />
          Ativas ({stats.active})
        </Button>
        <Button
          variant={filter === "completadas" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("completadas")}
        >
          <CheckCircle className="h-4 w-4 mr-1" />
          Completadas ({stats.completed})
        </Button>
        <Button
          variant={filter === "atrasadas" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("atrasadas")}
        >
          <AlertTriangle className="h-4 w-4 mr-1" />
          Atrasadas ({stats.overdue})
        </Button>
        <Button
          variant={filter === "hoje" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("hoje")}
        >
          <Clock className="h-4 w-4 mr-1" />
          Hoje ({stats.today})
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
        <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
        >
          {sortOrder === "asc" ? "↑" : "↓"}
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="text-sm text-muted-foreground">Categorias:</span>
        {Object.entries(categories).map(([category, count]) => (
          <Badge key={category} variant="outline" className="cursor-pointer">
            {category} ({count})
          </Badge>
        ))}
      </div>

      {stats.completed > 0 && (
        <Button
          variant="outline"
          size="sm"
          onClick={onClearCompleted}
        >
          <RotateCcw className="h-4 w-4 mr-1" />
          Limpar Completadas
        </Button>
      )}
    </div>
  );
};
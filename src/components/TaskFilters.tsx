import { Search, Trash2 } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import type { TaskFilter } from "@/hooks/useTasks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type Stats = { total: number; active: number; completed: number; overdue: number; today: number };

type Props = {
  filter: TaskFilter;
  setFilter: Dispatch<SetStateAction<TaskFilter>>;
  searchTerm: string;
  setSearchTerm: Dispatch<SetStateAction<string>>;
  sortBy: "dueDate" | "priority" | "createdAt";
  setSortBy: Dispatch<SetStateAction<"dueDate" | "priority" | "createdAt">>;
  sortOrder: "asc" | "desc";
  setSortOrder: Dispatch<SetStateAction<"asc" | "desc">>;
  stats: Stats;
  categories: string[];
  onClearCompleted: () => Promise<boolean>;
};

export function TaskFilters({
  filter, setFilter, searchTerm, setSearchTerm, sortBy, setSortBy,
  sortOrder, setSortOrder, stats, onClearCompleted,
}: Props) {
  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Buscar tarefas..." className="pl-9" />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Select value={filter} onValueChange={(value) => setFilter(value as TaskFilter)}>
          <SelectTrigger aria-label="Filtrar tarefas"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas ({stats.total})</SelectItem>
            <SelectItem value="active">Ativas ({stats.active})</SelectItem>
            <SelectItem value="completed">Concluídas ({stats.completed})</SelectItem>
            <SelectItem value="overdue">Atrasadas ({stats.overdue})</SelectItem>
            <SelectItem value="today">Para hoje ({stats.today})</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={(value) => setSortBy(value as Props["sortBy"])}>
          <SelectTrigger aria-label="Ordenar por"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt">Data de criação</SelectItem>
            <SelectItem value="dueDate">Vencimento</SelectItem>
            <SelectItem value="priority">Prioridade</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as Props["sortOrder"])}>
          <SelectTrigger aria-label="Direção da ordenação"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="desc">Decrescente</SelectItem>
            <SelectItem value="asc">Crescente</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {stats.completed > 0 && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm" className="text-destructive"><Trash2 className="mr-2 h-4 w-4" />Excluir concluídas</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir tarefas concluídas?</AlertDialogTitle>
              <AlertDialogDescription>Tem certeza de que deseja excluir {stats.completed} tarefa(s) concluída(s)? Esta ação não pode ser desfeita.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => void onClearCompleted()}>Sim, excluir todas</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}

export default TaskFilters;

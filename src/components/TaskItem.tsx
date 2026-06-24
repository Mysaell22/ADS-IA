import { useState } from "react";
import { format, isAfter, isToday, isYesterday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, Clock, Edit, Tag, Trash2 } from "lucide-react";
import { TaskForm } from "./TaskForm";
import type { Task } from "@/types/task";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Props = {
  task: Task;
  onUpdate: (task: Task) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
};

export const TaskItem = ({ task, onUpdate, onDelete }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [pendingEdit, setPendingEdit] = useState<Task | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const confirmEdit = async () => {
    if (!pendingEdit) return;
    setIsSubmitting(true);
    const success = await onUpdate(pendingEdit);
    setIsSubmitting(false);
    if (success) {
      setPendingEdit(null);
      setIsEditing(false);
    }
  };

  const confirmRemoval = async () => {
    setIsSubmitting(true);
    const success = await onDelete(task.id);
    setIsSubmitting(false);
    if (success) setConfirmDelete(false);
  };

  const dueStatus = (() => {
    if (!task.dueDate) return null;
    const dueDate = new Date(task.dueDate);
    if (isToday(dueDate)) return { text: "Hoje", color: "text-orange-600" };
    if (isYesterday(dueDate)) return { text: "Ontem", color: "text-red-600" };
    return {
      text: format(dueDate, "dd 'de' MMM", { locale: ptBR }),
      color: isAfter(dueDate, new Date()) ? "text-blue-600" : "text-red-600",
    };
  })();

  const priorityBorder = {
    alta: "border-l-red-500",
    media: "border-l-yellow-500",
    baixa: "border-l-green-500",
  }[task.priority || "media"];

  return (
    <>
      <Card className={`border-l-4 ${priorityBorder} transition-shadow ${task.completed ? "opacity-60" : "hover:shadow-md"}`}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 flex-1 items-start gap-3">
              <Checkbox
                checked={task.completed}
                onCheckedChange={() => void onUpdate({ ...task, completed: !task.completed })}
                className="mt-1"
                aria-label={task.completed ? "Marcar como ativa" : "Marcar como concluída"}
              />
              <div className="min-w-0 flex-1">
                <h3 className={`break-words font-semibold ${task.completed ? "line-through text-muted-foreground" : ""}`}>{task.title}</h3>
                {task.description && <p className="mt-1 break-words text-sm text-muted-foreground">{task.description}</p>}
                <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                  {dueStatus && <span className={dueStatus.color}><Calendar className="mr-1 inline h-3 w-3" />{dueStatus.text}</span>}
                  {task.estimatedTime != null && <span><Clock className="mr-1 inline h-3 w-3" />{task.estimatedTime} min</span>}
                  {task.category && <span className="rounded bg-secondary px-2 py-0.5">{task.category}</span>}
                </div>
                {task.tags && task.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {task.tags.map((tag) => <span key={tag} className="rounded bg-accent px-2 py-0.5 text-xs"><Tag className="mr-1 inline h-3 w-3" />{tag}</span>)}
                  </div>
                )}
              </div>
            </div>
            <div className="flex shrink-0 gap-1">
              <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)} aria-label={`Editar ${task.title}`}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => setConfirmDelete(true)} aria-label={`Excluir ${task.title}`}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isEditing} onOpenChange={(open) => { setIsEditing(open); if (!open) setPendingEdit(null); }}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar tarefa</DialogTitle>
            <DialogDescription>Altere os dados e revise antes de confirmar.</DialogDescription>
          </DialogHeader>
          <TaskForm initialTask={task} onSubmit={(updated) => setPendingEdit(updated)} />
        </DialogContent>
      </Dialog>

      <AlertDialog open={Boolean(pendingEdit)} onOpenChange={(open) => { if (!open && !isSubmitting) setPendingEdit(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar edição?</AlertDialogTitle>
            <AlertDialogDescription>Tem certeza de que deseja salvar as alterações na tarefa “{task.title}”?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Voltar e revisar</AlertDialogCancel>
            <AlertDialogAction disabled={isSubmitting} onClick={(event) => { event.preventDefault(); void confirmEdit(); }}>
              {isSubmitting ? "Salvando..." : "Sim, salvar alterações"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={confirmDelete} onOpenChange={(open) => { if (!isSubmitting) setConfirmDelete(open); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir tarefa?</AlertDialogTitle>
            <AlertDialogDescription>Tem certeza de que deseja excluir “{task.title}”? Esta ação não pode ser desfeita.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" disabled={isSubmitting} onClick={(event) => { event.preventDefault(); void confirmRemoval(); }}>
              {isSubmitting ? "Excluindo..." : "Sim, excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

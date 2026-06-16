import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { showError, showSuccess } from "@/utils/toast";

type Task = {
  id: string | number;
  task: string;
};

const HomePage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [editingId, setEditingId] = useState<Task["id"] | null>(null);
  const [editText, setEditText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchTasks = async () => {
    setIsLoading(true);

    const { data, error } = await supabase.from("tarefas").select("*"); // ← CORRIGIDO: era "tasks"

    if (error) {
      showError("Falha ao carregar tarefas.");
      setIsLoading(false);
      return;
    }

    setTasks(data ?? []);
    setIsLoading(false);
  };

  useEffect(() => {
    void fetchTasks();
  }, []);

  const handleAddTask = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const taskText = newTask.trim();
    if (!taskText) return;

    setIsLoading(true);

    const { data, error } = await supabase
      .from("tarefas") // ← CORRIGIDO: era "tasks"
      .insert({ task: taskText })
      .select()
      .single();

    if (error || !data) {
      showError("Falha ao adicionar tarefa.");
      setIsLoading(false);
      return;
    }

    setTasks([data, ...tasks]);
    setNewTask("");
    setIsLoading(false);
    showSuccess("Tarefa adicionada.");
  };

  const handleEdit = (task: Task) => {
    setEditingId(task.id);
    setEditText(task.task);
  };

  const handleUpdate = async (task: Task) => {
    const taskText = editText.trim();
    if (!taskText) return;

    setIsLoading(true);

    const { data, error } = await supabase
      .from("tarefas") // ← CORRIGIDO: era "tasks"
      .update({ task: taskText })
      .eq("id", task.id)
      .select()
      .single();

    if (error || !data) {
      showError("Falha ao atualizar tarefa.");
      setIsLoading(false);
      return;
    }

    setTasks(tasks.map((item) => (item.id === task.id ? data : item)));
    setEditingId(null);
    setEditText("");
    setIsLoading(false);
    showSuccess("Tarefa atualizada.");
  };

  const handleDelete = async (taskId: Task["id"]) => {
    setIsLoading(true);

    const { error } = await supabase.from("tarefas").delete().eq("id", taskId); // ← CORRIGIDO: era "tasks"

    if (error) {
      showError("Falha ao excluir tarefa.");
      setIsLoading(false);
      return;
    }

    setTasks(tasks.filter((task) => task.id !== taskId));
    setIsLoading(false);
    showSuccess("Tarefa excluída.");
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <Card className="mx-auto w-full max-w-3xl shadow-sm">
        <CardHeader>
          <CardTitle>Lista de tarefas</CardTitle>
          <CardDescription>Crie, edite e exclua tarefas salvas no Supabase.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <form onSubmit={handleAddTask} className="flex flex-col gap-3 sm:flex-row">
            <Input
              value={newTask}
              onChange={(event) => setNewTask(event.target.value)}
              placeholder="Nova tarefa"
              className="flex-1"
            />
            <Button type="submit" disabled={!newTask.trim() || isLoading}>
              Adicionar
            </Button>
          </form>

          {editingId !== null && (
            <form
              onSubmit={(event) => {
                event.preventDefault();
                const task = tasks.find((item) => item.id === editingId);
                if (task) void handleUpdate(task);
              }}
              className="rounded-lg border bg-white p-4"
            >
              <div className="mb-3 text-sm font-medium text-slate-700">Editando tarefa</div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Input
                  value={editText}
                  onChange={(event) => setEditText(event.target.value)}
                  placeholder="Texto da tarefa"
                  className="flex-1"
                />
                <Button type="submit" variant="secondary" disabled={!editText.trim() || isLoading}>
                  Salvar
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingId(null);
                    setEditText("");
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          )}

          {isLoading ? (
            <p className="text-sm text-slate-500">Carregando...</p>
          ) : tasks.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center text-slate-500">
              Nenhuma tarefa cadastrada ainda.
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => (
                <div key={task.id} className="rounded-lg border bg-white p-4">
                  <p className="mb-4 text-base font-medium text-slate-900">{task.task}</p>
                  <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                    <Button variant="outline" onClick={() => handleEdit(task)} disabled={isLoading}>
                      Editar
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => void handleDelete(task.id)}
                      disabled={isLoading}
                    >
                      Excluir
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HomePage;
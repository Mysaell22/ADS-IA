import { ArrowRight, CheckCircle2, RotateCcw, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { MadeWithDyad } from "@/components/made-with-dyad";

const Index = () => {
  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#f8fafc_0%,#ecfeff_45%,#f0fdf4_100%)] px-4 py-8">
      <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl flex-col justify-center gap-8">
        <section className="space-y-6">
          <div className="inline-flex items-center rounded bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
            Nova versão visual
          </div>
          <div className="max-w-3xl space-y-4">
            <h1 className="text-4xl font-bold text-slate-950 md:text-6xl">Meu To Do Aurora</h1>
            <p className="text-lg text-slate-600">
              Um app de tarefas com autenticação, cadastro, filtros, exclusão lógica com confirmação e restauração pela lixeira.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              to="/tasks"
              className="inline-flex items-center justify-center rounded-md bg-slate-950 px-5 py-3 font-medium text-white transition hover:bg-slate-800"
            >
              Abrir tarefas <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              to="/signup"
              className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-5 py-3 font-medium text-slate-900 transition hover:bg-slate-50"
            >
              Criar usuário
            </Link>
          </div>
        </section>

        <section className="grid gap-3 md:grid-cols-3">
          {[
            { icon: CheckCircle2, title: "Organização", text: "Prioridades, prazos, categorias e busca." },
            { icon: Trash2, title: "Soft delete", text: "Exclusão com confirmação antes da ação." },
            { icon: RotateCcw, title: "Restauração", text: "Tarefas excluídas podem voltar para a lista." },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-lg border bg-white/85 p-5 shadow-sm">
              <Icon className="mb-4 h-6 w-6 text-emerald-600" />
              <h2 className="font-semibold text-slate-950">{title}</h2>
              <p className="mt-1 text-sm text-slate-600">{text}</p>
            </div>
          ))}
        </section>
        <MadeWithDyad />
      </main>
    </div>
  );
};

export default Index;

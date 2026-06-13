"use client";

import { Link } from "react-router-dom";
import { MadeWithDyad } from "@/components/made-with-dyad";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 gap-6">
      <h1 className="text-4xl font-bold">Bem‑vindo ao CRUD de Tarefas</h1>
      <Link
        to="/tasks"
        className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition"
      >
        Ir para Tarefas
      </Link>
      <MadeWithDyad />
    </div>
  );
};

export default Index;
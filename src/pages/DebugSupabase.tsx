"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button, Input } from "@/components/ui/input";
import { showError, showSuccess } from "@/utils/toast";

const DebugSupabase = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<string>("");

  const testAuth = async () => {
    if (!email || !password) {
      setStatus("Preencha e‑mail e senha.");
      return;
    }
    setStatus("Testando...");
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { redirectTo: "http://localhost:5173" },
    });
    if (error) {
      setStatus(`Erro: ${error.message}`);
      showError(error.message);
    } else {
      setStatus("Sucesso! Verifique seu e‑mail.");
      showSuccess("Cadastro iniciado.");
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-xl mb-4">Teste Supabase</h2>
      <Input
        placeholder="E‑mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-2 w-full"
      />
      <Input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mb-4 w-full"
      />
      <Button type="button" onClick={testAuth} className="w-full">
        Testar conexão
      </Button>
      <p className="mt-4 text-sm">{status}</p>
    </div>
  );
};

export default DebugSupabase;
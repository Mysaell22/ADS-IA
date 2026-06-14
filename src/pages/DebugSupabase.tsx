"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button, Input } from "@/components/ui/input";
import { showError, showSuccess } from "@/utils/toast";

const DebugSupabase = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [env, setEnv] = useState<Record<string, string | undefined>>({});

  // Load env vars on mount
  React.useEffect(() => {
    setEnv({
      VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
      VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
    });
  }, []);

  const testAuth = async () => {
    if (!email || !password) {
      setStatus("Preencha e‑mail e senha.");
      return;
    }
    setStatus("Testando...");
    try {
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
    } catch (e: any) {
      setStatus(`Exceção: ${e.message}`);
      showError(e.message);
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-xl mb-4">Teste Supabase</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Environment variables */}
        <div>
          <h3 className="font-semibold">Variáveis de ambiente</h3>
          <ul className="space-y-1 text-sm">
            {Object.entries(env).map(([key, value]) => (
              <li key={key}>
                <strong>{key}:</strong> {value ?? "não definida"}
              </li>
            ))}
          </ul>
        </div>

        {/* Auth form */}
        <div>
          <h3 className="font-semibold">Teste de autenticação</h3>
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
        </div>
      </div>
      <p className="mt-4 text-sm">{status}</p>
    </div>
  );
};

export default DebugSupabase;
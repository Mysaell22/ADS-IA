import React, { FormEvent, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { showError, showSuccess } from "@/utils/toast";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Determine where to redirect after login
  const from = location.state?.from?.pathname || "/";

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const emailValue = email.trim();

    if (!emailValue || !password) {
      showError("Digite e-mail e senha.");
      return;
    }

    setIsLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: emailValue,
      password,
    });

    if (error) {
      showError(error.message || "Não foi possível entrar. Verifique suas credenciais.");
      setIsLoading(false);
      return;
    }

    showSuccess("Login realizado com sucesso.");
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <Card className="mx-auto w-full max-w-md shadow-sm">
        <CardHeader>
          <CardTitle>Entrar</CardTitle>
          <CardDescription>Acesse sua conta para gerenciar tarefas.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="E-mail"
              autoComplete="email"
            />
            <Input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Senha"
              autoComplete="current-password"
            />
            <Button type="submit" className="w-full" disabled={!email.trim() || !password || isLoading}>
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-slate-600">
            Não tem uma conta?{" "}
            <a href="/signup" className="font-medium text-indigo-600 hover:text-indigo-700">
              Criar conta
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;

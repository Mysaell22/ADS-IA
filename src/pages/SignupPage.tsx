import React, { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { showError, showSuccess } from "@/utils/toast";

const SignupPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nameValue = name.trim();
    const emailValue = email.trim();

    if (!nameValue || !emailValue || !password) {
      showError("Preencha todos os campos.");
      return;
    }

    setIsLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: emailValue,
      password,
      options: {
        data: {
          name: nameValue,
        },
      },
    });

    if (error) {
      showError(error.message || "Não foi possível criar a conta.");
      setIsLoading(false);
      return;
    }

    if (data.session) {
      showSuccess("Cadastro realizado. Você já está conectado.");
      navigate("/tasks", { replace: true });
    } else {
      showSuccess("Cadastro realizado. Confirme o e-mail antes de entrar.");
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <Card className="mx-auto w-full max-w-md shadow-sm">
        <CardHeader>
          <CardTitle>Criar conta</CardTitle>
          <CardDescription>Faça seu cadastro para usar a lista de tarefas.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Nome"
              autoComplete="name"
            />
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
              autoComplete="new-password"
            />
            <Button type="submit" className="w-full" disabled={!name.trim() || !email.trim() || !password || isLoading}>
              {isLoading ? "Criando conta..." : "Criar conta"}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-slate-600">
            Já tem uma conta?{" "}
            <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-700">
              Entrar
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignupPage;

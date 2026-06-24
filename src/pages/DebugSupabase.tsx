import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const DebugSupabase = () => {
  const [status, setStatus] = useState("");

  const testConnection = async () => {
    setStatus("Testando...");
    const { error } = await supabase.auth.getSession();
    setStatus(error ? `Erro: ${error.message}` : "Conexão estabelecida.");
  };

  return (
    <div className="mx-auto max-w-md p-8">
      <h2 className="mb-4 text-xl font-semibold">Teste do Supabase</h2>
      <Input readOnly value={status} placeholder="Status da conexão" className="mb-4" />
      <Button type="button" onClick={() => void testConnection()} className="w-full">Testar conexão</Button>
    </div>
  );
};

export default DebugSupabase;

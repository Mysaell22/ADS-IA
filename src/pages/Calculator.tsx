"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Calculator = () => {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState<string | null>(null);

  const handleClick = (value: string) => {
    setExpression((prev) => prev + value);
    setResult(null);
  };

  const clear = () => {
    setExpression("");
    setResult(null);
  };

  const calculate = () => {
    try {
      // eslint-disable-next-line no-eval
      const evalResult = eval(expression);
      setResult(String(evalResult));
    } catch {
      setResult("Erro");
    }
  };

  const buttons = [
    "7",
    "8",
    "9",
    "/",
    "4",
    "5",
    "6",
    "*",
    "1",
    "2",
    "3",
    "-",
    "0",
    ".",
    "=",
    "+",
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">Calculadora</h1>
        <Input
          value={expression}
          readOnly
          className="text-right text-2xl mb-4 h-12"
        />
        {result !== null && (
          <div className="text-right text-xl text-gray-600 mb-2">{result}</div>
        )}
        <div className="grid grid-cols-4 gap-2">
          {buttons.map((btn) => (
            <Button
              key={btn}
              variant="outline"
              className="h-12 text-lg"
              onClick={() =>
                btn === "=" ? calculate() : handleClick(btn)
              }
            >
              {btn}
            </Button>
          ))}
          <Button
            variant="destructive"
            className="col-span-2 h-12"
            onClick={clear}
          >
            C
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
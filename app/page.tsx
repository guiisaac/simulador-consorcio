"use client";
import { useState } from "react";
import SimuladorForm from "./components/SimuladorForm";
import ResultadosSimulacao from "./components/ResultadosSimulacao";

export default function Home() {
  const [resultados, setResultados] = useState<any>(null);

  return (
    <div className="min-h-screen p-4">
      <div className="text-center mb-4">
        <h1 className="text-3xl font-bold text-gray-900">Simulador do Projeto L.A.R.</h1>
        <p className="text-sm text-gray-600 mt-1">
          Simulação financeira para análise de investimento em consórcios
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-4">
        <SimuladorForm onSubmit={setResultados} />
      </div>

      {resultados && (
        <div className="mt-4">
          <div className="bg-white rounded-lg shadow-lg p-4">
            <div className="h-[calc(100vh-300px)]">
              <ResultadosSimulacao dados={resultados} view="graph" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 
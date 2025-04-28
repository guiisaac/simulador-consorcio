"use client";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ResultadosSimulacaoProps {
  dados: {
    parcelaBase: number;
    parcelaReduzidaInicial: number;
    parcelaAposContemplacao: number;
    totalPago: number;
    creditoDisponivel: number;
    valorFinal: number;
    meses: number;
    mesContemplacao: number;
    valorCarta: number;
    valorCartaCorrigido: number;
    valorCDI: number;
    correcaoAnual: number;
    taxaAdmin: number;
    reducao: number;
  };
  view: "graph" | "results";
}

const formatarMoeda = (valor: number) => {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
};

const ResultadosSimulacao = ({ dados, view }: ResultadosSimulacaoProps) => {
  // Função para calcular o valor da parcela em cada mês
  const calcularParcelaMes = (mes: number) => {
    if (mes <= dados.mesContemplacao) {
      // Antes da contemplação: parcela reduzida com correção anual
      return dados.parcelaReduzidaInicial * Math.pow(1 + dados.correcaoAnual/100, Math.floor((mes-1)/12));
    }
    // Após contemplação: parcela normal com correção anual
    return dados.parcelaAposContemplacao * Math.pow(1 + dados.correcaoAnual/100, Math.floor((mes-1)/12));
  };

  // Função para calcular o valor acumulado pago até um determinado mês
  const calcularValorAcumulado = (mesFinal: number) => {
    let total = 0;
    for (let mes = 1; mes <= mesFinal; mes++) {
      total += calcularParcelaMes(mes);
    }
    return total;
  };

  // Função para calcular o patrimônio do consórcio em cada mês
  const calcularPatrimonioConsorcio = (mes: number) => {
    if (mes < dados.mesContemplacao) {
      return 0;
    }
    if (mes === dados.mesContemplacao) {
      return dados.valorCartaCorrigido;
    }
    // Após contemplação, valor corrigido pelo CDI
    const mesesAposCont = mes - dados.mesContemplacao;
    const taxaCDIMensal = Math.pow(1 + dados.valorCDI/100, 1/12) - 1;
    return dados.valorCartaCorrigido * Math.pow(1 + taxaCDIMensal, mesesAposCont);
  };

  // Função para calcular o patrimônio do investimento em cada mês
  const calcularPatrimonioInvestimento = (mes: number) => {
    const taxaCDIMensal = Math.pow(1 + dados.valorCDI/100, 1/12) - 1;
    let saldo = 0;
    for (let i = 1; i <= mes; i++) {
      const parcela = calcularParcelaMes(i);
      saldo = (saldo + parcela) * (1 + taxaCDIMensal);
    }
    return saldo;
  };

  const labels = Array.from({ length: dados.meses }, (_, i) => `${i + 1}`);
  const valoresAcumulados = labels.map((_, index) => calcularValorAcumulado(index + 1));
  const valoresPatrimonioConsorcio = labels.map((_, index) => calcularPatrimonioConsorcio(index + 1));
  const valoresPatrimonioInvestimento = labels.map((_, index) => calcularPatrimonioInvestimento(index + 1));

  const data = {
    labels,
    datasets: [
      {
        label: "Total Pago",
        data: valoresAcumulados,
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        borderWidth: 2,
        pointRadius: 0,
        fill: true,
      },
      {
        label: "Patrimônio Consórcio",
        data: valoresPatrimonioConsorcio,
        borderColor: "rgb(34, 197, 94)",
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        borderWidth: 2,
        pointRadius: 0,
        fill: true,
      },
      {
        label: "Patrimônio Investimento",
        data: valoresPatrimonioInvestimento,
        borderColor: "rgb(168, 85, 247)",
        backgroundColor: "rgba(168, 85, 247, 0.1)",
        borderWidth: 2,
        pointRadius: 0,
        fill: true,
      }
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: "line",
        }
      },
      tooltip: {
        mode: "index" as const,
        intersect: false,
        callbacks: {
          title: function(context: any) {
            const mes = context[0].label;
            const parcela = formatarMoeda(calcularParcelaMes(parseInt(mes)));
            return [`Mês ${mes}`, `Parcela: ${parcela}`];
          },
          label: function(context: any) {
            return `${context.dataset.label}: ${formatarMoeda(context.parsed.y)}`;
          }
        },
        padding: 12,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'rgb(255, 255, 255)',
        bodyColor: 'rgb(255, 255, 255)',
        bodySpacing: 8,
        titleSpacing: 8,
        boxPadding: 6,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          callback: function(value: any) {
            return formatarMoeda(value);
          },
          maxTicksLimit: 8,
        }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxTicksLimit: 12,
          callback: function(value: any, index: number) {
            if (index === 0) return "Início";
            if (index === dados.mesContemplacao - 1) return `Contemplação`;
            return `${value}`;
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
  };

  if (view === "graph") {
    return (
      <div className="h-full">
        <Line options={options} data={data} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Resultados Financeiros</h2>
      
      <div className="space-y-3">
        <div className="p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-600">Parcela Mensal</p>
          <p className="text-xl font-semibold text-blue-700">{formatarMoeda(dados.parcelaReduzidaInicial)}</p>
          <p className="text-xs text-gray-500">Inicial com redução de {dados.reducao}%</p>
        </div>

        <div className="p-3 bg-green-50 rounded-lg">
          <p className="text-sm text-gray-600">Crédito Disponível</p>
          <p className="text-xl font-semibold text-green-700">{formatarMoeda(dados.creditoDisponivel)}</p>
          <p className="text-xs text-gray-500">Na contemplação (mês {dados.mesContemplacao})</p>
        </div>

        <div className="p-3 bg-yellow-50 rounded-lg">
          <p className="text-sm text-gray-600">Total Pago</p>
          <p className="text-xl font-semibold text-yellow-700">{formatarMoeda(dados.totalPago)}</p>
          <p className="text-xs text-gray-500">Em {dados.meses} meses</p>
        </div>

        <div className="p-3 bg-purple-50 rounded-lg">
          <p className="text-sm text-gray-600">Valor Final</p>
          <p className="text-xl font-semibold text-purple-700">{formatarMoeda(dados.valorFinal)}</p>
          <p className="text-xs text-gray-500">Com CDI de {dados.valorCDI}% a.a.</p>
        </div>

        <div className="p-3 bg-red-50 rounded-lg">
          <p className="text-sm text-gray-600">Diferença Final</p>
          <p className="text-xl font-semibold text-red-700">
            - {formatarMoeda(dados.totalPago - dados.valorFinal)}
          </p>
          <p className="text-xs text-gray-500">Prejuízo em relação ao total investido</p>
        </div>
      </div>
    </div>
  );
};

export default ResultadosSimulacao; 
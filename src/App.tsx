import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { calcularResultados, gerarDadosGrafico } from "./utils/calculos";
import { SimuladorData, ResultadoCalculo, DadosGrafico } from "./types";

const dadosIniciais: SimuladorData = {
  valorCarta: 300000,
  reducaoPercentual: 30,
  prazo: 240,
  mesContemplacao: 36,
  taxaAdministrativa: 16,
  correcaoAnual: 4,
  valorCDI: 10,
};

const formatarMoeda = (valor: number): string => {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    dataKey: string;
    color: string;
    payload: {
      parcela: number;
      [key: string]: any;
    };
  }>;
  label?: string;
  dados: SimuladorData;
}

const CustomTooltip: React.FC<CustomTooltipProps> = React.memo(
  ({ active, payload, label, dados }) => {
    if (active && payload && payload.length) {
      const mesAtual = Number(label);
      const parcelaAtual = payload[0]?.payload?.parcela || 0;
      const isAntesContemplacao = mesAtual < dados.mesContemplacao;

      return (
        <div className="bg-white/95 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-gray-200">
          <div className="border-b border-gray-200 pb-2 mb-3">
            <p className="font-semibold text-slate-800">Mês {mesAtual}</p>
            <p className="text-xs text-slate-500">
              {isAntesContemplacao
                ? "Antes da contemplação"
                : "Após contemplação"}
            </p>
          </div>

          <div className="space-y-2">
            <div className="bg-amber-50 p-2 rounded-md">
              <p className="text-sm font-medium text-amber-700">
                Parcela {mesAtual}ª:
              </p>
              <p className="text-base font-semibold text-amber-600">
                {formatarMoeda(parcelaAtual)}
              </p>
              {isAntesContemplacao && (
                <p className="text-xs text-amber-600 mt-1">
                  Com redução de {dados.reducaoPercentual}%
                </p>
              )}
            </div>

            {payload.map((entry) => (
              <div
                key={entry.dataKey}
                className="flex justify-between items-center py-1"
              >
                <span className="text-sm" style={{ color: entry.color }}>
                  {entry.dataKey === "totalPago" && "Total Pago"}
                  {entry.dataKey === "patrimonio" && "Patrimônio"}
                  {entry.dataKey === "investimento" && "Investimento"}:
                </span>
                <span
                  className="text-sm font-medium"
                  style={{ color: entry.color }}
                >
                  {formatarMoeda(entry.value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  }
);

interface InfoTooltipProps {
  text: string;
  children: React.ReactNode;
}

const InfoTooltip: React.FC<InfoTooltipProps> = ({ text, children }) => {
  const [show, setShow] = useState(false);
  return (
    <div
      className="relative flex items-center"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max max-w-xs p-2 bg-slate-700 text-white text-xs rounded-md shadow-lg z-10">
          {text}
        </div>
      )}
    </div>
  );
};

function App() {
  const [dados, setDados] = useState<SimuladorData>(dadosIniciais);
  const [resultados, setResultados] = useState<ResultadoCalculo | null>(null);
  const [dadosGrafico, setDadosGrafico] = useState<DadosGrafico[]>([]);
  const [mesInvestimentoIgualaCarta, setMesInvestimentoIgualaCarta] = useState<
    number | string | null
  >(null);

  useEffect(() => {
    const novosResultados = calcularResultados(dados);
    setResultados(novosResultados);
    const novosDadosGrafico = gerarDadosGrafico(dados);
    setDadosGrafico(novosDadosGrafico);

    if (novosDadosGrafico.length > 0 && dados.mesContemplacao > 0) {
      const indiceContemplacao = dados.mesContemplacao - 1;
      if (
        indiceContemplacao < novosDadosGrafico.length &&
        indiceContemplacao >= 0
      ) {
        const valorPatrimonioNaContemplacao =
          novosDadosGrafico[indiceContemplacao]?.patrimonio;

        if (valorPatrimonioNaContemplacao !== undefined) {
          let mesEncontrado: number | string = "Não alcançado no prazo";
          for (const ponto of novosDadosGrafico) {
            if (ponto.investimento >= valorPatrimonioNaContemplacao) {
              mesEncontrado = ponto.mes;
              break;
            }
          }
          setMesInvestimentoIgualaCarta(mesEncontrado);
        } else {
          setMesInvestimentoIgualaCarta("N/D Patr. Contempl.");
        }
      } else {
        setMesInvestimentoIgualaCarta("Mês contemp. inválido");
      }
    } else {
      setMesInvestimentoIgualaCarta(null);
    }
  }, [dados]);

  const handleInputChange = React.useCallback(
    (campo: keyof SimuladorData, valor: string) => {
      setDados((prev) => ({
        ...prev,
        [campo]: valor === "" ? 0 : Number(valor),
      }));
    },
    []
  );

  return (
    <div className="min-h-screen bg-slate-50 p-2 max-w-[1920px] mx-auto flex flex-col">
      <div className="max-w-7xl mx-auto w-full flex flex-col flex-grow">
        <div className="relative pt-2 pb-2 mb-1">
          <h1 className="text-3xl font-bold text-slate-800 text-center">
            Simulador de consórcio CIC-ONE
          </h1>
          <a
            href={import.meta.env.VITE_FORM_URL}
            className="bg-orange-500 hover:bg-orange-700 text-white hover:text-white font-semibold py-2 px-4 rounded-lg text-sm whitespace-nowrap absolute top-1/2 right-0 transform -translate-y-1/2 transition-colors duration-150 ease-in-out"
            target="_blank" // Opcional: abrir em nova aba
            rel="noopener noreferrer" // Segurança para target="_blank"
          >
            Quero fazer consórcio
          </a>
        </div>
        <h2 className="text-lg text-slate-600 text-center mb-2">
          Calcule todas as suas possibilidades com o consórcio
        </h2>
        {/* <p className="text-sm text-slate-500 text-center mb-4 max-w-2xl mx-auto">
          Preencha os campos abaixo com os dados do consórcio e do seu investimento para comparar os cenários. O gráfico e o painel de resultados serão atualizados automaticamente à medida que você altera os valores.
        </p> */}

        {/* Grid de inputs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 mb-3 bg-white/50 backdrop-blur-sm p-2 rounded-xl shadow-sm border border-slate-200">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Valor da carta (R$)
            </label>
            <input
              type="number"
              value={dados.valorCarta || ""}
              onChange={(e) => handleInputChange("valorCarta", e.target.value)}
              className="w-full px-2 py-1 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white text-slate-900 font-medium"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              % de redução (%)
            </label>
            <input
              type="number"
              value={dados.reducaoPercentual || ""}
              onChange={(e) =>
                handleInputChange("reducaoPercentual", e.target.value)
              }
              className="w-full px-2 py-1 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white text-slate-900 font-medium"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Prazo (meses)
            </label>
            <input
              type="number"
              value={dados.prazo || ""}
              onChange={(e) => handleInputChange("prazo", e.target.value)}
              className="w-full px-2 py-1 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white text-slate-900 font-medium"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Mês contemplação
            </label>
            <input
              type="number"
              value={dados.mesContemplacao || ""}
              onChange={(e) =>
                handleInputChange("mesContemplacao", e.target.value)
              }
              className="w-full px-2 py-1 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white text-slate-900 font-medium"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Taxa admin. (%)
            </label>
            <input
              type="number"
              value={dados.taxaAdministrativa || ""}
              onChange={(e) =>
                handleInputChange("taxaAdministrativa", e.target.value)
              }
              className="w-full px-2 py-1 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white text-slate-900 font-medium"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Correção (% a.a.)
            </label>
            <input
              type="number"
              value={dados.correcaoAnual || ""}
              onChange={(e) =>
                handleInputChange("correcaoAnual", e.target.value)
              }
              className="w-full px-2 py-1 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white text-slate-900 font-medium"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              CDI (% a.a.)
            </label>
            <input
              type="number"
              value={dados.valorCDI || ""}
              onChange={(e) => handleInputChange("valorCDI", e.target.value)}
              className="w-full px-2 py-1 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white text-slate-900 font-medium"
            />
          </div>
        </div>

        {/* Container principal */}
        <div className="flex flex-col lg:flex-row gap-3 flex-grow">
          {/* Gráfico (75%) */}
          <div className="lg:w-[75%] bg-white/50 backdrop-blur-sm p-3 rounded-xl shadow-xl border border-slate-200 flex flex-col">
            <ResponsiveContainer
              width="100%"
              height={480}
              className="flex-grow"
            >
              <LineChart
                data={dadosGrafico}
                margin={{ top: 10, right: 20, left: 30, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis
                  dataKey="mes"
                  stroke="#94a3b8"
                  label={{
                    value: "Mês",
                    position: "insideBottom",
                    offset: -10,
                    style: { fill: "#94a3b8" },
                  }}
                />
                <YAxis
                  stroke="#94a3b8"
                  tickFormatter={(value) =>
                    Math.round(value).toLocaleString("pt-BR")
                  }
                  label={{
                    value: "Valor",
                    angle: -90,
                    position: "insideLeft",
                    offset: -20,
                    style: { fill: "#94a3b8" },
                  }}
                />
                <Tooltip content={<CustomTooltip dados={dados} />} />
                <Legend
                  verticalAlign="top"
                  height={28}
                  iconType="circle"
                  formatter={(value) => (
                    <span className="text-sm text-slate-700">{value}</span>
                  )}
                />
                <Line
                  type="monotone"
                  dataKey="totalPago"
                  name="Total Pago"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
                <Line
                  type="monotone"
                  dataKey="patrimonio"
                  name="Patrimônio"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
                <Line
                  type="monotone"
                  dataKey="investimento"
                  name="Investimento"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Resultados (25%) */}
          <div className="lg:w-[25%] bg-white/50 backdrop-blur-sm p-3 rounded-xl shadow-xl border border-slate-200 flex flex-col">
            <h3 className="text-lg font-semibold mb-3 text-slate-800">
              Resultados Chave
            </h3>
            <div className="space-y-2 flex-grow">
              <div className="p-2 rounded-lg bg-slate-100 border border-slate-200">
                <InfoTooltip text="Soma de todas as parcelas pagas durante o consórcio, incluindo correções e o valor da parcela integral após a contemplação.">
                  <p className="text-sm text-slate-600 flex items-center">
                    Valor Total Pago ao Final{" "}
                    <span className="ml-1 opacity-70 cursor-help">ℹ️</span>
                  </p>
                </InfoTooltip>
                <p className="text-lg font-semibold text-slate-800">
                  {formatarMoeda(resultados?.totalPago || 0)}
                </p>
              </div>
              <div className="p-2 rounded-lg bg-slate-100 border border-slate-200">
                <InfoTooltip text="Valor estimado da sua carta de crédito ao final do plano, considerando todas as correções anuais.">
                  <p className="text-sm text-slate-600 flex items-center">
                    Valor Final do Bem (Consórcio){" "}
                    <span className="ml-1 opacity-70 cursor-help">ℹ️</span>
                  </p>
                </InfoTooltip>
                <p className="text-lg font-semibold text-slate-800">
                  {formatarMoeda(resultados?.valorFinalComCorrecao || 0)}
                </p>
              </div>
              <div className="p-2 rounded-lg bg-slate-100 border border-slate-200">
                <InfoTooltip text="Mês em que o total acumulado, caso você investisse o valor das parcelas à taxa do CDI (em vez de pagar o consórcio), se igualaria ou superaria o valor da sua carta de crédito (corrigida até o mês da contemplação).">
                  <p className="text-sm text-slate-600 flex items-center">
                    Mês Invest. ≥ Vlr. Carta Contempl.{" "}
                    <span className="ml-1 opacity-70 cursor-help">ℹ️</span>
                  </p>
                </InfoTooltip>
                <p className="text-lg font-semibold text-slate-800">
                  {typeof mesInvestimentoIgualaCarta === "number"
                    ? `${mesInvestimentoIgualaCarta}º mês`
                    : mesInvestimentoIgualaCarta || "Calculando..."}
                </p>
              </div>
            </div>
            <h4 className="text-md font-semibold text-slate-700 mb-1 text-left mt-auto pt-3">
              Como usar? 🤔
            </h4>
            <p className="text-sm text-slate-500 text-left mb-3">
              Preencha os campos abaixo com os dados do consórcio e do seu
              investimento para comparar os cenários. O gráfico e o painel de
              resultados serão atualizados automaticamente à medida que você
              altera os valores.
            </p>
            <p className="text-xs text-slate-400 text-left">
              Atenção: Este é um simulador e os resultados apresentados são
              estimativas baseadas nos dados fornecidos. As condições reais de
              mercado e do seu contrato de consórcio podem variar. Esta
              ferramenta não constitui aconselhamento financeiro. Para decisões
              de investimento, consulte um profissional.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

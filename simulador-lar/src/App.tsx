import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { calcularResultados, gerarDadosGrafico } from './utils/calculos';
import { SimuladorData, ResultadoCalculo, DadosGrafico } from './types';

const dadosIniciais: SimuladorData = {
  valorCarta: 200000,
  reducaoPercentual: 30,
  prazo: 180,
  mesContemplacao: 36,
  taxaAdministrativa: 20,
  correcaoAnual: 12,
  valorCDI: 11.15,
};

const formatarMoeda = (valor: number): string => {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
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

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label, dados }) => {
  if (active && payload && payload.length) {
    const mesAtual = Number(label);
    const parcelaAtual = payload[0]?.payload?.parcela || 0;
    const isAntesContemplacao = mesAtual < dados.mesContemplacao;

    return (
      <div className="bg-white/95 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-gray-200">
        <div className="border-b border-gray-200 pb-2 mb-3">
          <p className="font-semibold text-slate-800">Mês {mesAtual}</p>
          <p className="text-xs text-slate-500">
            {isAntesContemplacao ? 'Antes da contemplação' : 'Após contemplação'}
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
                {entry.dataKey === 'totalPago' && 'Total Pago'}
                {entry.dataKey === 'patrimonio' && 'Patrimônio'}
                {entry.dataKey === 'investimento' && 'Investimento'}:
              </span>
              <span className="text-sm font-medium" style={{ color: entry.color }}>
                {formatarMoeda(entry.value)}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

function App() {
  const [dados, setDados] = useState<SimuladorData>(dadosIniciais);
  const [resultados, setResultados] = useState<ResultadoCalculo | null>(null);
  const [dadosGrafico, setDadosGrafico] = useState<DadosGrafico[]>([]);

  useEffect(() => {
    const novosResultados = calcularResultados(dados);
    setResultados(novosResultados);
    setDadosGrafico(gerarDadosGrafico(dados));
  }, [dados]);

  const handleInputChange = (campo: keyof SimuladorData, valor: string) => {
    setDados(prev => ({
      ...prev,
      [campo]: valor === '' ? 0 : Number(valor)
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 max-w-[1920px] mx-auto">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-1 text-slate-800">Simulador do Projeto L.A.R.</h1>
        <h2 className="text-lg text-slate-600 text-center mb-4">Calcule suas possibilidades de investimento</h2>

        {/* Grid de inputs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 mb-4 bg-white/50 backdrop-blur-sm p-3 rounded-xl shadow-sm border border-slate-200">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Valor da carta (R$)</label>
            <input
              type="number"
              value={dados.valorCarta || ''}
              onChange={(e) => handleInputChange('valorCarta', e.target.value)}
              className="w-full px-2 py-1 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white text-slate-900 font-medium"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">% de redução (%)</label>
            <input
              type="number"
              value={dados.reducaoPercentual || ''}
              onChange={(e) => handleInputChange('reducaoPercentual', e.target.value)}
              className="w-full px-2 py-1 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white text-slate-900 font-medium"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Prazo (meses)</label>
            <input
              type="number"
              value={dados.prazo || ''}
              onChange={(e) => handleInputChange('prazo', e.target.value)}
              className="w-full px-2 py-1 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white text-slate-900 font-medium"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Mês contemplação</label>
            <input
              type="number"
              value={dados.mesContemplacao || ''}
              onChange={(e) => handleInputChange('mesContemplacao', e.target.value)}
              className="w-full px-2 py-1 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white text-slate-900 font-medium"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Taxa admin. (%)</label>
            <input
              type="number"
              value={dados.taxaAdministrativa || ''}
              onChange={(e) => handleInputChange('taxaAdministrativa', e.target.value)}
              className="w-full px-2 py-1 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white text-slate-900 font-medium"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Correção (% a.a.)</label>
            <input
              type="number"
              value={dados.correcaoAnual || ''}
              onChange={(e) => handleInputChange('correcaoAnual', e.target.value)}
              className="w-full px-2 py-1 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white text-slate-900 font-medium"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">CDI (% a.a.)</label>
            <input
              type="number"
              value={dados.valorCDI || ''}
              onChange={(e) => handleInputChange('valorCDI', e.target.value)}
              className="w-full px-2 py-1 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white text-slate-900 font-medium"
            />
          </div>
        </div>

        {/* Container principal */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Gráfico (75%) */}
          <div className="lg:w-[75%] bg-white/50 backdrop-blur-sm p-4 rounded-xl shadow-xl border border-slate-200">
            <ResponsiveContainer width="100%" height={600}>
              <LineChart data={dadosGrafico} margin={{ top: 20, right: 30, left: 30, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis 
                  dataKey="mes" 
                  stroke="#94a3b8"
                  label={{ 
                    value: 'Mês', 
                    position: 'insideBottom',
                    offset: -10,
                    style: { fill: '#94a3b8' }
                  }}
                />
                <YAxis 
                  stroke="#94a3b8"
                  tickFormatter={(value) => Math.round(value).toLocaleString('pt-BR')}
                  label={{ 
                    value: 'Valor', 
                    angle: -90, 
                    position: 'insideLeft',
                    offset: -20,
                    style: { fill: '#94a3b8' }
                  }}
                />
                <Tooltip content={<CustomTooltip dados={dados} />} />
                <Legend 
                  verticalAlign="top" 
                  height={36}
                  iconType="circle"
                  formatter={(value) => <span className="text-sm text-slate-700">{value}</span>}
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
          <div className="lg:w-[25%] bg-white/50 backdrop-blur-sm p-4 rounded-xl shadow-xl border border-slate-200">
            <h3 className="text-lg font-semibold mb-4 text-slate-800">Resultados</h3>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-100">
                <p className="text-sm text-amber-700">Parcela Mensal</p>
                <p className="text-lg font-semibold text-amber-600">{formatarMoeda(resultados?.parcelaMensal || 0)}</p>
              </div>
              <div className="p-2 rounded-lg hover:bg-slate-50 transition-colors">
                <p className="text-sm text-slate-600">Total Pago</p>
                <p className="text-base font-medium text-slate-800">{formatarMoeda(resultados?.totalPago || 0)}</p>
              </div>
              <div className="p-2 rounded-lg hover:bg-slate-50 transition-colors">
                <p className="text-sm text-slate-600">Valor Final (com correção e CDI)</p>
                <p className="text-base font-medium text-slate-800">{formatarMoeda(resultados?.valorFinalComCorrecao || 0)}</p>
              </div>
              <div className="p-2 rounded-lg hover:bg-slate-50 transition-colors">
                <p className="text-sm text-slate-600">Valor Final (com investimento)</p>
                <p className="text-base font-medium text-slate-800">{formatarMoeda(resultados?.valorFinalComInvestimento || 0)}</p>
              </div>
              <div className="p-2 rounded-lg hover:bg-slate-50 transition-colors">
                <p className="text-sm text-slate-600">Diferença Final (Patrimônio)</p>
                <p className={`text-base font-medium ${(resultados?.diferencaFinalPatrimonio || 0) < 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                  {formatarMoeda(resultados?.diferencaFinalPatrimonio || 0)}
                </p>
              </div>
              <div className="p-2 rounded-lg hover:bg-slate-50 transition-colors">
                <p className="text-sm text-slate-600">Diferença Final (Investimento)</p>
                <p className={`text-base font-medium ${(resultados?.diferencaFinalInvestimento || 0) > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                  {formatarMoeda(resultados?.diferencaFinalInvestimento || 0)}
                </p>
              </div>
              <div className="p-2 rounded-lg hover:bg-slate-50 transition-colors">
                <p className="text-sm text-slate-600">Prejuízo em relação ao total investido</p>
                <p className="text-base font-medium text-red-500">{formatarMoeda(resultados?.prejuizoTotalInvestido || 0)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { SimuladorData, ResultadoCalculo, DadosGrafico } from './types';
import { calcularResultados, gerarDadosGrafico } from './utils/calculos';

const dadosIniciais: SimuladorData = {
  valorCarta: 100000,
  reducaoPercentual: 15,
  prazo: 120,
  mesContemplacao: 24,
  taxaAdministrativa: 20,
  correcaoAnual: 5,
  valorCDI: 10
};

function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white shadow-lg border border-slate-200 p-4 rounded-lg">
        <p className="text-sm font-semibold text-slate-800 mb-3">Mês {label}</p>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-3 rounded-full bg-slate-600"></div>
          <p className="text-sm text-slate-900">
            <span className="font-semibold">Parcela:</span>{' '}
            <span className="font-medium">{formatarMoeda(payload[0].payload.parcela)}</span>
          </p>
        </div>
        {payload.map((item: any, index: number) => (
          <div key={index} className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
            <p className="text-sm text-slate-900">
              <span className="font-semibold">{item.name}:</span>{' '}
              <span className="font-medium">{formatarMoeda(item.value)}</span>
            </p>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

function App() {
  const [dados, setDados] = useState<SimuladorData>(dadosIniciais);
  const [resultados, setResultados] = useState<ResultadoCalculo>(calcularResultados(dadosIniciais));
  const [dadosGrafico, setDadosGrafico] = useState<DadosGrafico[]>(gerarDadosGrafico(dadosIniciais));

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
    <div className="min-h-screen bg-slate-50 p-4">
      <h1 className="text-3xl font-bold text-center mb-2 text-slate-800">Simulador do Projeto L.A.R.</h1>
      <h2 className="text-lg text-slate-600 text-center mb-4">Calcule suas possibilidades de investimento</h2>

      {/* Grid de inputs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Valor da carta (R$)</label>
          <input
            type="number"
            value={dados.valorCarta || ''}
            onChange={(e) => handleInputChange('valorCarta', e.target.value)}
            className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white text-slate-900 font-medium"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">% de redução (%)</label>
          <input
            type="number"
            value={dados.reducaoPercentual || ''}
            onChange={(e) => handleInputChange('reducaoPercentual', e.target.value)}
            className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white text-slate-900 font-medium"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Prazo (meses)</label>
          <input
            type="number"
            value={dados.prazo || ''}
            onChange={(e) => handleInputChange('prazo', e.target.value)}
            className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white text-slate-900 font-medium"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Mês contemplação</label>
          <input
            type="number"
            value={dados.mesContemplacao || ''}
            onChange={(e) => handleInputChange('mesContemplacao', e.target.value)}
            className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white text-slate-900 font-medium"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Taxa admin. (%)</label>
          <input
            type="number"
            value={dados.taxaAdministrativa || ''}
            onChange={(e) => handleInputChange('taxaAdministrativa', e.target.value)}
            className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white text-slate-900 font-medium"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Correção (% a.a.)</label>
          <input
            type="number"
            value={dados.correcaoAnual || ''}
            onChange={(e) => handleInputChange('correcaoAnual', e.target.value)}
            className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white text-slate-900 font-medium"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">CDI (% a.a.)</label>
          <input
            type="number"
            value={dados.valorCDI || ''}
            onChange={(e) => handleInputChange('valorCDI', e.target.value)}
            className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white text-slate-900 font-medium"
          />
        </div>
      </div>

      {/* Container principal */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Gráfico (70%) */}
        <div className="lg:w-[70%] bg-white/50 backdrop-blur-sm p-4 rounded-xl shadow-xl border border-slate-200">
          <ResponsiveContainer width="100%" height={500}>
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
              <Tooltip content={<CustomTooltip />} />
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

        {/* Resultados (30%) */}
        <div className="lg:w-[30%] bg-white/50 backdrop-blur-sm p-4 rounded-xl shadow-xl border border-slate-200">
          <h3 className="text-lg font-semibold mb-4 text-slate-800">Resultados</h3>
          <div className="space-y-3">
            <div className="p-2 rounded-lg hover:bg-slate-50 transition-colors">
              <p className="text-sm text-slate-600">Total Pago</p>
              <p className="text-base font-medium text-slate-800">{formatarMoeda(resultados.totalPago)}</p>
            </div>
            <div className="p-2 rounded-lg hover:bg-slate-50 transition-colors">
              <p className="text-sm text-slate-600">Valor Final (com correção e CDI)</p>
              <p className="text-base font-medium text-slate-800">{formatarMoeda(resultados.valorFinalComCorrecao)}</p>
            </div>
            <div className="p-2 rounded-lg hover:bg-slate-50 transition-colors">
              <p className="text-sm text-slate-600">Valor Final (com investimento)</p>
              <p className="text-base font-medium text-slate-800">{formatarMoeda(resultados.valorFinalComInvestimento)}</p>
            </div>
            <div className="p-2 rounded-lg hover:bg-slate-50 transition-colors">
              <p className="text-sm text-slate-600">Diferença Final (Patrimônio)</p>
              <p className={`text-base font-medium ${resultados.diferencaFinalPatrimonio < 0 ? 'text-red-500' : 'text-slate-800'}`}>
                {formatarMoeda(resultados.diferencaFinalPatrimonio)}
              </p>
            </div>
            <div className="p-2 rounded-lg hover:bg-slate-50 transition-colors">
              <p className="text-sm text-slate-600">Diferença Final (Investimento)</p>
              <p className={`text-base font-medium ${resultados.diferencaFinalInvestimento > 0 ? 'text-emerald-500' : 'text-slate-800'}`}>
                {formatarMoeda(resultados.diferencaFinalInvestimento)}
              </p>
            </div>
            <div className="p-2 rounded-lg hover:bg-slate-50 transition-colors">
              <p className="text-sm text-slate-600">Prejuízo em relação ao total investido</p>
              <p className="text-base font-medium text-slate-800">{formatarMoeda(resultados.prejuizoTotalInvestido)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

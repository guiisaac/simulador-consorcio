export interface SimuladorData {
  valorCarta: number;
  reducaoPercentual: number;
  prazo: number;
  mesContemplacao: number;
  taxaAdministrativa: number;
  correcaoAnual: number;
  valorCDI: number;
}

export interface ResultadoCalculo {
  parcelaMensal: number;
  totalPago: number;
  creditoDisponivel: number;
  valorFinalComCorrecao: number;
  valorFinalComInvestimento: number;
  diferencaFinalPatrimonio: number;
  diferencaFinalInvestimento: number;
  prejuizoTotalInvestido: number;
}

export interface DadosGrafico {
  mes: number;
  parcela: number;
  totalPago: number;
  patrimonio: number;
  investimento: number;
} 
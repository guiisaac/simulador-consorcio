import { SimuladorData, ResultadoCalculo, DadosGrafico } from '../types';

function calcularParcelaMensal(saldoDevedor: number, prazoRestante: number): number {
  return saldoDevedor / prazoRestante;
}

export function calcularResultados(dados: SimuladorData): ResultadoCalculo {
  const taxaAdmTotal = dados.valorCarta * (dados.taxaAdministrativa / 100);
  const saldoDevedorInicial = dados.valorCarta + taxaAdmTotal;
  const correcaoMensal = Math.pow(1 + dados.correcaoAnual / 100, 1/12) - 1;
  const cdiMensal = Math.pow(1 + dados.valorCDI / 100, 1/12) - 1;

  // Valores iniciais
  let saldoDevedor = saldoDevedorInicial;
  let parcelaMensal = calcularParcelaMensal(saldoDevedorInicial, dados.prazo);
  let valorPatrimonio = dados.valorCarta;
  let valorInvestimentoParcelas = 0;
  let totalPago = 0;

  // Cálculo mês a mês
  for (let mes = 1; mes <= dados.prazo; mes++) {
    // Atualização anual do saldo devedor (sempre, exceto no primeiro mês)
    if (mes % 12 === 1 && mes > 1) {
      saldoDevedor = saldoDevedor * (1 + dados.correcaoAnual / 100);
      parcelaMensal = calcularParcelaMensal(saldoDevedor, dados.prazo - mes + 1);
    }

    // No mês da contemplação
    if (mes === dados.mesContemplacao) {
      // Aplica a última correção anual se necessário
      if (mes % 12 !== 1) {
        const mesesDesdeUltimaCorrecao = (mes - 1) % 12;
        if (mesesDesdeUltimaCorrecao > 0) {
          saldoDevedor = saldoDevedor * Math.pow(1 + correcaoMensal, mesesDesdeUltimaCorrecao);
        }
      }
      // Recalcula a parcela com o saldo devedor atual
      parcelaMensal = calcularParcelaMensal(saldoDevedor, dados.prazo - mes + 1);
    }

    // Calcula a parcela atual (com ou sem redução)
    const parcelaAtual = mes < dados.mesContemplacao ? 
      parcelaMensal * (1 - dados.reducaoPercentual / 100) : 
      parcelaMensal;

    // Atualização do patrimônio
    if (mes <= dados.mesContemplacao) {
      // Até a contemplação: correção anual
      const anosCompletos = Math.floor((mes - 1) / 12);
      valorPatrimonio = dados.valorCarta * Math.pow(1 + dados.correcaoAnual / 100, anosCompletos);
    } else {
      // Após contemplação: continua rendendo CDI a partir do valor na contemplação
      const anosCompletosAteContemplacao = Math.floor((dados.mesContemplacao - 1) / 12);
      const valorNaContemplacao = dados.valorCarta * Math.pow(1 + dados.correcaoAnual / 100, anosCompletosAteContemplacao);
      valorPatrimonio = valorNaContemplacao * Math.pow(1 + cdiMensal, mes - dados.mesContemplacao);
    }

    // Atualização do valor investido (parcelas)
    valorInvestimentoParcelas = valorInvestimentoParcelas * (1 + cdiMensal);
    valorInvestimentoParcelas += parcelaAtual;
    
    // Atualização do total pago
    totalPago += parcelaAtual;

    // Atualização do saldo devedor
    saldoDevedor -= parcelaAtual;
  }

  // Cálculos finais
  const diferencaFinalPatrimonio = valorPatrimonio - totalPago;
  const diferencaFinalInvestimento = valorInvestimentoParcelas - totalPago;
  const prejuizoTotalInvestido = diferencaFinalPatrimonio + diferencaFinalInvestimento;

  return {
    parcelaMensal,
    totalPago,
    creditoDisponivel: dados.valorCarta * (dados.reducaoPercentual / 100),
    valorFinalComCorrecao: valorPatrimonio,
    valorFinalComInvestimento: valorInvestimentoParcelas,
    diferencaFinalPatrimonio,
    diferencaFinalInvestimento,
    prejuizoTotalInvestido
  };
}

export function gerarDadosGrafico(dados: SimuladorData): DadosGrafico[] {
  const dadosGrafico: DadosGrafico[] = [];
  const taxaAdmTotal = dados.valorCarta * (dados.taxaAdministrativa / 100);
  const saldoDevedorInicial = dados.valorCarta + taxaAdmTotal;
  const correcaoMensal = Math.pow(1 + dados.correcaoAnual / 100, 1/12) - 1;
  const cdiMensal = Math.pow(1 + dados.valorCDI / 100, 1/12) - 1;
  
  let saldoDevedor = saldoDevedorInicial;
  let parcelaMensal = calcularParcelaMensal(saldoDevedorInicial, dados.prazo);
  let valorPatrimonio = dados.valorCarta;
  let valorInvestimentoParcelas = 0;
  let totalPago = 0;

  for (let mes = 1; mes <= dados.prazo; mes++) {
    // Atualização anual do saldo devedor (sempre, exceto no primeiro mês)
    if (mes % 12 === 1 && mes > 1) {
      saldoDevedor = saldoDevedor * (1 + dados.correcaoAnual / 100);
      parcelaMensal = calcularParcelaMensal(saldoDevedor, dados.prazo - mes + 1);
    }

    // No mês da contemplação
    if (mes === dados.mesContemplacao) {
      // Aplica a última correção anual se necessário
      if (mes % 12 !== 1) {
        const mesesDesdeUltimaCorrecao = (mes - 1) % 12;
        if (mesesDesdeUltimaCorrecao > 0) {
          saldoDevedor = saldoDevedor * Math.pow(1 + correcaoMensal, mesesDesdeUltimaCorrecao);
        }
      }
      // Recalcula a parcela com o saldo devedor atual
      parcelaMensal = calcularParcelaMensal(saldoDevedor, dados.prazo - mes + 1);
    }

    // Calcula a parcela atual (com ou sem redução)
    const parcelaAtual = mes < dados.mesContemplacao ? 
      parcelaMensal * (1 - dados.reducaoPercentual / 100) : 
      parcelaMensal;

    // Atualização do patrimônio
    if (mes <= dados.mesContemplacao) {
      // Até a contemplação: correção anual
      const anosCompletos = Math.floor((mes - 1) / 12);
      valorPatrimonio = dados.valorCarta * Math.pow(1 + dados.correcaoAnual / 100, anosCompletos);
    } else {
      // Após contemplação: continua rendendo CDI a partir do valor na contemplação
      const anosCompletosAteContemplacao = Math.floor((dados.mesContemplacao - 1) / 12);
      const valorNaContemplacao = dados.valorCarta * Math.pow(1 + dados.correcaoAnual / 100, anosCompletosAteContemplacao);
      valorPatrimonio = valorNaContemplacao * Math.pow(1 + cdiMensal, mes - dados.mesContemplacao);
    }

    // Atualização do valor investido (parcelas)
    valorInvestimentoParcelas = valorInvestimentoParcelas * (1 + cdiMensal);
    valorInvestimentoParcelas += parcelaAtual;
    
    // Atualização do total pago
    totalPago += parcelaAtual;

    // Atualização do saldo devedor
    saldoDevedor -= parcelaAtual;

    dadosGrafico.push({
      mes,
      parcela: parcelaAtual,
      totalPago,
      patrimonio: valorPatrimonio,
      investimento: valorInvestimentoParcelas
    });
  }

  return dadosGrafico;
} 
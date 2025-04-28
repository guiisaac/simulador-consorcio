# Simulador do Projeto L.A.R.

Simulador financeiro para análise de investimento em consórcios, comparando o rendimento do consórcio com investimentos diretos em CDI.

## 🚀 Funcionalidades

- Simulação de consórcio com parâmetros personalizáveis:
  - Valor da carta
  - Percentual de redução inicial
  - Prazo total
  - Mês de contemplação
  - Taxa administrativa
  - Correção anual
  - Taxa CDI para comparação

- Visualização gráfica interativa:
  - Total pago ao longo do tempo
  - Evolução do patrimônio no consórcio
  - Comparativo com investimento direto em CDI
  - Detalhes por mês incluindo valor da parcela

## 💻 Tecnologias

- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Chart.js

## 🛠️ Instalação

1. Clone o repositório:
```bash
git clone [url-do-repositorio]
```

2. Instale as dependências:
```bash
npm install
```

3. Execute o projeto:
```bash
npm run dev
```

O projeto estará disponível em `http://localhost:3000`

## 📊 Estrutura do Projeto

```
app/
├── components/
│   ├── SimuladorForm.tsx    # Formulário de entrada
│   └── ResultadosSimulacao.tsx  # Gráfico e cálculos
├── page.tsx                 # Página principal
├── layout.tsx              # Layout da aplicação
└── globals.css            # Estilos globais
```

## 🧮 Cálculos Realizados

- **Parcela Mensal**: Calculada com base no valor da carta + taxa administrativa, com redução inicial opcional
- **Correção das Parcelas**: Aplicada anualmente conforme taxa informada
- **Patrimônio do Consórcio**: Valor da carta corrigido após a contemplação
- **Simulação de Investimento**: Rendimento mensal no CDI das parcelas que seriam pagas

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

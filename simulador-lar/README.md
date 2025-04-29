# Simulador do Projeto L.A.R.

Simulador financeiro para análise de investimentos em consórcio vs. investimento direto.

## 🚀 Tecnologias

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Recharts
- PNPM

## 📋 Pré-requisitos

- Node.js >= 18
- PNPM

## 🔧 Instalação

```bash
# Clone o repositório
git clone [seu-repositorio]
cd simulador-lar

# Instale as dependências
pnpm install

# Inicie o servidor de desenvolvimento
pnpm dev
```

## 🏗️ Build

```bash
# Gera build de produção
pnpm build

# Visualiza build
pnpm preview
```

## 🧪 Testes e Qualidade

```bash
# Executa verificação de tipos
pnpm typecheck

# Executa linter
pnpm lint

# Corrige problemas de linter
pnpm lint:fix
```

## 🚀 Deploy na Vercel

1. Fork este repositório no GitHub
2. Crie uma conta na [Vercel](https://vercel.com)
3. Importe o projeto do GitHub
4. Configure as seguintes variáveis de ambiente (se necessário):
   - `NODE_VERSION=18`
5. Deploy!

## 🔒 Segurança

- Headers de segurança configurados
- Strict TypeScript
- Sem logs em produção
- Sem acesso a APIs sensíveis do navegador

## 📦 Estrutura do Projeto

```
simulador-lar/
├── src/
│   ├── assets/      # Recursos estáticos
│   ├── utils/       # Utilitários e cálculos
│   ├── types.ts     # Definições de tipos
│   ├── App.tsx      # Componente principal
│   └── main.tsx     # Ponto de entrada
├── public/          # Arquivos públicos
└── ...             # Arquivos de configuração
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie sua Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a Branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

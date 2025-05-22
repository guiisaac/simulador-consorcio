# Simulador de consórcio CIC-ONE

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
- PNPM >= 8.15.1

## 🔧 Instalação Local

```bash
# Clone o repositório
git clone [seu-repositorio]
cd simulador-lar

# Instale as dependências
pnpm install

# Inicie o servidor de desenvolvimento
pnpm dev
```

## 🏗️ Build e Deploy

### Build Local
```bash
# Gera build de produção
pnpm build

# Visualiza build localmente
pnpm preview
```

### Deploy na Vercel

1. Certifique-se de ter uma conta na [Vercel](https://vercel.com)
2. Instale a CLI da Vercel (opcional):
   ```bash
   pnpm install -g vercel
   ```

3. Deploy via CLI:
   ```bash
   vercel
   ```

4. Ou conecte seu repositório GitHub à Vercel:
   - Acesse [vercel.com/new](https://vercel.com/new)
   - Importe o repositório
   - As configurações serão automaticamente detectadas do `vercel.json`

### Configurações do Deploy

O projeto já está configurado com:
- Build Command: `pnpm run build`
- Output Directory: `dist`
- Node Version: >= 18
- Framework: Vite

## 🧪 Qualidade de Código

```bash
# Executa verificação de tipos
pnpm typecheck

# Executa linter
pnpm lint

# Corrige problemas de linter
pnpm lint:fix
```

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
├── vercel.json      # Configuração do deploy
└── ...             # Arquivos de configuração
```

## 🔒 Segurança e Performance

- Headers de segurança configurados
- Strict TypeScript
- Otimização de assets
- Code splitting automático
- Minificação de código em produção

## 🤝 Contribuindo

1. Fork o projeto
2. Crie sua Feature Branch (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a Branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🆘 Suporte

Para reportar problemas ou sugerir melhorias, abra uma issue no GitHub.

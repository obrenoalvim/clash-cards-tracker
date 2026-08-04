# Clash Cards Tracker

[![CI](https://github.com/obrenoalvim/clash-cards-tracker/actions/workflows/ci.yml/badge.svg)](https://github.com/obrenoalvim/clash-cards-tracker/actions/workflows/ci.yml) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**Live:** [clash-cards-tracker.vercel.app](https://clash-cards-tracker.vercel.app/)

Aplicação web em React + TypeScript para acompanhar sua coleção de cartas do evento **Clash of Cards** (Clashiversary, Clash of Clans, agosto/2026). Busque, filtre e marque as cartas que você já tem — tudo salvo localmente no navegador, sem backend.

## Visão Geral
- Grade com as 60 cartas oficiais do evento (Elixir, Elixir Negro, Vila do Construtor e Super Tropas), com ícones reais resolvidos via API do Fandom Wiki.
- Clique em qualquer parte de uma carta para marcá-la como coletada; use +/- para registrar duplicatas.
- Progresso geral, progresso por categoria e marcos de recompensa (10/20/30/40/50/60 cartas), espelhando os números oficiais do evento.
- Compartilhe sua coleção via link (estado codificado na URL, sem servidor).

## Funcionalidades
- Busca por nome e filtros por status (todas / coletadas / faltando) e categoria.
- Persistência local via `localStorage` — sua coleção continua salva ao fechar o navegador.
- Link de compartilhamento somente-leitura (`#c=...`) para mostrar sua coleção a outra pessoa.
- Reset de coleção com confirmação.

## Tecnologias
- React 18 + TypeScript
- Vite 5
- Tailwind CSS 3
- lucide-react (ícones)
- Dados de cartas resolvidos via [MediaWiki API](https://clashofclans.fandom.com) (`scripts/fetch-card-images.mjs`)

## Requisitos
- Node.js 18+ (recomendado para Vite 5)
- npm

## Instalação e Execução
```bash
# Instalar dependências
npm install

# Ambiente de desenvolvimento
npm run dev
# Abra http://localhost:5173

# Build de produção
npm run build

# Pré-visualização do build
npm run preview

# Lint, checagem de tipos e testes
npm run lint
npm run typecheck
npm run test
```

## Estrutura do Projeto
```
.
├─ index.html
├─ package.json
├─ scripts/
│  └─ fetch-card-images.mjs   # Resolve ícones reais de cada carta via API do Fandom
├─ src/
│  ├─ App.tsx                 # UI: header, filtros, grade de cartas, progresso
│  ├─ main.tsx                # Bootstrap da aplicação
│  ├─ index.css                # Tailwind + estilos globais
│  ├─ data/
│  │  └─ cards.ts             # As 60 cartas, metadados de categoria/raridade e recompensas
│  └─ vite-env.d.ts
├─ tailwind.config.js
├─ postcss.config.js
├─ tsconfig*.json
└─ eslint.config.js
```

## Scripts Disponíveis
- `dev`: inicia o servidor de desenvolvimento (Vite)
- `build`: gera o bundle de produção
- `preview`: sobe um servidor para pré-visualizar o build
- `lint`: executa o ESLint
- `typecheck`: roda o `tsc --noEmit`
- `test`: roda os testes (Vitest) — hoje cobre a integridade do roster de 60 cartas

## Aviso
Projeto feito por fã, sem afiliação com a Supercell. Clash of Clans é marca registrada da Supercell. Ícones das cartas vêm do [Clash of Clans Wiki](https://clashofclans.fandom.com/wiki/Clash_of_Cards) (Fandom).

## Licença
[MIT](LICENSE)

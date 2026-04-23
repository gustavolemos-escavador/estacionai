# EstacionAI

Estacionamento inteligente com IA — projeto de hackathon construído em Next.js 15, com design thinking, scroll-driven motion e pronto para deploy na Vercel.

## Features

- **Landing animada** com hero scroll-driven (parallax, blur, scale) e storytelling por seções usando `useScroll` + `useTransform` do Framer Motion.
- **Dashboard em tempo real** mostrando vagas disponíveis por setor, filtros por status, mapa animado e KPIs.
- **Caixa de entrada** com notificações filtráveis, marcar como lida, remover e alertas por tipo.
- **Relatórios históricos** com gráficos de área, barras, linha e donut (Recharts), além de tabela por setor.
- **Design system** escuro com gradientes `brand → brand-2`, efeito aurora, grid lines, glassmorphism.
- **Responsivo** mobile-first, com menu hambúrguer, grids adaptativas e `prefers-reduced-motion`.

## Stack

- Next.js 15 (App Router) + React 19 + TypeScript
- Tailwind CSS v4
- Framer Motion
- Recharts
- Lucide React

## Rodando localmente

```bash
npm install
npm run dev
```

Abra http://localhost:3000.

## Deploy na Vercel

### Opção 1 — Via dashboard (recomendado)

1. Suba o projeto para o GitHub/GitLab/Bitbucket.
2. Acesse https://vercel.com/new e importe o repositório.
3. A Vercel detecta Next.js automaticamente. Clique em **Deploy**. Pronto.

### Opção 2 — Via CLI

```bash
npm install -g vercel
vercel
# para produção:
vercel --prod
```

Nenhuma variável de ambiente é necessária — o app usa dados mockados em `src/lib/mockData.ts`.

## Estrutura

```
src/
  app/
    layout.tsx          # layout global + navbar/footer
    page.tsx            # landing com scroll storytelling
    dashboard/page.tsx  # painel com grid de vagas ao vivo
    inbox/page.tsx      # caixa de entrada
    reports/page.tsx    # relatórios históricos
    globals.css         # design tokens e utilities
  components/
    Navbar.tsx          # nav responsiva com indicador animado
    Footer.tsx
    Hero.tsx            # hero scroll-driven
    ScrollStory.tsx     # seção com progresso de scroll + parallax
    Reveal.tsx          # wrapper whileInView
    PageHeader.tsx
    KpiCards.tsx
    ParkingGrid.tsx     # mapa de vagas com atualização automática
    OccupancyChart.tsx
    InboxList.tsx       # lista filtrável com motion
    ReportsCharts.tsx   # gráficos recharts estilizados
  lib/
    types.ts
    mockData.ts         # dados de demonstração
```

## Customização rápida

- **Cores**: edite os tokens `--color-*` em `src/app/globals.css`.
- **Dados**: substitua as funções em `src/lib/mockData.ts` por fetch de uma API real.
- **Navegação**: atualize o array `NAV` em `src/components/Navbar.tsx`.

## Licença

Feito para o Hackathon Escavador.

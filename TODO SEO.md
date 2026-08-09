# TODO SEO

> Atualizado em: 2026-08-07

## Feito
- ~~URL canônica, `og:url` e sitemap.xml~~ — aplicado em `https://clash-cards-tracker.vercel.app/` (`index.html`, `public/sitemap.xml`, `public/robots.txt`).
- ~~`<lastmod>` no sitemap.xml~~ — adicionado (2026-08-07). Atualize a data toda vez que o conteúdo da página mudar de verdade.
- ~~Atualização do `llms.txt`~~ — reescrito pra descrever multi-conta, sugestões de troca por categoria, custo em gemas, Trader Shop e o apelido "House of Cards".
- ~~Banner de Open Graph (1200×630)~~ — `public/og-banner.svg` desenhado no estilo do app e convertido pra `public/og-banner.png` via `resvg-cli` (sem virar dependência do projeto). `index.html` aponta pra ele, com `og:image:width/height/type` e `twitter:card` trocado pra `summary_large_image`.
- ~~Meta description / OG / Twitter Card / JSON-LD~~ — reescritos pra citar multi-conta, troca grátis vs. gema, calculadora de gema e o apelido "House of Cards". `featureList` adicionado no JSON-LD `WebApplication`.
- ~~FAQ visível + JSON-LD FAQPage~~ — seção nova em `src/App.tsx` (EN/PT via `i18n.ts`) com as 5 perguntas já levantadas. JSON-LD correspondente adicionado em `index.html`, texto em inglês pra bater com o HTML padrão da página. Os dois blocos JSON-LD (`WebApplication` e `FAQPage`) passaram em validação de sintaxe (`JSON.parse`).

## Pendente

### Verificar rich results depois do deploy
- **Fonte:** [Google Rich Results Test](https://search.google.com/test/rich-results)
- **O que fazer:** Rodar a URL publicada no Rich Results Test do Google e no Sharing Debugger do Facebook. Confirmar que os dois JSON-LD (`WebApplication` e `FAQPage`) e as tags OG aparecem certo.
- **Onde:** Nenhum arquivo. É validação externa e não dá pra automatizar sem API paga do Google — precisa abrir a ferramenta no navegador depois do deploy.
- **Por quê:** JSON-LD e OG foram escritos e validados só como sintaxe, nunca testados contra um crawler de verdade.
- **Risco:** Nenhum, é só checagem.
- **Esforço:** Baixo.

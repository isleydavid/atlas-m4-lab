---
name: atlas-doc-to-manifest
description: >
  Converte um documento/briefing de um módulo do Atlas em um manifesto `module.md`
  (com frontmatter YAML) que o M4 Lab lê para gerar os gráficos da página. Use quando
  o usuário quiser transformar uma documentação/prosa em componentes de visualização
  para um módulo/página do dashboard, ou mencionar "gerar manifesto", "ingerir doc",
  "doc para gráficos", "module.md", "criar página do módulo X a partir deste documento".
---

# Atlas — Documentação → Manifesto (module.md)

Transforma um documento em prosa (briefing, spec, anotações) no **manifesto** estruturado
que o app M4 Lab consome para renderizar os gráficos de **uma** página/módulo.

Referência completa do formato e da arquitetura: `PLANO_INGESTAO_DOC.md` (raiz do projeto).

## Entrada e saída

- **Entrada:** um documento em prosa sobre um módulo (ex.: briefing do "Perfil do Apostador").
- **Saída:** um arquivo `src/modules/<id>/module.md` com **frontmatter YAML** + (opcional) prosa abaixo.

> Regra de ouro: **um documento = um módulo = uma página.** O destino é definido por
> `modulo.id` + a pasta `src/modules/<id>/`. Não espalhe gráficos por várias páginas.

## Schema do manifesto (frontmatter YAML)

```yaml
modulo:
  id: <slug-kebab>            # ex.: perfil-apostador
  nome: "<Nome legível>"
  icone: <opcional>
dados_disponiveis: [<campo1>, <campo2>, ...]   # o que a página tem/usa
componentes:
  - id: <slug>
    titulo: "<Título do card>"
    subtitulo: "<curto, opcional>"
    status: existente | novo
    tamanho: { w: <1-12>, h: <2-4> }
    visivel: true
    visualizacoes:            # 1+ opções (trocáveis pelo ⋮)
      - tipo: <tipo da tabela abaixo>
        rotulo: "<nome da opção no menu ⋮>"
        info: "<como o usuário lê este gráfico / que decisão dispara>"
        dados: <conforme o tipo>
```

## Tipos de gráfico e formato de `dados`

| tipo | dados |
|---|---|
| `donut` / `kpi` | `{ valor, max, rotulo, delta? }` |
| `barras` | `{ linhas: [{x, y}] }` |
| `barras_empilhadas` | `{ series: [{chave, nome}], linhas: [{x, <chave>: n, ...}] }` |
| `linha` / `area` | `{ linhas: [{x, y}] }` (ou multi-série) |
| `area_faixas` | `{ linhas: [{x, y}], faixas: [{de, ate, cor}] }` |
| `radar` | `{ eixos: [{eixo, v, v2?}] }` |
| `dispersao` | `{ pontos: [{x, y}], limite? }` |
| `histograma` | `{ barras: [{faixa, n}], limite? }` |
| `heatmap` | `{ matriz: [[..]] }` |
| `semaforo` | `{ sinais: [{nome, nivel: g|a|r}] }` |
| `timeline` | `{ itens: [{titulo, sub, cor: g|a|r|m}] }` |
| `grafo` | `{ nos: [{id, x, y, principal?}], arestas: [[a, b]] }` |
| `tabela` | `{ colunas: [..], linhas: [[..]] }` |
| `chips` | `{ itens: [{k, v, tendencia: up|down|flat|null}] }` |
| `ficha` | `{ campos: [{k, v}], badges: [{texto, cor}] }` |

Se um dado pedir um tipo fora desta lista, use o mais próximo e anote em `info`; não invente tipos novos sem avisar.

## Processo

1. **Ler o documento** e identificar: o módulo (nome + `id` em kebab-case) e os dados disponíveis.
2. **Mapear cada dado/insight em componente(s).** Para cada um, escolher **1–2 visualizações**
   compatíveis (ex.: score → `donut` + `area_faixas`; fluxo financeiro → `barras_empilhadas` + `linha`).
3. **Classificar `status`:**
   - `existente` = o dado/visual já existe no produto hoje (no doc costuma estar descrito como já implementado).
   - `novo` = proposta nova que o doc sugere ou que preenche uma lacuna.
   - Na dúvida, marque `novo` e explique no `info`.
4. **Definir `tamanho`** coerente: KPIs/gauges pequenos (w 3–4, h 2), gráficos de série médios
   (w 5–7, h 3), tabelas/listas largas (w 8, h 3). Total deve compor bem em 12 colunas.
5. **Preencher `dados`** com exemplos **coerentes e realistas** (mock), seguindo o formato do tipo.
6. **Escrever `info`** em 1–2 frases: como o usuário lê e que decisão dispara (tom do produto).
7. **Gerar o arquivo** em `src/modules/<id>/module.md` e **validar o YAML** (indentação, aspas, listas).

## Regras de qualidade

- Respeitar o **design system**: não definir cores/estilos no manifesto — o app aplica o tema.
  Use só os níveis semânticos previstos (`g|a|r` no semáforo/timeline, etc.).
- `id` único por componente; `modulo.id` em kebab-case e igual ao nome da pasta.
- Mínimo de 1 visualização por componente; oferecer a 2ª quando agregar leitura diferente.
- Prosa (abaixo do frontmatter) é opcional e **não** é lida pelo app — serve para humanos.
- Não inventar dados sensíveis reais; usar exemplos mascarados/ilustrativos.

## Checklist final

- [ ] `modulo.id` em kebab-case, igual à pasta `src/modules/<id>/`.
- [ ] Todo componente tem `status`, `tamanho`, ao menos 1 `visualizacao` com `tipo`, `info` e `dados`.
- [ ] Tipos usados existem na tabela; `dados` no formato certo.
- [ ] YAML válido (sem tabs; strings com acento entre aspas quando necessário).
- [ ] Composição cabe bem em 12 colunas.

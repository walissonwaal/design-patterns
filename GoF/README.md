# Padrões de Projeto GoF em TypeScript

Guia prático dos **23 padrões de projeto** do livro *Design Patterns: Elements of Reusable Object-Oriented Software* (Gamma, Helm, Johnson e Vlissides — a "Gang of Four"), explicados em português com **diagramas em PNG** e **exemplos executáveis em TypeScript**.

## Como estudar cada padrão

Cada padrão tem sua própria pasta com a mesma estrutura:

```
nome-do-padrao/
├── README.md        ← explicação: intenção, problema, solução, estrutura, quando usar, prós e contras
├── exemplo.ts       ← código TypeScript comentado e executável
└── diagramas/
    ├── classes.png      ← diagrama de classes (a estrutura)
    ├── sequencia.png    ← diagrama de sequência (o fluxo em execução)
    └── *.mmd            ← fonte Mermaid dos diagramas (editável)
```

Sugestão de roteiro: leia o `README.md` → olhe os diagramas → leia o `exemplo.ts` → execute-o → altere o código (adicione uma classe nova, troque a ordem…) e veja o que acontece.

## Índice

### [01 — Padrões de Criação](01-criacionais/README.md)
*Como os objetos são criados.*

| Padrão | Em uma frase | Exemplo |
|---|---|---|
| [Singleton](01-criacionais/singleton/README.md) | Garante uma única instância com acesso global | Conexão com banco |
| [Factory Method](01-criacionais/factory-method/README.md) | Subclasses decidem qual objeto criar | Logística (caminhão/navio) |
| [Abstract Factory](01-criacionais/abstract-factory/README.md) | Cria famílias de objetos relacionados | Widgets Windows/macOS |
| [Builder](01-criacionais/builder/README.md) | Constrói objetos complexos passo a passo | Construtor de consultas SQL/Mongo |
| [Prototype](01-criacionais/prototype/README.md) | Cria objetos clonando existentes | Formas gráficas clonáveis |

### [02 — Padrões Estruturais](02-estruturais/README.md)
*Como objetos e classes se compõem em estruturas maiores.*

| Padrão | Em uma frase | Exemplo |
|---|---|---|
| [Adapter](02-estruturais/adapter/README.md) | Converte uma interface em outra | Gateways de pagamento |
| [Bridge](02-estruturais/bridge/README.md) | Separa abstração e implementação | Controles remotos × dispositivos |
| [Composite](02-estruturais/composite/README.md) | Trata objetos e grupos de forma uniforme | Arquivos e pastas |
| [Decorator](02-estruturais/decorator/README.md) | Adiciona comportamento dinamicamente | Compressão e criptografia |
| [Facade](02-estruturais/facade/README.md) | Interface simples para um subsistema | Finalizar pedido |
| [Flyweight](02-estruturais/flyweight/README.md) | Compartilha estado para economizar memória | Floresta com 100 mil árvores |
| [Proxy](02-estruturais/proxy/README.md) | Controla o acesso a outro objeto | Cache, proteção, lazy |

### [03 — Padrões Comportamentais](03-comportamentais/README.md)
*Como objetos se comunicam e dividem responsabilidades.*

| Padrão | Em uma frase | Exemplo |
|---|---|---|
| [Chain of Responsibility](03-comportamentais/chain-of-responsibility/README.md) | Passa a requisição por uma corrente de handlers | Middlewares de validação |
| [Command](03-comportamentais/command/README.md) | Transforma uma ação em objeto | Editor com desfazer/refazer |
| [Interpreter](03-comportamentais/interpreter/README.md) | Interpreta sentenças de uma linguagem | Calculadora com variáveis |
| [Iterator](03-comportamentais/iterator/README.md) | Percorre uma coleção sem expor sua estrutura | Playlist e árvore binária |
| [Mediator](03-comportamentais/mediator/README.md) | Centraliza a comunicação entre objetos | Sala de chat |
| [Memento](03-comportamentais/memento/README.md) | Salva e restaura o estado de um objeto | Snapshots de um editor |
| [Observer](03-comportamentais/observer/README.md) | Notifica dependentes sobre mudanças | Cotação de ações |
| [State](03-comportamentais/state/README.md) | Comportamento muda com o estado interno | Fluxo de publicação |
| [Strategy](03-comportamentais/strategy/README.md) | Algoritmos intercambiáveis | Cálculo de frete |
| [Template Method](03-comportamentais/template-method/README.md) | Esqueleto fixo, passos variáveis | Importadores CSV/JSON |
| [Visitor](03-comportamentais/visitor/README.md) | Novas operações sem alterar as classes | Operações sobre formas |

## Ordem de estudo recomendada

Comece pelos padrões mais comuns e de ideia mais direta e avance para os mais abstratos:

1. **Strategy**, **Observer**, **Factory Method**, **Decorator**, **Adapter** — aparecem em quase todo projeto.
2. **Singleton**, **Builder**, **Facade**, **Command**, **Template Method**, **Proxy**, **Composite**, **State**.
3. **Abstract Factory**, **Iterator**, **Chain of Responsibility**, **Mediator**, **Prototype**, **Memento**, **Bridge**.
4. **Visitor**, **Flyweight**, **Interpreter** — mais especializados.

## Como executar os exemplos

Requisitos: **Node.js 20+** (testado com 22).

```bash
npm install                                            # instala TypeScript e tsx

npx tsx 01-criacionais/singleton/exemplo.ts            # roda um exemplo
npm run executar:todos                                 # roda todos e reporta falhas
npm run typecheck                                      # verifica os tipos (strict) de todos
```

Todos os exemplos são **autocontidos** (um arquivo, sem dependências externas) e compilam com `strict`, `noImplicitOverride` e `noUncheckedIndexedAccess`.

## Como regenerar os diagramas

Os PNGs são gerados a partir dos arquivos `.mmd` ([Mermaid](https://mermaid.js.org/)). Para alterar um diagrama, edite o `.mmd` e rode:

```bash
npm run diagramas
```

O script usa `@mermaid-js/mermaid-cli` via `npx` (baixa na primeira vez e requer um Chrome/Chromium; se já tiver um instalado, informe `CHROME_PATH=/caminho/do/chrome npm run diagramas`).

## Convenções adotadas

- **Nomes de classes e interfaces em inglês** (`Strategy`, `Observer`, `Handler`…), como na literatura de padrões — assim você reconhece os termos em qualquer livro, artigo ou código. Comentários e saídas no console em português.
- Cada exemplo foca na **essência do padrão**, sem frameworks. Quando a linguagem já oferece o padrão (Iterator, Observer, Proxy), isso é indicado no README.
- Cada README termina com a **relação com outros padrões**, para você montar o mapa mental completo.

## Uma nota sobre uso consciente

Padrões não são metas. São **soluções nomeadas para problemas recorrentes**: se o problema não existe no seu código, o padrão só adiciona complexidade. Em TypeScript, muitos deles têm alternativas mais leves (funções de primeira classe, uniões discriminadas, módulos como singletons, `Symbol.iterator`, `EventEmitter`). Aprenda os padrões para **reconhecer** o problema e **conversar** sobre ele com a equipe — e então escolha a solução mais simples que resolve.

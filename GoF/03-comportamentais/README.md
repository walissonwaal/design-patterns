# Padrões Comportamentais

Os padrões comportamentais tratam de **algoritmos e da atribuição de responsabilidades entre objetos**: como eles **se comunicam** e **dividem o trabalho**, mantendo o acoplamento baixo.

## Os 11 padrões

| Padrão | Problema que resolve | Ideia central |
|---|---|---|
| [**Chain of Responsibility**](chain-of-responsibility/README.md) | Vários objetos podem tratar uma requisição; quem trata é decidido em runtime | Corrente de handlers, cada um trata ou repassa |
| [**Command**](command/README.md) | Preciso enfileirar, registrar ou **desfazer** operações | Ação encapsulada como objeto |
| [**Interpreter**](interpreter/README.md) | Preciso avaliar sentenças de uma **linguagem simples** | Uma classe por regra da gramática (AST) |
| [**Iterator**](iterator/README.md) | Percorrer uma coleção **sem expor** sua estrutura | Objeto de percurso com `next()` |
| [**Mediator**](mediator/README.md) | Objetos se referenciam demais entre si | Um intermediário centraliza a comunicação |
| [**Memento**](memento/README.md) | Salvar e restaurar o estado **sem quebrar o encapsulamento** | Snapshot opaco criado pelo próprio objeto |
| [**Observer**](observer/README.md) | Notificar **N dependentes** quando algo muda | Assinatura (`subscribe`) e notificação |
| [**State**](state/README.md) | O comportamento muda conforme o **estado**, e há `if`s demais | Uma classe por estado |
| [**Strategy**](strategy/README.md) | Há **várias formas** de fazer algo e quero trocá-las | Algoritmos intercambiáveis via composição |
| [**Template Method**](template-method/README.md) | Algoritmos quase iguais, com poucos passos diferentes | Esqueleto na superclasse, passos nas subclasses |
| [**Visitor**](visitor/README.md) | Adicionar **operações** a uma hierarquia sem alterá-la | Double dispatch: `accept` + `visit*` |

## Como escolher

```
Quero vários objetos tentando tratar uma requisição, em ordem?  → Chain of Responsibility
Quero transformar uma ação em objeto (undo, fila, log)?         → Command
Preciso avaliar expressões de uma mini-linguagem?               → Interpreter
Preciso percorrer uma coleção de formas variadas?               → Iterator
Muitos objetos conversando entre si, bagunça?                   → Mediator
Preciso de snapshots/restauração de estado?                     → Memento
Preciso avisar vários objetos sobre mudanças?                   → Observer
O comportamento muda conforme o estado interno?                 → State
Preciso trocar o algoritmo em tempo de execução?               → Strategy
O fluxo é fixo, só alguns passos variam por tipo?              → Template Method
Preciso de novas operações em estruturas estáveis?             → Visitor
```

## Quatro formas de ligar remetentes e receptores

Chain of Responsibility, Command, Mediator e Observer resolvem o mesmo desafio básico — **desacoplar quem envia de quem recebe** — por caminhos diferentes:

| Padrão | Como liga remetente e receptor | Característica |
|---|---|---|
| **Chain of Responsibility** | Passa a requisição por uma **corrente** de receptores em potencial | Um (ou alguns) dos elos trata; o remetente não sabe qual |
| **Command** | Cria uma **conexão unidirecional** remetente → receptor, via objeto | A requisição vira objeto: pode ser guardada, adiada, desfeita |
| **Mediator** | Elimina conexões diretas; todos falam via **mediador** | Comunicação centralizada e bidirecional |
| **Observer** | Receptores **se inscrevem** e cancelam dinamicamente | Um-para-muitos; o publicador não conhece os assinantes |

## Strategy, State e Template Method — variações de comportamento

| | Mecanismo | Quem decide a variação | Quando |
|---|---|---|---|
| **Strategy** | Composição | O **cliente** escolhe a estratégia | Runtime |
| **State** | Composição | O **próprio objeto**/estados disparam transições | Runtime |
| **Template Method** | Herança | A **subclasse** escolhida | Compile time (estático) |

## Padrões que trabalham bem juntos

- **Command + Memento** → desfazer/refazer.
- **Composite + Iterator** → percorrer árvores.
- **Composite + Visitor** → operar sobre toda a árvore.
- **Interpreter + Visitor** → várias operações sobre a mesma AST.
- **Observer + Mediator** → o mediador observa os componentes.

## Ordem de leitura sugerida

1. [Strategy](strategy/README.md) → [State](state/README.md) → [Template Method](template-method/README.md) — variação de comportamento.
2. [Observer](observer/README.md) → [Mediator](mediator/README.md) → [Command](command/README.md) → [Chain of Responsibility](chain-of-responsibility/README.md) — comunicação entre objetos.
3. [Iterator](iterator/README.md) → [Memento](memento/README.md) — acesso e estado.
4. [Visitor](visitor/README.md) → [Interpreter](interpreter/README.md) — os mais avançados.

⬅️ [Padrões Estruturais](../02-estruturais/README.md) · [Índice geral](../README.md)

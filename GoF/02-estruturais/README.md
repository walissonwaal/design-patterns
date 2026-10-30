# Padrões Estruturais

Os padrões estruturais tratam de **como classes e objetos são compostos para formar estruturas maiores**, mantendo-as flexíveis e eficientes. Eles se concentram nos **relacionamentos** entre entidades.

## Os 7 padrões

| Padrão | Problema que resolve | Ideia central |
|---|---|---|
| [**Adapter**](adapter/README.md) | Duas interfaces **incompatíveis** precisam trabalhar juntas | Um *wrapper* que traduz uma interface na outra |
| [**Bridge**](bridge/README.md) | Duas **dimensões de variação** geram explosão de subclasses | Separar abstração e implementação em hierarquias ligadas por composição |
| [**Composite**](composite/README.md) | Trabalhar com **árvores** tratando folhas e grupos igualmente | Interface comum + filhos que são da mesma interface |
| [**Decorator**](decorator/README.md) | Adicionar **comportamento** sem herança, em tempo de execução | Wrappers empilháveis com a mesma interface |
| [**Facade**](facade/README.md) | Um subsistema **complexo** é difícil de usar | Uma classe com interface simples que orquestra o subsistema |
| [**Flyweight**](flyweight/README.md) | **Milhões de objetos** consomem memória demais | Compartilhar o estado repetido (intrínseco) |
| [**Proxy**](proxy/README.md) | Controlar **acesso**, criação ou cache de um objeto | Substituto com a mesma interface do objeto real |

## Como escolher

```
Tenho uma interface que não combina com a que preciso?        → Adapter
Quero evitar M×N subclasses (duas dimensões variando)?        → Bridge
Os dados são uma árvore (parte-todo)?                         → Composite
Quero acrescentar funcionalidade em volta de um objeto?       → Decorator
Quero esconder a complexidade de várias classes?              → Facade
Tenho um enorme número de objetos parecidos?                  → Flyweight
Quero controlar o acesso/criação de um objeto?                → Proxy
```

## Três padrões que se parecem (todos "embrulham" um objeto)

| | Interface do wrapper | Objetivo | Quem monta |
|---|---|---|---|
| **Adapter** | **Diferente** da do objeto | Tornar compatível | Cliente/integração |
| **Decorator** | **Igual** | **Adicionar** comportamento | **Cliente**, empilhando |
| **Proxy** | **Igual** | **Controlar** acesso/ciclo de vida | Normalmente o próprio proxy gerencia o serviço |
| **Facade** | **Nova e simplificada** | Esconder complexidade de **vários** objetos | Desenvolvedor do subsistema |

## Estruturas recursivas

**Composite** e **Decorator** usam composição recursiva (objetos contendo objetos da mesma interface), mas com propósitos distintos: o Composite agrega **vários** filhos e combina resultados; o Decorator tem **um** filho e acrescenta comportamento. Por isso eles aparecem juntos com frequência.

## Ordem de leitura sugerida

1. [Adapter](adapter/README.md) e [Facade](facade/README.md) — os mais intuitivos.
2. [Decorator](decorator/README.md) e [Proxy](proxy/README.md) — wrappers com a mesma interface.
3. [Composite](composite/README.md) — estruturas em árvore.
4. [Bridge](bridge/README.md) — o mais abstrato conceitualmente.
5. [Flyweight](flyweight/README.md) — otimização de memória.

⬅️ [Padrões de Criação](../01-criacionais/README.md) · [Índice geral](../README.md) · ➡️ [Padrões Comportamentais](../03-comportamentais/README.md)

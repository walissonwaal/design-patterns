# Padrões de Criação

Os padrões de criação tratam de **como objetos são criados**. Eles abstraem o processo de instanciação, tornando o sistema independente de *como* seus objetos são criados, compostos e representados. Em vez de espalhar `new ClasseConcreta()` pelo código, você centraliza e controla a criação.

## Os 5 padrões

| Padrão | Problema que resolve | Ideia central |
|---|---|---|
| [**Singleton**](singleton/README.md) | Preciso de **uma única** instância compartilhada | Construtor privado + `getInstance()` |
| [**Factory Method**](factory-method/README.md) | Não sei de antemão **qual classe** instanciar | Método fábrica sobrescrito em subclasses |
| [**Abstract Factory**](abstract-factory/README.md) | Preciso criar **famílias** de objetos que combinem entre si | Fábrica com um método de criação por produto |
| [**Builder**](builder/README.md) | O objeto é **complexo**, com muitas configurações opcionais | Construção passo a passo, `build()` no final |
| [**Prototype**](prototype/README.md) | Criar do zero é caro, ou não quero depender da classe concreta | Objetos que sabem se **clonar** |

## Como escolher

```
Preciso de UMA instância só?                               → Singleton
Preciso criar objetos sem conhecer a classe exata?
 ├─ de UM tipo de produto, variando por subclasse          → Factory Method
 ├─ de várias FAMÍLIAS de produtos que devem combinar      → Abstract Factory
 └─ copiando um objeto já configurado                      → Prototype
O objeto tem muitos parâmetros opcionais / passos?         → Builder
```

## Comparação rápida

| | Cria | Mecanismo | Quando a decisão é tomada |
|---|---|---|---|
| Factory Method | 1 produto | Herança | Ao escolher a subclasse |
| Abstract Factory | Família de produtos | Composição (objeto fábrica) | Ao escolher a fábrica |
| Builder | 1 produto complexo | Passos encadeados | Durante a construção |
| Prototype | Cópia de um objeto | `clone()` | Ao clonar |
| Singleton | A mesma instância | Estático/módulo | Na 1ª chamada |

## Evolução típica

Muitos projetos começam com **Factory Method** (simples, via subclasses) e, conforme a necessidade de flexibilidade cresce, evoluem para **Abstract Factory**, **Prototype** ou **Builder**.

## Ordem de leitura sugerida

1. [Singleton](singleton/README.md) — o mais simples (e o mais controverso).
2. [Factory Method](factory-method/README.md) — base conceitual da criação por polimorfismo.
3. [Abstract Factory](abstract-factory/README.md) — generaliza o anterior para famílias.
4. [Builder](builder/README.md) — construção passo a passo.
5. [Prototype](prototype/README.md) — criação por clonagem.

⬅️ [Voltar ao índice geral](../README.md) · ➡️ [Padrões Estruturais](../02-estruturais/README.md)

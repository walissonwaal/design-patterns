/**
 * Interpreter — exemplo: calculadora com variáveis.
 *
 * Gramática da linguagem (notação pós-fixa / RPN):
 *
 *   expressão ::= número | variável | expressão expressão operador
 *   operador  ::= "+" | "-" | "*" | "/"
 *
 * Cada regra da gramática vira uma classe. Uma sentença é representada como uma
 * ÁRVORE de objetos Expression, e interpretá-la é chamar interpret() na raiz.
 *
 * Executar: npx tsx 03-comportamentais/interpreter/exemplo.ts
 */

// Contexto: informação global usada na interpretação (valores das variáveis).
class Context {
  private readonly variables = new Map<string, number>();

  set(name: string, value: number): this {
    this.variables.set(name, value);
    return this;
  }

  get(name: string): number {
    const value = this.variables.get(name);
    if (value === undefined) throw new Error(`variável "${name}" não definida`);
    return value;
  }
}

// Expressão abstrata
interface Expression {
  interpret(context: Context): number;
  toString(): string;
}

// ---- Expressões TERMINAIS (folhas da árvore) ----
class NumberExpression implements Expression {
  constructor(private readonly value: number) {}

  interpret(): number {
    return this.value;
  }

  toString(): string {
    return String(this.value);
  }
}

class VariableExpression implements Expression {
  constructor(private readonly name: string) {}

  interpret(context: Context): number {
    return context.get(this.name);
  }

  toString(): string {
    return this.name;
  }
}

// ---- Expressões NÃO TERMINAIS (compostas por outras expressões) ----
abstract class BinaryExpression implements Expression {
  protected abstract readonly symbol: string;

  constructor(
    protected readonly left: Expression,
    protected readonly right: Expression,
  ) {}

  abstract interpret(context: Context): number;

  toString(): string {
    return `(${this.left} ${this.symbol} ${this.right})`;
  }
}

class AddExpression extends BinaryExpression {
  protected readonly symbol = "+";
  interpret(context: Context): number {
    return this.left.interpret(context) + this.right.interpret(context);
  }
}

class SubtractExpression extends BinaryExpression {
  protected readonly symbol = "-";
  interpret(context: Context): number {
    return this.left.interpret(context) - this.right.interpret(context);
  }
}

class MultiplyExpression extends BinaryExpression {
  protected readonly symbol = "*";
  interpret(context: Context): number {
    return this.left.interpret(context) * this.right.interpret(context);
  }
}

class DivideExpression extends BinaryExpression {
  protected readonly symbol = "/";
  interpret(context: Context): number {
    const divisor = this.right.interpret(context);
    if (divisor === 0) throw new Error("divisão por zero");
    return this.left.interpret(context) / divisor;
  }
}

// ---------------------------------------------------------------------------
// Parser: transforma o texto em árvore de expressões. (O padrão em si não
// define o parser — ele só descreve a representação e a interpretação.)
// ---------------------------------------------------------------------------
const OPERATORS: Record<string, new (l: Expression, r: Expression) => Expression> = {
  "+": AddExpression,
  "-": SubtractExpression,
  "*": MultiplyExpression,
  "/": DivideExpression,
};

function parse(source: string): Expression {
  const stack: Expression[] = [];

  for (const token of source.trim().split(/\s+/)) {
    const Operator = OPERATORS[token];
    if (Operator) {
      const right = stack.pop();
      const left = stack.pop();
      if (!left || !right) throw new Error(`operador "${token}" sem operandos suficientes`);
      stack.push(new Operator(left, right));
    } else if (/^-?\d+(\.\d+)?$/.test(token)) {
      stack.push(new NumberExpression(Number(token)));
    } else {
      stack.push(new VariableExpression(token));
    }
  }

  const root = stack.pop();
  if (!root || stack.length > 0) throw new Error("expressão malformada");
  return root;
}

function main(): void {
  const context = new Context().set("x", 3).set("y", 2);

  const sentences = ["5 x + y *", "10 x - y /", "x x * y y * +", "1 z +", "4 0 /", "+"];

  for (const sentence of sentences) {
    try {
      const tree = parse(sentence);
      console.log(`"${sentence}"  =>  ${tree}  =  ${tree.interpret(context)}`);
    } catch (error) {
      console.log(`"${sentence}"  =>  ❌ ${(error as Error).message}`);
    }
  }

  console.log("\nMesma árvore, outro contexto (x=10, y=5):");
  const tree = parse("5 x + y *");
  console.log(`${tree} = ${tree.interpret(new Context().set("x", 10).set("y", 5))}`);
}

main();

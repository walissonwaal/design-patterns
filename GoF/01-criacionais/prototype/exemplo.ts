/**
 * Prototype — exemplo: editor gráfico que duplica formas.
 *
 * Em vez de criar uma forma do zero e configurar tudo de novo, clonamos uma
 * forma já configurada. Também mostra por que a cópia precisa ser PROFUNDA.
 *
 * Executar: npx tsx 01-criacionais/prototype/exemplo.ts
 */

interface Style {
  border: string;
  width: number;
}

// Interface Prototype: todo objeto clonável sabe se copiar.
interface Prototype<T> {
  clone(): T;
}

abstract class Shape implements Prototype<Shape> {
  constructor(
    public x: number,
    public y: number,
    public style: Style, // objeto ANINHADO: é aqui que a cópia rasa quebra
  ) {}

  abstract clone(): Shape;
  abstract describe(): string;
}

class Circle extends Shape {
  constructor(
    x: number,
    y: number,
    style: Style,
    public radius: number,
  ) {
    super(x, y, style);
  }

  // O objeto sabe se clonar: o cliente não precisa conhecer a classe concreta
  // nem acessar campos privados.
  override clone(): Circle {
    // structuredClone faz cópia profunda do estilo (objeto aninhado).
    return new Circle(this.x, this.y, structuredClone(this.style), this.radius);
  }

  override describe(): string {
    return `Círculo r=${this.radius} em (${this.x},${this.y}) borda ${this.style.border}/${this.style.width}px`;
  }
}

class Rectangle extends Shape {
  constructor(
    x: number,
    y: number,
    style: Style,
    public width: number,
    public height: number,
  ) {
    super(x, y, style);
  }

  override clone(): Rectangle {
    return new Rectangle(this.x, this.y, structuredClone(this.style), this.width, this.height);
  }

  override describe(): string {
    return `Retângulo ${this.width}x${this.height} em (${this.x},${this.y}) borda ${this.style.border}/${this.style.width}px`;
  }
}

// Registro de protótipos: catálogo de objetos pré-configurados prontos para clonar.
class ShapeRegistry {
  private readonly prototypes = new Map<string, Shape>();

  register(key: string, prototype: Shape): void {
    this.prototypes.set(key, prototype);
  }

  create(key: string): Shape {
    const prototype = this.prototypes.get(key);
    if (!prototype) throw new Error(`Protótipo "${key}" não registrado`);
    return prototype.clone();
  }
}

function main(): void {
  console.log("== 1) Clonando um objeto configurado ==");
  const original = new Circle(10, 10, { border: "vermelha", width: 2 }, 5);
  const copia = original.clone();
  copia.x = 99; // mexer na cópia...
  copia.style.border = "azul";
  console.log("original:", original.describe());
  console.log("cópia:   ", copia.describe());

  console.log("\n== 2) Por que cópia PROFUNDA? (cópia rasa com Object.assign) ==");
  const rasa = Object.assign(Object.create(Object.getPrototypeOf(original)), original) as Circle;
  rasa.style.border = "verde"; // `style` é o MESMO objeto nos dois!
  console.log("original depois de alterar a cópia rasa:", original.describe());
  console.log("  → a borda do original mudou sem querer (estado compartilhado)");

  console.log("\n== 3) Registro de protótipos ==");
  const registry = new ShapeRegistry();
  registry.register("botao", new Rectangle(0, 0, { border: "preta", width: 1 }, 120, 40));
  registry.register("ponto-vermelho", new Circle(0, 0, { border: "vermelha", width: 3 }, 4));

  const b1 = registry.create("botao");
  const b2 = registry.create("botao");
  b2.x = 200;
  console.log(b1.describe());
  console.log(b2.describe());
  console.log(`b1 === b2 ? ${b1 === b2}`);
}

main();

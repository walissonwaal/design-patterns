/**
 * Visitor — exemplo: operações sobre uma árvore de formas geométricas.
 *
 * As formas (Circle, Rectangle, Group) ficam enxutas: só sabem aceitar um
 * visitor. Cada NOVA operação (calcular área, exportar JSON, desenhar...) é
 * uma classe Visitor separada — sem mexer nas formas.
 *
 * Executar: npx tsx 03-comportamentais/visitor/exemplo.ts
 */

// Visitor: um método visit* para CADA tipo de elemento. R = tipo do resultado.
interface ShapeVisitor<R> {
  visitCircle(circle: Circle): R;
  visitRectangle(rectangle: Rectangle): R;
  visitGroup(group: Group): R;
}

// Elemento: só precisa de accept(). Aqui acontece o "double dispatch".
interface Shape {
  accept<R>(visitor: ShapeVisitor<R>): R;
}

class Circle implements Shape {
  constructor(readonly radius: number) {}

  accept<R>(visitor: ShapeVisitor<R>): R {
    return visitor.visitCircle(this); // 1º despacho: tipo do elemento escolhe visitCircle
  }
}

class Rectangle implements Shape {
  constructor(
    readonly width: number,
    readonly height: number,
  ) {}

  accept<R>(visitor: ShapeVisitor<R>): R {
    return visitor.visitRectangle(this);
  }
}

class Group implements Shape {
  readonly children: Shape[];

  constructor(...children: Shape[]) {
    this.children = children;
  }

  accept<R>(visitor: ShapeVisitor<R>): R {
    return visitor.visitGroup(this);
  }
}

// ---------------------------------------------------------------------------
// Visitor concreto #1: calcula a área (resultado: number)
// ---------------------------------------------------------------------------
class AreaVisitor implements ShapeVisitor<number> {
  visitCircle(circle: Circle): number {
    return Math.PI * circle.radius ** 2;
  }

  visitRectangle(rectangle: Rectangle): number {
    return rectangle.width * rectangle.height;
  }

  visitGroup(group: Group): number {
    // 2º despacho: o visitor escolhe o método conforme o tipo de cada filho
    return group.children.reduce((total, child) => total + child.accept(this), 0);
  }
}

// ---------------------------------------------------------------------------
// Visitor concreto #2: exporta para JSON (resultado: string)
// ---------------------------------------------------------------------------
class JsonExportVisitor implements ShapeVisitor<string> {
  visitCircle(circle: Circle): string {
    return JSON.stringify({ type: "circle", radius: circle.radius });
  }

  visitRectangle(rectangle: Rectangle): string {
    return JSON.stringify({ type: "rectangle", width: rectangle.width, height: rectangle.height });
  }

  visitGroup(group: Group): string {
    const children = group.children.map((child) => child.accept(this));
    return `{"type":"group","children":[${children.join(",")}]}`;
  }
}

// ---------------------------------------------------------------------------
// Visitor concreto #3: desenha a árvore em texto (resultado: string[])
// ---------------------------------------------------------------------------
class OutlineVisitor implements ShapeVisitor<string[]> {
  constructor(private readonly depth = 0) {}

  visitCircle(circle: Circle): string[] {
    return [`${this.pad()}○ círculo r=${circle.radius}`];
  }

  visitRectangle(rectangle: Rectangle): string[] {
    return [`${this.pad()}▭ retângulo ${rectangle.width}x${rectangle.height}`];
  }

  visitGroup(group: Group): string[] {
    const inner = new OutlineVisitor(this.depth + 1);
    return [`${this.pad()}▣ grupo`, ...group.children.flatMap((child) => child.accept(inner))];
  }

  private pad(): string {
    return "  ".repeat(this.depth);
  }
}

function main(): void {
  const drawing = new Group(
    new Circle(1),
    new Rectangle(4, 3),
    new Group(new Circle(2), new Rectangle(1, 1)),
  );

  console.log("== Estrutura (OutlineVisitor) ==");
  console.log(drawing.accept(new OutlineVisitor()).join("\n"));

  console.log("\n== Área total (AreaVisitor) ==");
  console.log(drawing.accept(new AreaVisitor()).toFixed(2));

  console.log("\n== Exportação (JsonExportVisitor) ==");
  console.log(drawing.accept(new JsonExportVisitor()));
}

main();

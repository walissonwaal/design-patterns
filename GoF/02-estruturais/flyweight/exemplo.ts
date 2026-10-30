/**
 * Flyweight — exemplo: uma floresta com 100.000 árvores.
 *
 * Cada árvore tem estado ÚNICO (posição) e estado REPETIDO (espécie, cor,
 * textura pesada). Guardamos o estado repetido uma única vez e o
 * compartilhamos entre todas as árvores da mesma espécie.
 *
 * Executar: npx tsx 02-estruturais/flyweight/exemplo.ts
 */

const TEXTURE_BYTES = 50_000; // simula uma textura pesada (~50 KB)

// Flyweight: estado INTRÍNSECO (compartilhado). Deve ser IMUTÁVEL.
class TreeType {
  readonly texture: Buffer;

  constructor(
    readonly name: string,
    readonly color: string,
  ) {
    this.texture = Buffer.alloc(TEXTURE_BYTES, name); // dado pesado, criado 1x por espécie
  }

  // O estado extrínseco (x, y) chega por parâmetro, em vez de ser guardado aqui.
  draw(x: number, y: number): string {
    return `${this.name} ${this.color} desenhada em (${x}, ${y})`;
  }
}

// Fábrica de flyweights: garante o compartilhamento via cache.
class TreeTypeFactory {
  private static readonly cache = new Map<string, TreeType>();

  static get(name: string, color: string): TreeType {
    const key = `${name}|${color}`;
    let type = this.cache.get(key);
    if (!type) {
      type = new TreeType(name, color);
      this.cache.set(key, type);
    }
    return type;
  }

  static get count(): number {
    return this.cache.size;
  }
}

// Contexto: guarda o estado EXTRÍNSECO (único) + referência ao flyweight.
class Tree {
  constructor(
    private readonly x: number,
    private readonly y: number,
    readonly type: TreeType,
  ) {}

  draw(): string {
    return this.type.draw(this.x, this.y);
  }
}

class Forest {
  readonly trees: Tree[] = [];

  plantTree(x: number, y: number, name: string, color: string): void {
    const type = TreeTypeFactory.get(name, color); // reutiliza se já existir
    this.trees.push(new Tree(x, y, type));
  }
}

function main(): void {
  const forest = new Forest();
  const species: [string, string][] = [
    ["Carvalho", "verde"],
    ["Pinheiro", "verde-escuro"],
    ["Ipê", "amarelo"],
  ];

  const TOTAL = 100_000;
  for (let i = 0; i < TOTAL; i++) {
    const [name, color] = species[i % species.length]!;
    forest.plantTree(Math.random() * 1000, Math.random() * 1000, name, color);
  }

  console.log(`Árvores plantadas:        ${forest.trees.length.toLocaleString("pt-BR")}`);
  console.log(`Flyweights (TreeType):    ${TreeTypeFactory.count}`);
  console.log(`Exemplo: ${forest.trees[0]!.draw()}`);
  console.log(`Árvores 0 e 3 compartilham o mesmo TreeType? ${forest.trees[0]!.type === forest.trees[3]!.type}`);

  // Estimativa da memória das texturas (o dado pesado):
  const mb = (bytes: number) => (bytes / 1024 / 1024).toFixed(1) + " MB";
  const semFlyweight = TOTAL * TEXTURE_BYTES;
  const comFlyweight = TreeTypeFactory.count * TEXTURE_BYTES;
  console.log(`\nTexturas sem Flyweight: ${mb(semFlyweight)}`);
  console.log(`Texturas com Flyweight: ${mb(comFlyweight)}`);
}

main();

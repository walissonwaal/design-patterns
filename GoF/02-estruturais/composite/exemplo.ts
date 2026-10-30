/**
 * Composite — exemplo: sistema de arquivos (arquivos e pastas).
 *
 * Uma pasta contém arquivos E outras pastas. Tanto File quanto Directory
 * implementam a mesma interface, então o cliente os trata uniformemente.
 *
 * Executar: npx tsx 02-estruturais/composite/exemplo.ts
 */

// Componente: interface comum a folhas e compostos.
interface FileSystemNode {
  readonly name: string;
  getSize(): number; // em KB
  print(indent?: string): void;
}

// Folha: não tem filhos, faz o trabalho de fato.
class File implements FileSystemNode {
  constructor(
    readonly name: string,
    private readonly sizeKb: number,
  ) {}

  getSize(): number {
    return this.sizeKb;
  }

  print(indent = ""): void {
    console.log(`${indent}📄 ${this.name} (${this.sizeKb} KB)`);
  }
}

// Composto: guarda filhos (folhas OU outros compostos) e delega a eles.
class Directory implements FileSystemNode {
  private readonly children: FileSystemNode[] = [];

  constructor(readonly name: string) {}

  add(...nodes: FileSystemNode[]): this {
    this.children.push(...nodes);
    return this;
  }

  remove(node: FileSystemNode): void {
    const index = this.children.indexOf(node);
    if (index >= 0) this.children.splice(index, 1);
  }

  // Recursão: o tamanho de uma pasta é a soma dos tamanhos dos filhos.
  getSize(): number {
    return this.children.reduce((total, child) => total + child.getSize(), 0);
  }

  print(indent = ""): void {
    console.log(`${indent}📁 ${this.name}/ (${this.getSize()} KB)`);
    for (const child of this.children) child.print(indent + "   ");
  }
}

function main(): void {
  const src = new Directory("src").add(
    new File("index.ts", 4),
    new File("utils.ts", 3),
    new Directory("components").add(new File("Button.tsx", 5), new File("Modal.tsx", 8)),
  );

  const project = new Directory("projeto").add(
    src,
    new File("README.md", 2),
    new File("package.json", 1),
  );

  console.log("== Árvore completa ==");
  project.print();

  // O cliente não distingue pasta de arquivo: a mesma chamada funciona em ambos.
  const nodes: FileSystemNode[] = [project, src, new File("solto.txt", 7)];
  console.log("\n== Tamanhos (mesma interface para tudo) ==");
  for (const node of nodes) console.log(`${node.name}: ${node.getSize()} KB`);
}

main();

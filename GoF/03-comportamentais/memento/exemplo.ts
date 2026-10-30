/**
 * Memento — exemplo: editor de texto com "snapshots" do estado.
 *
 * O Editor (originador) cria um memento com cópia do seu estado interno.
 * O History (zelador) guarda os mementos, mas NÃO consegue ler o conteúdo:
 * para ele, um memento é um objeto opaco com apenas rótulo e data.
 * Isso preserva o encapsulamento do Editor.
 *
 * Executar: npx tsx 03-comportamentais/memento/exemplo.ts
 */

// Interface ESTREITA do memento: é tudo o que o zelador (History) enxerga.
interface Memento {
  readonly label: string;
  readonly date: Date;
}

interface EditorState {
  content: string;
  cursor: number;
}

// Memento concreto: guarda o estado. Só o Editor deveria chamar getState().
// (TypeScript não tem "friend"; a proteção é por convenção + interface estreita.)
class EditorSnapshot implements Memento {
  readonly date = new Date();
  private readonly state: EditorState;

  constructor(
    state: EditorState,
    readonly label: string,
  ) {
    this.state = { ...state }; // cópia: o memento é imutável
  }

  getState(): EditorState {
    return this.state;
  }
}

// Originador: tem o estado e sabe salvar/restaurar a si mesmo.
class Editor {
  private content = "";
  private cursor = 0;

  type(text: string): void {
    this.content = this.content.slice(0, this.cursor) + text + this.content.slice(this.cursor);
    this.cursor += text.length;
  }

  moveCursor(position: number): void {
    this.cursor = Math.max(0, Math.min(position, this.content.length));
  }

  save(label: string): Memento {
    return new EditorSnapshot({ content: this.content, cursor: this.cursor }, label);
  }

  restore(memento: Memento): void {
    if (!(memento instanceof EditorSnapshot)) throw new Error("memento inválido");
    const { content, cursor } = memento.getState();
    this.content = content;
    this.cursor = cursor;
  }

  toString(): string {
    // Mostra o cursor como "|" dentro do texto.
    return `"${this.content.slice(0, this.cursor)}|${this.content.slice(this.cursor)}"`;
  }
}

// Zelador: gerencia o histórico sem olhar dentro dos mementos.
class History {
  private readonly snapshots: Memento[] = [];

  constructor(private readonly editor: Editor) {}

  backup(label: string): void {
    this.snapshots.push(this.editor.save(label));
  }

  undo(): void {
    const memento = this.snapshots.pop();
    if (!memento) return console.log("  (histórico vazio)");
    console.log(`  ↩ restaurando "${memento.label}"`);
    this.editor.restore(memento);
  }

  list(): void {
    console.log(`  snapshots: [${this.snapshots.map((m) => m.label).join(", ")}]`);
  }
}

function main(): void {
  const editor = new Editor();
  const history = new History(editor);

  editor.type("Olá");
  history.backup("depois de 'Olá'");
  console.log("1)", editor.toString());

  editor.type(", mundo");
  history.backup("depois de ', mundo'");
  console.log("2)", editor.toString());

  editor.moveCursor(3);
  editor.type(" querido");
  console.log("3)", editor.toString());
  history.list();

  console.log("\nDesfazendo:");
  history.undo();
  console.log("  →", editor.toString());
  history.undo();
  console.log("  →", editor.toString());
  history.undo();
}

main();

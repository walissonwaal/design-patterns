/**
 * Command — exemplo: editor de texto com desfazer (undo) e refazer (redo).
 *
 * Cada ação do usuário vira um OBJETO (comando) que sabe se executar e se
 * desfazer. Como são objetos, podem ser guardados numa pilha de histórico.
 *
 * Executar: npx tsx 03-comportamentais/command/exemplo.ts
 */

// Receptor: quem realmente faz o trabalho.
class Editor {
  text = "";
}

// Interface do comando.
interface Command {
  execute(): void;
  undo(): void;
}

// Comando concreto: acrescenta texto. Guarda o necessário para desfazer.
class AppendCommand implements Command {
  constructor(
    private readonly editor: Editor,
    private readonly text: string,
  ) {}

  execute(): void {
    this.editor.text += this.text;
  }

  undo(): void {
    this.editor.text = this.editor.text.slice(0, -this.text.length);
  }
}

// Comando concreto: coloca tudo em maiúsculas. Faz backup do estado anterior.
class UppercaseCommand implements Command {
  private backup = "";

  constructor(private readonly editor: Editor) {}

  execute(): void {
    this.backup = this.editor.text;
    this.editor.text = this.editor.text.toUpperCase();
  }

  undo(): void {
    this.editor.text = this.backup;
  }
}

// Comando concreto: apaga os últimos N caracteres (guarda o que apagou).
class DeleteLastCommand implements Command {
  private removed = "";

  constructor(
    private readonly editor: Editor,
    private readonly count: number,
  ) {}

  execute(): void {
    this.removed = this.editor.text.slice(-this.count);
    this.editor.text = this.editor.text.slice(0, -this.count);
  }

  undo(): void {
    this.editor.text += this.removed;
  }
}

// Invocador: executa comandos e mantém o histórico. NÃO sabe o que cada comando faz.
class CommandHistory {
  private readonly done: Command[] = [];
  private readonly undone: Command[] = [];

  run(command: Command): void {
    command.execute();
    this.done.push(command);
    this.undone.length = 0; // uma nova ação invalida o "refazer"
  }

  undo(): void {
    const command = this.done.pop();
    if (!command) return console.log("  (nada para desfazer)");
    command.undo();
    this.undone.push(command);
  }

  redo(): void {
    const command = this.undone.pop();
    if (!command) return console.log("  (nada para refazer)");
    command.execute();
    this.done.push(command);
  }
}

function main(): void {
  const editor = new Editor();
  const history = new CommandHistory();
  const show = (acao: string) => console.log(`${acao.padEnd(22)} → "${editor.text}"`);

  history.run(new AppendCommand(editor, "Olá"));
  show("append 'Olá'");
  history.run(new AppendCommand(editor, ", mundo"));
  show("append ', mundo'");
  history.run(new UppercaseCommand(editor));
  show("maiúsculas");
  history.run(new DeleteLastCommand(editor, 3));
  show("apagar 3 últimos");

  console.log("\n-- desfazendo tudo --");
  history.undo(); show("undo");
  history.undo(); show("undo");
  history.undo(); show("undo");

  console.log("\n-- refazendo --");
  history.redo(); show("redo");
  history.redo(); show("redo");

  console.log("\n-- nova ação invalida o redo --");
  history.run(new AppendCommand(editor, "!"));
  show("append '!'");
  history.redo();
}

main();

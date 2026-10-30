/**
 * State — exemplo: fluxo de publicação de um documento.
 *
 *   Rascunho ──submit──▶ Moderação ──approve──▶ Publicado
 *       ▲                    │                       │
 *       └──────reject────────┘◀──────reject──────────┘
 *
 * O MESMO método (edit, submit...) se comporta de forma diferente conforme o
 * estado atual. Em vez de `if (status === ...)` espalhados, cada estado é uma
 * classe com seu próprio comportamento.
 *
 * Executar: npx tsx 03-comportamentais/state/exemplo.ts
 */

// Interface de estado: todas as operações que dependem do estado.
interface State {
  readonly name: string;
  edit(doc: Document, text: string): void;
  submit(doc: Document): void;
  approve(doc: Document): void;
  reject(doc: Document): void;
}

// Contexto: guarda o estado atual e DELEGA as operações a ele.
class Document {
  content = "";
  private state: State = new DraftState();

  // Chamado pelos próprios estados para trocar de estado.
  transitionTo(state: State): void {
    console.log(`    ⇢ ${this.state.name} → ${state.name}`);
    this.state = state;
  }

  get status(): string {
    return this.state.name;
  }

  edit(text: string): void { this.state.edit(this, text); }
  submit(): void { this.state.submit(this); }
  approve(): void { this.state.approve(this); }
  reject(): void { this.state.reject(this); }
}

// ---------------------------------------------------------------------------
// Estados concretos: cada um decide o que cada operação significa nele.
// ---------------------------------------------------------------------------
class DraftState implements State {
  readonly name = "Rascunho";

  edit(doc: Document, text: string): void {
    doc.content = text;
    console.log(`    ✏️  texto atualizado: "${text}"`);
  }

  submit(doc: Document): void {
    if (doc.content.trim() === "") return console.log("    ❌ não dá para enviar documento vazio");
    doc.transitionTo(new ModerationState());
  }

  approve(): void {
    console.log("    ❌ só é possível aprovar documentos em moderação");
  }

  reject(): void {
    console.log("    ❌ já é um rascunho");
  }
}

class ModerationState implements State {
  readonly name = "Moderação";

  edit(): void {
    console.log("    ❌ não é permitido editar durante a moderação");
  }

  submit(): void {
    console.log("    ❌ já está em moderação");
  }

  approve(doc: Document): void {
    doc.transitionTo(new PublishedState());
  }

  reject(doc: Document): void {
    doc.transitionTo(new DraftState());
  }
}

class PublishedState implements State {
  readonly name = "Publicado";

  edit(): void {
    console.log("    ❌ documento publicado não pode ser editado");
  }

  submit(): void {
    console.log("    ❌ já está publicado");
  }

  approve(): void {
    console.log("    ❌ já está publicado");
  }

  reject(doc: Document): void {
    doc.transitionTo(new DraftState()); // despublicar
  }
}

function main(): void {
  const doc = new Document();
  const step = (title: string, action: () => void) => {
    console.log(`${title} [${doc.status}]`);
    action();
  };

  step("1. enviar vazio     ", () => doc.submit());
  step("2. editar           ", () => doc.edit("Meu primeiro artigo"));
  step("3. enviar           ", () => doc.submit());
  step("4. editar (proibido)", () => doc.edit("tentando mudar"));
  step("5. aprovar          ", () => doc.approve());
  step("6. aprovar de novo  ", () => doc.approve());
  step("7. despublicar      ", () => doc.reject());
  step("8. editar           ", () => doc.edit("Versão 2 do artigo"));
}

main();

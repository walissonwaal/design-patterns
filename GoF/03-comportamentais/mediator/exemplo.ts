/**
 * Mediator — exemplo: sala de bate-papo.
 *
 * Os usuários (colegas) NÃO se conhecem. Toda mensagem passa pela sala
 * (mediador), que decide quem recebe — transformando uma comunicação
 * "todos com todos" em "todos com a sala".
 *
 * Executar: npx tsx 03-comportamentais/mediator/exemplo.ts
 */

// Interface do mediador
interface ChatMediator {
  register(user: User): void;
  send(from: User, message: string, to?: string): void;
}

// Colega: conhece apenas o mediador.
class User {
  constructor(
    readonly name: string,
    private readonly mediator: ChatMediator,
  ) {
    mediator.register(this);
  }

  send(message: string, to?: string): void {
    this.mediator.send(this, message, to);
  }

  receive(from: string, message: string, isPrivate: boolean): void {
    const tag = isPrivate ? " (privado)" : "";
    console.log(`    ${this.name} recebeu de ${from}${tag}: ${message}`);
  }
}

// Mediador concreto: concentra as regras de interação.
class ChatRoom implements ChatMediator {
  private readonly users = new Map<string, User>();
  private readonly muted = new Set<string>();

  register(user: User): void {
    this.users.set(user.name, user);
    console.log(`  ${user.name} entrou na sala`);
  }

  mute(name: string): void {
    this.muted.add(name);
    console.log(`  🔇 ${name} foi silenciado(a)`);
  }

  send(from: User, message: string, to?: string): void {
    console.log(`  ${from.name} → ${to ?? "todos"}: ${message}`);

    // Regra 1: usuários silenciados não conseguem enviar.
    if (this.muted.has(from.name)) {
      console.log("    ❌ mensagem bloqueada (usuário silenciado)");
      return;
    }

    // Regra 2: mensagem privada vai para um destinatário só.
    if (to) {
      const target = this.users.get(to);
      if (!target) return console.log(`    ❌ usuário "${to}" não existe`);
      return target.receive(from.name, message, true);
    }

    // Regra 3: broadcast para todos, exceto o remetente.
    for (const user of this.users.values()) {
      if (user !== from) user.receive(from.name, message, false);
    }
  }
}

function main(): void {
  const room = new ChatRoom();

  console.log("== Entrando ==");
  const ana = new User("Ana", room);
  const beto = new User("Beto", room);
  new User("Caio", room);

  console.log("\n== Mensagem para todos ==");
  ana.send("Oi, pessoal!");

  console.log("\n== Mensagem privada ==");
  beto.send("Só para a Ana", "Ana");

  console.log("\n== Destinatário inexistente ==");
  ana.send("Alguém aí?", "Zeca");

  console.log("\n== Regra do mediador: silenciar ==");
  room.mute("Beto");
  beto.send("Posso falar?");
}

main();

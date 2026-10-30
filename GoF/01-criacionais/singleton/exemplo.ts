/**
 * Singleton — exemplo: conexão com o banco de dados.
 *
 * Abrir uma conexão é caro; queremos UMA só, compartilhada por toda a aplicação.
 *
 * Executar: npx tsx 01-criacionais/singleton/exemplo.ts
 */

// ---------------------------------------------------------------------------
// Versão clássica do GoF: construtor privado + método estático getInstance()
// ---------------------------------------------------------------------------
class Database {
  // Guarda a única instância (null enquanto ninguém pediu).
  private static instance: Database | null = null;

  private readonly history: string[] = [];

  // Construtor privado: `new Database()` fora da classe não compila.
  private constructor(public readonly url: string) {
    console.log(`  [Database] abrindo conexão com ${url} (operação cara!)`);
  }

  // Ponto de acesso global. Cria a instância só na primeira chamada (lazy).
  static getInstance(): Database {
    if (Database.instance === null) {
      Database.instance = new Database("postgres://localhost:5432/app");
    }
    return Database.instance;
  }

  query(sql: string): string {
    this.history.push(sql);
    return `resultado de "${sql}"`;
  }

  get totalQueries(): number {
    return this.history.length;
  }
}

// ---------------------------------------------------------------------------
// Alternativa idiomática em TypeScript/Node: o próprio módulo é um singleton.
// O Node avalia um módulo uma única vez e guarda o resultado em cache, então
// `export const` já entrega uma instância única, sem boilerplate.
// ---------------------------------------------------------------------------
class AppLogger {
  log(message: string): void {
    console.log(`  [log] ${message}`);
  }
}
export const logger = new AppLogger(); // quem importar recebe sempre este objeto

// ---------------------------------------------------------------------------
// Demonstração
// ---------------------------------------------------------------------------
function main(): void {
  console.log("1) Pedindo a instância duas vezes:");
  const a = Database.getInstance(); // cria a conexão
  const b = Database.getInstance(); // reaproveita

  console.log(`\n2) a === b ? ${a === b}`);

  a.query("SELECT * FROM users");
  b.query("SELECT * FROM orders");
  console.log(`3) Queries registradas (estado compartilhado): ${a.totalQueries}`);

  logger.log("o módulo também funciona como singleton");
}

// Esta função nunca é chamada: serve só para provar que o compilador recusa
// a criação direta. (Em JavaScript puro, `private` não existe em runtime e o
// `new` funcionaria — por isso não a executamos.)
function criacaoDiretaNaoCompila(): void {
  // @ts-expect-error — construtor privado: só getInstance() pode criar
  new Database("outra-url");
}
void criacaoDiretaNaoCompila;

main();

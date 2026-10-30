/**
 * Chain of Responsibility — exemplo: pipeline de validação de requisições HTTP.
 *
 * A requisição passa por uma corrente de handlers. Cada um decide:
 *   - tratar e INTERROMPER a corrente (rejeitando), ou
 *   - passar adiante para o próximo elo.
 * É a mesma ideia dos middlewares do Express/Koa.
 *
 * Executar: npx tsx 03-comportamentais/chain-of-responsibility/exemplo.ts
 */

interface HttpRequest {
  ip: string;
  path: string;
  user?: string;
  password?: string;
}

type Result = { ok: true } | { ok: false; reason: string };

// Interface do handler
interface Handler {
  setNext(handler: Handler): Handler;
  handle(request: HttpRequest): Result;
}

// Handler base: guarda o próximo elo e repassa por padrão.
abstract class BaseHandler implements Handler {
  private next?: Handler;

  // Devolve o handler recebido para permitir encadear: a.setNext(b).setNext(c)
  setNext(handler: Handler): Handler {
    this.next = handler;
    return handler;
  }

  handle(request: HttpRequest): Result {
    // Fim da corrente: ninguém rejeitou, então a requisição é válida.
    return this.next ? this.next.handle(request) : { ok: true };
  }
}

// Elo 1: limita requisições por IP.
class RateLimitHandler extends BaseHandler {
  private readonly hits = new Map<string, number>();

  constructor(private readonly maxRequests: number) {
    super();
  }

  override handle(request: HttpRequest): Result {
    const count = (this.hits.get(request.ip) ?? 0) + 1;
    this.hits.set(request.ip, count);
    if (count > this.maxRequests) {
      return { ok: false, reason: `429 limite excedido para ${request.ip}` };
    }
    return super.handle(request); // passa adiante
  }
}

// Elo 2: confere usuário e senha.
class AuthenticationHandler extends BaseHandler {
  private readonly users = new Map([
    ["ana", "1234"],
    ["beto", "abcd"],
  ]);

  override handle(request: HttpRequest): Result {
    if (!request.user || this.users.get(request.user) !== request.password) {
      return { ok: false, reason: "401 credenciais inválidas" };
    }
    return super.handle(request);
  }
}

// Elo 3: apenas "ana" é administradora.
class AuthorizationHandler extends BaseHandler {
  override handle(request: HttpRequest): Result {
    if (request.path.startsWith("/admin") && request.user !== "ana") {
      return { ok: false, reason: "403 acesso negado a /admin" };
    }
    return super.handle(request);
  }
}

function main(): void {
  // Monta a corrente: rate limit → autenticação → autorização
  const chain = new RateLimitHandler(3);
  chain.setNext(new AuthenticationHandler()).setNext(new AuthorizationHandler());

  const requests: [string, HttpRequest][] = [
    ["válida", { ip: "1.1.1.1", path: "/home", user: "ana", password: "1234" }],
    ["senha errada", { ip: "2.2.2.2", path: "/home", user: "ana", password: "xxxx" }],
    ["sem permissão", { ip: "3.3.3.3", path: "/admin", user: "beto", password: "abcd" }],
    ["admin ok", { ip: "4.4.4.4", path: "/admin", user: "ana", password: "1234" }],
  ];

  for (const [label, request] of requests) {
    const result = chain.handle(request);
    console.log(`${label.padEnd(14)} → ${result.ok ? "✅ aceita" : "❌ " + result.reason}`);
  }

  console.log("\nMesmo IP fazendo 5 requisições (limite = 3):");
  const flood = { ip: "9.9.9.9", path: "/home", user: "ana", password: "1234" };
  for (let i = 1; i <= 5; i++) {
    const result = chain.handle(flood);
    console.log(`  #${i} → ${result.ok ? "✅ aceita" : "❌ " + result.reason}`);
  }
}

main();

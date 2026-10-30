/**
 * Proxy — exemplo: acesso a um repositório de usuários.
 *
 * Um proxy tem a MESMA interface do objeto real e fica na frente dele,
 * controlando o acesso. Três tipos clássicos:
 *   - Cache (proxy de cache): evita consultas repetidas
 *   - Proteção: verifica permissões
 *   - Virtual (lazy): só cria o objeto caro quando for realmente usado
 *
 * Executar: npx tsx 02-estruturais/proxy/exemplo.ts
 */

interface User {
  id: number;
  name: string;
}

// Interface de serviço: comum ao objeto real e aos proxies.
interface UserRepository {
  findById(id: number): User;
}

// Serviço real: caro (simula acesso ao banco).
class RealUserRepository implements UserRepository {
  constructor() {
    console.log("    [Real] conexão com o banco aberta (cara!)");
  }

  findById(id: number): User {
    console.log(`    [Real] consultando o banco pelo id ${id}...`);
    return { id, name: `Usuário ${id}` };
  }
}

// ---------------------------------------------------------------------------
// Proxy de cache
// ---------------------------------------------------------------------------
class CachingProxy implements UserRepository {
  private readonly cache = new Map<number, User>();

  constructor(private readonly target: UserRepository) {}

  findById(id: number): User {
    const cached = this.cache.get(id);
    if (cached) {
      console.log(`    [Cache] acerto para o id ${id}`);
      return cached;
    }
    const user = this.target.findById(id);
    this.cache.set(id, user);
    return user;
  }
}

// ---------------------------------------------------------------------------
// Proxy de proteção
// ---------------------------------------------------------------------------
class ProtectionProxy implements UserRepository {
  constructor(
    private readonly target: UserRepository,
    private readonly viewerRole: "admin" | "guest",
  ) {}

  findById(id: number): User {
    if (this.viewerRole !== "admin") {
      throw new Error(`acesso negado: papel "${this.viewerRole}" não pode consultar usuários`);
    }
    return this.target.findById(id);
  }
}

// ---------------------------------------------------------------------------
// Proxy virtual (inicialização preguiçosa)
// ---------------------------------------------------------------------------
class LazyProxy implements UserRepository {
  private target?: UserRepository;

  constructor(private readonly factory: () => UserRepository) {}

  findById(id: number): User {
    this.target ??= this.factory(); // só cria o objeto caro na primeira chamada
    return this.target.findById(id);
  }
}

// ---------------------------------------------------------------------------
// Bônus: JavaScript tem um Proxy NATIVO, que faz o mesmo sem escrever a classe.
// ---------------------------------------------------------------------------
function withLogging<T extends object>(target: T): T {
  return new Proxy(target, {
    get(obj, prop, receiver) {
      const value = Reflect.get(obj, prop, receiver);
      if (typeof value !== "function") return value;
      return (...args: unknown[]) => {
        console.log(`    [Proxy nativo] chamando ${String(prop)}(${args.join(", ")})`);
        return value.apply(obj, args);
      };
    },
  });
}

function main(): void {
  console.log("== 1) Proxy virtual: o objeto real só nasce quando precisa ==");
  const lazy = new LazyProxy(() => new RealUserRepository());
  console.log("  proxy criado (nada caro aconteceu ainda)");
  console.log("  ", lazy.findById(1));

  console.log("\n== 2) Proxy de cache ==");
  const cached = new CachingProxy(new RealUserRepository());
  cached.findById(7); // vai ao banco
  cached.findById(7); // vem do cache

  console.log("\n== 3) Proxy de proteção ==");
  const guestRepo = new ProtectionProxy(new RealUserRepository(), "guest");
  try {
    guestRepo.findById(1);
  } catch (error) {
    console.log(`  ❌ ${(error as Error).message}`);
  }

  console.log("\n== 4) Proxies empilhados (mesma interface permite compor) ==");
  const repo: UserRepository = new ProtectionProxy(
    new CachingProxy(new LazyProxy(() => new RealUserRepository())),
    "admin",
  );
  repo.findById(3);
  repo.findById(3);

  console.log("\n== 5) Proxy nativo do JavaScript ==");
  const logged = withLogging(new CachingProxy(new RealUserRepository()));
  logged.findById(9);
}

main();

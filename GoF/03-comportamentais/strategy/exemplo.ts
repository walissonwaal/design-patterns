/**
 * Strategy — exemplo: cálculo de frete numa loja virtual.
 *
 * Cada forma de calcular o frete é uma estratégia intercambiável. O Checkout
 * recebe a estratégia pronta e não sabe (nem precisa saber) como ela calcula.
 *
 * Executar: npx tsx 03-comportamentais/strategy/exemplo.ts
 */

interface Order {
  subtotal: number;
  weightKg: number;
  distanceKm: number;
}

// Estratégia: a interface comum a todos os algoritmos.
interface ShippingStrategy {
  readonly label: string;
  calculate(order: Order): number;
}

// Estratégias concretas — algoritmos independentes e intercambiáveis.
class StandardShipping implements ShippingStrategy {
  readonly label = "Padrão";
  calculate(order: Order): number {
    return 5 + order.weightKg * 0.5;
  }
}

class ExpressShipping implements ShippingStrategy {
  readonly label = "Expresso";
  calculate(order: Order): number {
    return 15 + order.weightKg * 1.2 + order.distanceKm * 0.05;
  }
}

class PickupShipping implements ShippingStrategy {
  readonly label = "Retirar na loja";
  calculate(): number {
    return 0;
  }
}

// Estratégias podem ter configuração própria e até envolver outras estratégias.
class FreeShippingOver implements ShippingStrategy {
  readonly label: string;

  constructor(
    private readonly minimum: number,
    private readonly fallback: ShippingStrategy,
  ) {
    this.label = `${fallback.label} (grátis acima de R$ ${minimum})`;
  }

  calculate(order: Order): number {
    return order.subtotal >= this.minimum ? 0 : this.fallback.calculate(order);
  }
}

// Contexto: usa a estratégia, mas não conhece nenhuma classe concreta.
class Checkout {
  constructor(private strategy: ShippingStrategy) {}

  setStrategy(strategy: ShippingStrategy): void {
    this.strategy = strategy; // troca em tempo de execução
  }

  total(order: Order): string {
    const shipping = this.strategy.calculate(order);
    const total = order.subtotal + shipping;
    return `${this.strategy.label.padEnd(36)} frete R$ ${shipping.toFixed(2).padStart(6)} → total R$ ${total.toFixed(2)}`;
  }
}

// ---------------------------------------------------------------------------
// Em TypeScript uma estratégia simples também pode ser apenas uma FUNÇÃO.
// ---------------------------------------------------------------------------
type ShippingFn = (order: Order) => number;

const shippingByFunction: Record<string, ShippingFn> = {
  padrao: (o) => 5 + o.weightKg * 0.5,
  retirada: () => 0,
};

function main(): void {
  const smallOrder: Order = { subtotal: 80, weightKg: 2, distanceKm: 300 };
  const bigOrder: Order = { subtotal: 350, weightKg: 8, distanceKm: 300 };

  const checkout = new Checkout(new StandardShipping());

  console.log("== Pedido pequeno (R$ 80) — trocando a estratégia em runtime ==");
  console.log(checkout.total(smallOrder));
  checkout.setStrategy(new ExpressShipping());
  console.log(checkout.total(smallOrder));
  checkout.setStrategy(new PickupShipping());
  console.log(checkout.total(smallOrder));

  console.log("\n== Pedido grande (R$ 350) com frete grátis acima de R$ 200 ==");
  checkout.setStrategy(new FreeShippingOver(200, new StandardShipping()));
  console.log(checkout.total(bigOrder));
  console.log(checkout.total(smallOrder));

  console.log("\n== Versão funcional (estratégia = função) ==");
  console.log(`padrao:   R$ ${shippingByFunction["padrao"]!(smallOrder).toFixed(2)}`);
  console.log(`retirada: R$ ${shippingByFunction["retirada"]!(smallOrder).toFixed(2)}`);
}

main();

/**
 * Facade — exemplo: finalizar um pedido em uma loja virtual.
 *
 * Fazer um pedido envolve vários subsistemas (estoque, pagamento, entrega,
 * notificação) que precisam ser chamados na ordem certa, com compensação em
 * caso de erro. A fachada esconde isso atrás de UM método simples.
 *
 * Executar: npx tsx 02-estruturais/facade/exemplo.ts
 */

// ---------------------------------------------------------------------------
// Subsistema: classes complexas, cada uma com sua API própria
// ---------------------------------------------------------------------------
class InventoryService {
  private readonly stock = new Map<string, number>([
    ["notebook", 5],
    ["mouse", 100],
  ]);

  reserve(sku: string, qty: number): boolean {
    const available = this.stock.get(sku) ?? 0;
    if (available < qty) return false;
    this.stock.set(sku, available - qty);
    console.log(`    [Estoque] reservou ${qty}x ${sku}`);
    return true;
  }

  release(sku: string, qty: number): void {
    this.stock.set(sku, (this.stock.get(sku) ?? 0) + qty);
    console.log(`    [Estoque] devolveu ${qty}x ${sku}`);
  }
}

class PaymentService {
  private readonly balances = new Map<string, number>([
    ["ana", 10_000],
    ["beto", 50],
  ]);

  charge(customer: string, amount: number): boolean {
    const balance = this.balances.get(customer) ?? 0;
    if (balance < amount) {
      console.log(`    [Pagamento] saldo insuficiente para ${customer}`);
      return false;
    }
    this.balances.set(customer, balance - amount);
    console.log(`    [Pagamento] cobrou R$ ${amount} de ${customer}`);
    return true;
  }
}

class ShippingService {
  schedule(address: string, sku: string): string {
    const tracking = `BR-${sku.toUpperCase()}-${address.length * 7919}`;
    console.log(`    [Entrega] agendada para "${address}" (${tracking})`);
    return tracking;
  }
}

class NotificationService {
  sendEmail(to: string, message: string): void {
    console.log(`    [E-mail] para ${to}: ${message}`);
  }
}

// ---------------------------------------------------------------------------
// Fachada: interface simples que orquestra o subsistema
// ---------------------------------------------------------------------------
interface Order {
  customer: string;
  sku: string;
  qty: number;
  unitPrice: number;
  address: string;
}

type OrderResult = { ok: true; tracking: string } | { ok: false; reason: string };

class OrderFacade {
  constructor(
    private readonly inventory = new InventoryService(),
    private readonly payment = new PaymentService(),
    private readonly shipping = new ShippingService(),
    private readonly notifications = new NotificationService(),
  ) {}

  placeOrder(order: Order): OrderResult {
    if (!this.inventory.reserve(order.sku, order.qty)) {
      return { ok: false, reason: "sem estoque" };
    }

    if (!this.payment.charge(order.customer, order.qty * order.unitPrice)) {
      this.inventory.release(order.sku, order.qty); // compensação
      return { ok: false, reason: "pagamento recusado" };
    }

    const tracking = this.shipping.schedule(order.address, order.sku);
    this.notifications.sendEmail(order.customer, `pedido confirmado, rastreio ${tracking}`);
    return { ok: true, tracking };
  }
}

function main(): void {
  const store = new OrderFacade(); // o cliente conhece apenas a fachada

  const pedidos: Order[] = [
    { customer: "ana", sku: "notebook", qty: 1, unitPrice: 4_500, address: "Rua A, 10" },
    { customer: "beto", sku: "notebook", qty: 1, unitPrice: 4_500, address: "Rua B, 20" },
    { customer: "ana", sku: "notebook", qty: 99, unitPrice: 4_500, address: "Rua A, 10" },
  ];

  for (const pedido of pedidos) {
    console.log(`\nPedido de ${pedido.customer}: ${pedido.qty}x ${pedido.sku}`);
    const result = store.placeOrder(pedido);
    console.log(
      result.ok ? `  ✅ sucesso, rastreio ${result.tracking}` : `  ❌ falhou: ${result.reason}`,
    );
  }
}

main();

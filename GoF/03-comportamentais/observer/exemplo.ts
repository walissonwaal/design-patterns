/**
 * Observer — exemplo: cotação de uma ação e quem acompanha seu preço.
 *
 * O Stock (publicador/subject) avisa todos os assinantes (observers) sempre
 * que o preço muda — sem conhecer as classes concretas deles.
 *
 * Executar: npx tsx 03-comportamentais/observer/exemplo.ts
 */

// Evento que descreve a mudança.
interface PriceChange {
  symbol: string;
  oldPrice: number;
  newPrice: number;
}

// Observer: quem quer ser avisado.
interface Observer<T> {
  update(event: T): void;
}

// Subject genérico: gerencia assinaturas e notificações. Reutilizável.
class Subject<T> {
  private readonly observers = new Set<Observer<T>>();

  // Devolve uma função de cancelamento — jeito idiomático em TS/JS.
  subscribe(observer: Observer<T>): () => void {
    this.observers.add(observer);
    return () => this.unsubscribe(observer);
  }

  unsubscribe(observer: Observer<T>): void {
    this.observers.delete(observer);
  }

  protected notify(event: T): void {
    for (const observer of this.observers) observer.update(event);
  }
}

// Publicador concreto: muda de estado e notifica.
class Stock extends Subject<PriceChange> {
  constructor(
    readonly symbol: string,
    private price: number,
  ) {
    super();
  }

  setPrice(newPrice: number): void {
    if (newPrice === this.price) return;
    const event = { symbol: this.symbol, oldPrice: this.price, newPrice };
    this.price = newPrice;
    this.notify(event); // avisa todos os interessados
  }
}

// Observers concretos: cada um reage do seu jeito.
class PriceDisplay implements Observer<PriceChange> {
  update({ symbol, oldPrice, newPrice }: PriceChange): void {
    const arrow = newPrice > oldPrice ? "▲" : "▼";
    console.log(`  [painel]  ${symbol}: ${oldPrice} → ${newPrice} ${arrow}`);
  }
}

class PriceAlert implements Observer<PriceChange> {
  constructor(private readonly threshold: number) {}

  update({ symbol, newPrice }: PriceChange): void {
    if (newPrice >= this.threshold) {
      console.log(`  [alerta]  🚨 ${symbol} chegou a ${newPrice} (limite ${this.threshold})`);
    }
  }
}

class PriceHistory implements Observer<PriceChange> {
  readonly prices: number[] = [];

  update({ newPrice }: PriceChange): void {
    this.prices.push(newPrice);
  }
}

function main(): void {
  const stock = new Stock("PETR4", 100);
  const history = new PriceHistory();

  stock.subscribe(new PriceDisplay());
  stock.subscribe(history);
  const cancelAlert = stock.subscribe(new PriceAlert(110));

  console.log("Mudando o preço:");
  stock.setPrice(105);
  stock.setPrice(112); // dispara o alerta

  console.log("\nAlerta cancelou a assinatura:");
  cancelAlert();
  stock.setPrice(120); // painel e histórico continuam sendo avisados; alerta não

  console.log(`\nHistórico acumulado: ${history.prices.join(", ")}`);
}

main();

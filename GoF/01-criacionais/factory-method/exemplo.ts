/**
 * Factory Method — exemplo: aplicativo de logística.
 *
 * A classe Logistics sabe PLANEJAR uma entrega, mas deixa para as subclasses
 * decidir QUAL meio de transporte criar.
 *
 * Executar: npx tsx 01-criacionais/factory-method/exemplo.ts
 */

// Produto: a interface comum a todos os transportes.
interface Transport {
  deliver(cargo: string): string;
}

// Produtos concretos
class Truck implements Transport {
  deliver(cargo: string): string {
    return `🚚 Entrega por terra de "${cargo}" em um caminhão`;
  }
}

class Ship implements Transport {
  deliver(cargo: string): string {
    return `🚢 Entrega por mar de "${cargo}" em um navio`;
  }
}

class Plane implements Transport {
  deliver(cargo: string): string {
    return `✈️  Entrega por ar de "${cargo}" em um avião`;
  }
}

// Criador: declara o factory method e usa o produto sem conhecer a classe concreta.
abstract class Logistics {
  // O FACTORY METHOD: as subclasses decidem o que instanciar.
  protected abstract createTransport(): Transport;

  // Lógica de negócio que depende apenas da interface Transport.
  planDelivery(cargo: string): string {
    const transport = this.createTransport();
    return transport.deliver(cargo);
  }
}

// Criadores concretos: cada um sobrescreve o factory method.
class RoadLogistics extends Logistics {
  protected override createTransport(): Transport {
    return new Truck();
  }
}

class SeaLogistics extends Logistics {
  protected override createTransport(): Transport {
    return new Ship();
  }
}

// Adicionar um novo transporte NÃO exige mexer em Logistics (Aberto/Fechado).
class AirLogistics extends Logistics {
  protected override createTransport(): Transport {
    return new Plane();
  }
}

// O código cliente trabalha com a abstração, sem saber qual subclasse recebeu.
function clientCode(logistics: Logistics, cargo: string): void {
  console.log(logistics.planDelivery(cargo));
}

function main(): void {
  console.log("Aplicativo configurado para frete rodoviário:");
  clientCode(new RoadLogistics(), "100 caixas de café");

  console.log("\nAplicativo configurado para frete marítimo:");
  clientCode(new SeaLogistics(), "50 contêineres de soja");

  console.log("\nNova subclasse, nenhum código existente alterado:");
  clientCode(new AirLogistics(), "2 caixas de vacinas");
}

main();

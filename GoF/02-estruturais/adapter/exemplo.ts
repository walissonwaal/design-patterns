/**
 * Adapter — exemplo: integrar gateways de pagamento com APIs incompatíveis.
 *
 * O Checkout só conhece a interface PaymentProcessor. Cada gateway externo tem
 * uma API diferente; um Adapter traduz entre os dois mundos.
 *
 * Executar: npx tsx 02-estruturais/adapter/exemplo.ts
 */

// ---------------------------------------------------------------------------
// Interface-alvo (Target): o que o nosso sistema espera
// ---------------------------------------------------------------------------
interface PaymentResult {
  success: boolean;
  transactionId: string;
}

interface PaymentProcessor {
  pay(amountInReais: number): PaymentResult;
}

// ---------------------------------------------------------------------------
// Adaptee #1: sistema legado — valores em CENTAVOS e comunicação em XML.
// Não podemos (ou não devemos) modificar esta classe.
// ---------------------------------------------------------------------------
class LegacyBankGateway {
  sendTransaction(amountInCents: number, payerXml: string): string {
    console.log(`    [Legacy] recebido ${amountInCents} centavos, payload ${payerXml}`);
    return "<response><code>00</code><id>TX-LEGACY-42</id></response>";
  }
}

// ---------------------------------------------------------------------------
// Adaptee #2: SDK moderno de terceiros — valor como STRING e outro formato de retorno.
// ---------------------------------------------------------------------------
class FastPaySdk {
  charge(options: { value: string; cur: string }): { ok: boolean; ref: string } {
    console.log(`    [FastPay] cobrando ${options.value} ${options.cur}`);
    return { ok: true, ref: "FP-777" };
  }
}

// ---------------------------------------------------------------------------
// Adapters: implementam o Target e DELEGAM ao Adaptee (composição).
// ---------------------------------------------------------------------------
class LegacyBankAdapter implements PaymentProcessor {
  constructor(private readonly gateway: LegacyBankGateway) {}

  pay(amountInReais: number): PaymentResult {
    const cents = Math.round(amountInReais * 100); // reais → centavos
    const xml = this.gateway.sendTransaction(cents, "<payer>cliente</payer>");

    // XML → objeto do nosso domínio
    const code = /<code>(.*?)<\/code>/.exec(xml)?.[1];
    const id = /<id>(.*?)<\/id>/.exec(xml)?.[1] ?? "";
    return { success: code === "00", transactionId: id };
  }
}

class FastPayAdapter implements PaymentProcessor {
  constructor(private readonly sdk: FastPaySdk) {}

  pay(amountInReais: number): PaymentResult {
    const response = this.sdk.charge({ value: amountInReais.toFixed(2), cur: "BRL" });
    return { success: response.ok, transactionId: response.ref };
  }
}

// ---------------------------------------------------------------------------
// Cliente: conhece apenas PaymentProcessor, nunca os gateways.
// ---------------------------------------------------------------------------
class Checkout {
  constructor(private readonly processor: PaymentProcessor) {}

  finalize(total: number): void {
    const result = this.processor.pay(total);
    const status = result.success ? "aprovado ✅" : "recusado ❌";
    console.log(`  Pagamento ${status} (transação ${result.transactionId})\n`);
  }
}

function main(): void {
  console.log("Pagando via banco legado:");
  new Checkout(new LegacyBankAdapter(new LegacyBankGateway())).finalize(10.5);

  console.log("Pagando via FastPay:");
  new Checkout(new FastPayAdapter(new FastPaySdk())).finalize(99.9);
}

main();

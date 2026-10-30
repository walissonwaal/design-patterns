/**
 * Decorator — exemplo: camadas de compressão e criptografia sobre um armazenamento.
 *
 * Cada decorator embrulha uma DataSource, ADICIONA um comportamento e delega o
 * resto. Podemos empilhar quantas camadas quisermos, na ordem que quisermos,
 * em tempo de execução — sem criar subclasses para cada combinação.
 *
 * Executar: npx tsx 02-estruturais/decorator/exemplo.ts
 */
import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "node:crypto";
import { gunzipSync, gzipSync } from "node:zlib";

// Componente: interface comum ao objeto base e a todos os decoradores.
interface DataSource {
  writeData(data: string): void;
  readData(): string;
}

// Componente concreto: o objeto "de verdade" que será embrulhado.
class MemoryDataSource implements DataSource {
  private stored = "";

  writeData(data: string): void {
    this.stored = data;
  }

  readData(): string {
    return this.stored;
  }
}

// Decorator base: tem a MESMA interface e guarda o objeto embrulhado.
// Por padrão apenas repassa tudo; as subclasses acrescentam comportamento.
abstract class DataSourceDecorator implements DataSource {
  constructor(protected readonly wrappee: DataSource) {}

  writeData(data: string): void {
    this.wrappee.writeData(data);
  }

  readData(): string {
    return this.wrappee.readData();
  }
}

// Decorator concreto #1: comprime ao gravar, descomprime ao ler.
class CompressionDecorator extends DataSourceDecorator {
  override writeData(data: string): void {
    super.writeData(gzipSync(data).toString("base64"));
  }

  override readData(): string {
    return gunzipSync(Buffer.from(super.readData(), "base64")).toString("utf8");
  }
}

// Decorator concreto #2: criptografa (AES-256-GCM) ao gravar, descriptografa ao ler.
// Obs.: o salt fixo é só para o exemplo; em produção use segredos e salts reais.
class EncryptionDecorator extends DataSourceDecorator {
  private readonly key: Buffer;

  constructor(wrappee: DataSource, password: string) {
    super(wrappee);
    this.key = scryptSync(password, "salt-didatico", 32);
  }

  override writeData(data: string): void {
    const iv = randomBytes(12);
    const cipher = createCipheriv("aes-256-gcm", this.key, iv);
    const encrypted = Buffer.concat([cipher.update(data, "utf8"), cipher.final()]);
    const payload = Buffer.concat([iv, cipher.getAuthTag(), encrypted]);
    super.writeData(payload.toString("base64"));
  }

  override readData(): string {
    const payload = Buffer.from(super.readData(), "base64");
    const iv = payload.subarray(0, 12);
    const tag = payload.subarray(12, 28);
    const encrypted = payload.subarray(28);
    const decipher = createDecipheriv("aes-256-gcm", this.key, iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf8");
  }
}

// Decorator concreto #3: apenas registra no console (comportamento "transversal").
class LoggingDecorator extends DataSourceDecorator {
  override writeData(data: string): void {
    console.log(`  [log] gravando ${data.length} caracteres`);
    super.writeData(data);
  }

  override readData(): string {
    const data = super.readData();
    console.log(`  [log] lidos ${data.length} caracteres`);
    return data;
  }
}

function main(): void {
  const text = "Design Patterns ".repeat(50); // texto repetitivo: comprime bem

  console.log("== 1) Sem decorators ==");
  const plain = new MemoryDataSource();
  plain.writeData(text);
  console.log(`  tamanho gravado: ${plain.readData().length}`);

  console.log("\n== 2) Compressão + criptografia + log (empilhados) ==");
  // Ordem importa: comprimir ANTES de criptografar (dado criptografado não comprime).
  const storage = new MemoryDataSource();
  const source: DataSource = new LoggingDecorator(
    new CompressionDecorator(new EncryptionDecorator(storage, "segredo")),
  );

  source.writeData(text);
  console.log(`  armazenado de fato: ${storage.readData().length} caracteres (base64 cifrado)`);
  console.log(`  início do armazenado: ${storage.readData().slice(0, 30)}...`);

  const recovered = source.readData();
  console.log(`  recuperado igual ao original? ${recovered === text}`);

  console.log("\n== 3) Outra combinação, só criptografia ==");
  const onlyEncrypted = new EncryptionDecorator(new MemoryDataSource(), "outra-senha");
  onlyEncrypted.writeData("dado secreto");
  console.log(`  lido: ${onlyEncrypted.readData()}`);
}

main();

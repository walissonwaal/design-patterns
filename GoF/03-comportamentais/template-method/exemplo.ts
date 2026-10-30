/**
 * Template Method — exemplo: importação de dados em CSV e JSON.
 *
 * A superclasse define o ESQUELETO do algoritmo (parse → validate → save → fim).
 * As subclasses preenchem só os passos que variam, sem poder mudar a ordem.
 *
 * Executar: npx tsx 03-comportamentais/template-method/exemplo.ts
 */

interface Row {
  name: string;
  email: string;
}

interface Report {
  total: number;
  saved: number;
  discarded: number;
}

abstract class DataImporter {
  // TEMPLATE METHOD: define a sequência. Não deve ser sobrescrito pelas subclasses.
  import(raw: string): Report {
    const rows = this.parse(raw); // passo abstrato (obrigatório)
    const valid = this.validate(rows); // hook com comportamento padrão
    this.save(valid); // passo comum, já implementado
    const report = { total: rows.length, saved: valid.length, discarded: rows.length - valid.length };
    this.onFinish(report); // hook vazio por padrão
    return report;
  }

  // Passo ABSTRATO: cada formato implementa o seu.
  protected abstract parse(raw: string): Row[];

  // HOOK com implementação padrão: sobrescrever é opcional.
  protected validate(rows: Row[]): Row[] {
    return rows.filter((row) => row.name !== "");
  }

  // Passo comum a todas as subclasses.
  protected save(rows: Row[]): void {
    for (const row of rows) console.log(`    💾 salvando ${row.name} <${row.email}>`);
  }

  // HOOK vazio: ponto de extensão opcional.
  protected onFinish(_report: Report): void {}
}

// Subclasse #1: só implementa o passo obrigatório.
class CsvImporter extends DataImporter {
  protected parse(raw: string): Row[] {
    return raw
      .trim()
      .split("\n")
      .slice(1) // ignora o cabeçalho
      .map((line) => {
        const [name = "", email = ""] = line.split(",").map((cell) => cell.trim());
        return { name, email };
      });
  }
}

// Subclasse #2: implementa o passo obrigatório E sobrescreve dois hooks.
class JsonImporter extends DataImporter {
  protected parse(raw: string): Row[] {
    return (JSON.parse(raw) as Partial<Row>[]).map((item) => ({
      name: item.name ?? "",
      email: item.email ?? "",
    }));
  }

  // Validação mais rígida: exige e-mail com "@".
  protected override validate(rows: Row[]): Row[] {
    return super.validate(rows).filter((row) => row.email.includes("@"));
  }

  protected override onFinish(report: Report): void {
    console.log(`    📋 JSON: ${report.saved}/${report.total} importados, ${report.discarded} descartados`);
  }
}

function main(): void {
  const csv = `nome,email
Ana,ana@exemplo.com
,sem-nome@exemplo.com
Beto,beto@exemplo.com`;

  const json = JSON.stringify([
    { name: "Caio", email: "caio@exemplo.com" },
    { name: "Dani", email: "email-invalido" },
    { name: "Edu", email: "edu@exemplo.com" },
  ]);

  console.log("== Importando CSV ==");
  console.log("  relatório:", new CsvImporter().import(csv));

  console.log("\n== Importando JSON ==");
  console.log("  relatório:", new JsonImporter().import(json));
}

main();

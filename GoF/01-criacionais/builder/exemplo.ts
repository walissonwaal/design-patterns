/**
 * Builder — exemplo: construtor de consultas (SQL e MongoDB).
 *
 * Um objeto complexo é montado passo a passo. O MESMO processo de construção
 * gera representações diferentes (uma string SQL ou um objeto de consulta Mongo).
 *
 * Executar: npx tsx 01-criacionais/builder/exemplo.ts
 */

type Operator = "=" | ">" | "<";
type Value = string | number;

// Interface do Builder: os passos de construção. <T> é o tipo do produto final.
interface QueryBuilder<T> {
  reset(): this;
  from(source: string): this;
  select(...fields: string[]): this;
  where(field: string, op: Operator, value: Value): this;
  limit(n: number): this;
  build(): T;
}

// ---------------------------------------------------------------------------
// Builder concreto #1: produz uma string SQL
// ---------------------------------------------------------------------------
class SqlQueryBuilder implements QueryBuilder<string> {
  private table = "";
  private fields: string[] = [];
  private conditions: string[] = [];
  private max?: number;

  reset(): this {
    this.table = "";
    this.fields = [];
    this.conditions = [];
    this.max = undefined;
    return this;
  }

  from(source: string): this {
    this.table = source;
    return this;
  }

  select(...fields: string[]): this {
    this.fields.push(...fields);
    return this;
  }

  where(field: string, op: Operator, value: Value): this {
    const literal = typeof value === "string" ? `'${value}'` : value;
    this.conditions.push(`${field} ${op} ${literal}`);
    return this;
  }

  limit(n: number): this {
    this.max = n;
    return this;
  }

  build(): string {
    const columns = this.fields.length > 0 ? this.fields.join(", ") : "*";
    let sql = `SELECT ${columns} FROM ${this.table}`;
    if (this.conditions.length > 0) sql += ` WHERE ${this.conditions.join(" AND ")}`;
    if (this.max !== undefined) sql += ` LIMIT ${this.max}`;
    return sql;
  }
}

// ---------------------------------------------------------------------------
// Builder concreto #2: produz um objeto de consulta MongoDB (outro produto!)
// ---------------------------------------------------------------------------
interface MongoQuery {
  collection: string;
  filter: Record<string, Value | { $gt?: Value; $lt?: Value }>;
  projection: Record<string, 1>;
  limit?: number;
}

class MongoQueryBuilder implements QueryBuilder<MongoQuery> {
  private query: MongoQuery = { collection: "", filter: {}, projection: {} };

  reset(): this {
    this.query = { collection: "", filter: {}, projection: {} };
    return this;
  }

  from(source: string): this {
    this.query.collection = source;
    return this;
  }

  select(...fields: string[]): this {
    for (const f of fields) this.query.projection[f] = 1;
    return this;
  }

  where(field: string, op: Operator, value: Value): this {
    this.query.filter[field] =
      op === "=" ? value : op === ">" ? { $gt: value } : { $lt: value };
    return this;
  }

  limit(n: number): this {
    this.query.limit = n;
    return this;
  }

  build(): MongoQuery {
    return this.query;
  }
}

// ---------------------------------------------------------------------------
// Diretor: conhece RECEITAS prontas. Trabalha com qualquer builder.
// ---------------------------------------------------------------------------
class QueryDirector {
  static activeUsers<T>(builder: QueryBuilder<T>): T {
    return builder
      .reset()
      .from("users")
      .select("name", "email")
      .where("active", "=", 1)
      .limit(10)
      .build();
  }

  static expensiveProducts<T>(builder: QueryBuilder<T>): T {
    return builder.reset().from("products").where("price", ">", 1000).build();
  }
}

function main(): void {
  console.log("== Via Diretor (receitas prontas) ==");
  console.log(QueryDirector.activeUsers(new SqlQueryBuilder()));
  console.log(QueryDirector.activeUsers(new MongoQueryBuilder()));
  console.log(QueryDirector.expensiveProducts(new SqlQueryBuilder()));

  console.log("\n== Sem Diretor: o cliente monta passo a passo (fluent) ==");
  const sql = new SqlQueryBuilder()
    .from("orders")
    .select("id", "total")
    .where("status", "=", "pago")
    .where("total", ">", 500)
    .limit(5)
    .build();
  console.log(sql);
}

main();

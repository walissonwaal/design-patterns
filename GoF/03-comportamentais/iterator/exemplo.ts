/**
 * Iterator — exemplo: playlist e árvore binária percorridas sem expor sua estrutura.
 *
 * JavaScript/TypeScript tem o padrão embutido na linguagem: um objeto
 * "iterável" implementa [Symbol.iterator](), que devolve um "iterador"
 * com next(). O `for...of`, o spread (...) e Array.from() usam esse protocolo.
 *
 * Executar: npx tsx 03-comportamentais/iterator/exemplo.ts
 */

interface Song {
  title: string;
  artist: string;
}

// Iteradores concretos: cada um guarda SUA posição e uma estratégia de percurso.
class ForwardIterator<T> implements Iterator<T> {
  private position = 0;

  constructor(private readonly items: readonly T[]) {}

  next(): IteratorResult<T> {
    if (this.position < this.items.length) {
      return { done: false, value: this.items[this.position++]! };
    }
    return { done: true, value: undefined };
  }
}

class ReverseIterator<T> implements Iterator<T> {
  private position: number;

  constructor(private readonly items: readonly T[]) {
    this.position = items.length - 1;
  }

  next(): IteratorResult<T> {
    if (this.position >= 0) {
      return { done: false, value: this.items[this.position--]! };
    }
    return { done: true, value: undefined };
  }
}

// Coleção: esconde como guarda as músicas (array interno) e oferece iteradores.
class Playlist implements Iterable<Song> {
  private readonly songs: Song[] = [];

  add(title: string, artist: string): this {
    this.songs.push({ title, artist });
    return this;
  }

  // Iterador padrão (ordem de inclusão).
  [Symbol.iterator](): Iterator<Song> {
    return new ForwardIterator(this.songs);
  }

  // Outro percurso sobre a MESMA coleção.
  reversed(): Iterable<Song> {
    return { [Symbol.iterator]: () => new ReverseIterator(this.songs) };
  }

  // Terceiro percurso, escrito com um generator (jeito mais curto em TS/JS).
  *byArtist(artist: string): Generator<Song> {
    for (const song of this.songs) {
      if (song.artist === artist) yield song;
    }
  }
}

// ---------------------------------------------------------------------------
// Estrutura NÃO linear: árvore binária de busca percorrida em ordem (in-order).
// O cliente usa `for...of` e não precisa saber nada sobre recursão ou nós.
// ---------------------------------------------------------------------------
class TreeNode<T> implements Iterable<T> {
  private left?: TreeNode<T>;
  private right?: TreeNode<T>;

  constructor(private readonly value: T) {}

  insert(value: T): this {
    if (value < this.value) {
      if (this.left) this.left.insert(value);
      else this.left = new TreeNode(value);
    } else if (this.right) {
      this.right.insert(value);
    } else {
      this.right = new TreeNode(value);
    }
    return this;
  }

  *[Symbol.iterator](): Generator<T> {
    if (this.left) yield* this.left;
    yield this.value;
    if (this.right) yield* this.right;
  }
}

function main(): void {
  const playlist = new Playlist()
    .add("Bohemian Rhapsody", "Queen")
    .add("Garota de Ipanema", "Tom Jobim")
    .add("Under Pressure", "Queen")
    .add("Aquarela", "Toquinho");

  console.log("== for...of (iterador padrão) ==");
  for (const song of playlist) console.log(`  ${song.title}`);

  console.log("\n== Percurso reverso ==");
  for (const song of playlist.reversed()) console.log(`  ${song.title}`);

  console.log("\n== Só uma artista (generator) ==");
  console.log("  " + [...playlist.byArtist("Queen")].map((s) => s.title).join(" | "));

  console.log("\n== Uso manual do protocolo (o que for...of faz por dentro) ==");
  const iterator = playlist[Symbol.iterator]();
  let step = iterator.next();
  while (!step.done) {
    console.log(`  next() → ${step.value.title}`);
    step = iterator.next();
  }
  console.log(`  next() → done = ${step.done}`);

  console.log("\n== Árvore binária percorrida em ordem ==");
  const tree = new TreeNode(50).insert(30).insert(70).insert(20).insert(40).insert(60).insert(80);
  console.log("  " + [...tree].join(", "));
}

main();

/**
 * Abstract Factory — exemplo: kit de interface gráfica multiplataforma.
 *
 * Cada sistema operacional tem uma FAMÍLIA de widgets (botão + checkbox).
 * A aplicação pede os widgets a uma fábrica e nunca mistura famílias.
 *
 * Executar: npx tsx 01-criacionais/abstract-factory/exemplo.ts
 */

// ---------------------------------------------------------------------------
// Interfaces dos produtos (um "tipo" de produto = uma interface)
// ---------------------------------------------------------------------------
interface Button {
  render(): string;
}

interface Checkbox {
  render(): string;
  toggle(): void;
}

// ---------------------------------------------------------------------------
// Família Windows
// ---------------------------------------------------------------------------
class WindowsButton implements Button {
  render(): string {
    return "[ Botão estilo Windows ]";
  }
}

class WindowsCheckbox implements Checkbox {
  private checked = false;
  toggle(): void {
    this.checked = !this.checked;
  }
  render(): string {
    return `[${this.checked ? "X" : " "}] Checkbox estilo Windows`;
  }
}

// ---------------------------------------------------------------------------
// Família macOS
// ---------------------------------------------------------------------------
class MacButton implements Button {
  render(): string {
    return "( Botão estilo macOS )";
  }
}

class MacCheckbox implements Checkbox {
  private checked = false;
  toggle(): void {
    this.checked = !this.checked;
  }
  render(): string {
    return `(${this.checked ? "✔" : " "}) Checkbox estilo macOS`;
  }
}

// ---------------------------------------------------------------------------
// Fábrica abstrata: um método de criação para CADA produto da família
// ---------------------------------------------------------------------------
interface GUIFactory {
  createButton(): Button;
  createCheckbox(): Checkbox;
}

class WindowsFactory implements GUIFactory {
  createButton(): Button {
    return new WindowsButton();
  }
  createCheckbox(): Checkbox {
    return new WindowsCheckbox();
  }
}

class MacFactory implements GUIFactory {
  createButton(): Button {
    return new MacButton();
  }
  createCheckbox(): Checkbox {
    return new MacCheckbox();
  }
}

// ---------------------------------------------------------------------------
// Cliente: só conhece GUIFactory, Button e Checkbox (as abstrações)
// ---------------------------------------------------------------------------
class Application {
  private readonly button: Button;
  private readonly checkbox: Checkbox;

  constructor(factory: GUIFactory) {
    this.button = factory.createButton();
    this.checkbox = factory.createCheckbox();
  }

  paint(): void {
    this.checkbox.toggle();
    console.log("  " + this.button.render());
    console.log("  " + this.checkbox.render());
  }
}

// Único ponto do sistema que conhece as fábricas concretas.
function createFactoryFor(os: "windows" | "macos"): GUIFactory {
  switch (os) {
    case "windows":
      return new WindowsFactory();
    case "macos":
      return new MacFactory();
  }
}

function main(): void {
  for (const os of ["windows", "macos"] as const) {
    console.log(`Renderizando para ${os}:`);
    new Application(createFactoryFor(os)).paint();
    console.log();
  }
}

main();

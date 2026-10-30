/**
 * Bridge — exemplo: controles remotos × dispositivos.
 *
 * Duas hierarquias independentes:
 *   - Abstração:     RemoteControl, AdvancedRemoteControl
 *   - Implementação: Tv, Radio
 * Sem o Bridge seriam 4 classes (BasicTvRemote, AdvancedTvRemote, ...), crescendo
 * em PRODUTO a cada novo item. Com o Bridge crescem em SOMA.
 *
 * Executar: npx tsx 02-estruturais/bridge/exemplo.ts
 */

// ---------------------------------------------------------------------------
// Implementação: interface que todo dispositivo deve cumprir
// ---------------------------------------------------------------------------
interface Device {
  isEnabled(): boolean;
  enable(): void;
  disable(): void;
  getVolume(): number;
  setVolume(percent: number): void;
  getChannel(): number;
  setChannel(channel: number): void;
}

class Tv implements Device {
  private on = false;
  private volume = 30;
  private channel = 1;

  isEnabled(): boolean { return this.on; }
  enable(): void { this.on = true; }
  disable(): void { this.on = false; }
  getVolume(): number { return this.volume; }
  setVolume(percent: number): void { this.volume = clamp(percent); }
  getChannel(): number { return this.channel; }
  setChannel(channel: number): void { this.channel = channel; }
}

class Radio implements Device {
  private on = false;
  private volume = 50;
  private station = 981; // 98.1 FM

  isEnabled(): boolean { return this.on; }
  enable(): void { this.on = true; }
  disable(): void { this.on = false; }
  getVolume(): number { return this.volume; }
  setVolume(percent: number): void { this.volume = clamp(percent); }
  getChannel(): number { return this.station; }
  setChannel(channel: number): void { this.station = channel; }
}

function clamp(percent: number): number {
  return Math.max(0, Math.min(100, percent));
}

// ---------------------------------------------------------------------------
// Abstração: lógica de alto nível. Guarda uma REFERÊNCIA (a "ponte") ao Device
// e delega o trabalho real a ele.
// ---------------------------------------------------------------------------
class RemoteControl {
  constructor(protected readonly device: Device) {}

  togglePower(): void {
    if (this.device.isEnabled()) this.device.disable();
    else this.device.enable();
    console.log(`  power → ${this.device.isEnabled() ? "ligado" : "desligado"}`);
  }

  volumeUp(): void {
    this.device.setVolume(this.device.getVolume() + 10);
    console.log(`  volume → ${this.device.getVolume()}%`);
  }

  volumeDown(): void {
    this.device.setVolume(this.device.getVolume() - 10);
    console.log(`  volume → ${this.device.getVolume()}%`);
  }

  channelUp(): void {
    this.device.setChannel(this.device.getChannel() + 1);
    console.log(`  canal → ${this.device.getChannel()}`);
  }
}

// Abstração refinada: estende a abstração SEM tocar nos dispositivos.
class AdvancedRemoteControl extends RemoteControl {
  mute(): void {
    this.device.setVolume(0);
    console.log("  mudo 🔇");
  }
}

function main(): void {
  console.log("Controle básico + TV:");
  const tvRemote = new RemoteControl(new Tv());
  tvRemote.togglePower();
  tvRemote.volumeUp();
  tvRemote.channelUp();

  console.log("\nControle avançado + Rádio (combinação nova, zero código novo):");
  const radioRemote = new AdvancedRemoteControl(new Radio());
  radioRemote.togglePower();
  radioRemote.volumeDown();
  radioRemote.mute();
}

main();

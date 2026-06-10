import * as Phaser from 'phaser';

const CANVAS_W = 800;
const CANVAS_H = 600;

const BTN_COLOR = 0x333333;
const BTN_ACTIVE_COLOR = 0x5588cc;
const BTN_ALPHA = 0.5;
const BTN_ACTIVE_ALPHA = 0.8;

type Dir = 'up' | 'down' | 'left' | 'right';

/**
 * Touch-only virtual gamepad: D-pad (left) + action button "A" (right) +
 * choice buttons "1"/"2"/"3" (right, shown only while a choice panel is open).
 * Drawn purely with Graphics-based shapes — no external images.
 */
export class VirtualPad {
  readonly enabled: boolean;

  private dx = 0;
  private dy = 0;
  private actionJustPressed = false;
  private choiceJustPressed: number | null = null;

  private choiceButtons: { circle: Phaser.GameObjects.Arc; text: Phaser.GameObjects.Text }[] = [];

  constructor(private scene: Phaser.Scene) {
    this.enabled = !!scene.sys.game.device.input.touch;
    if (this.enabled) this.build();
  }

  private build() {
    this.scene.input.addPointer(3);
    this.buildDpad();
    this.buildActionButton();
    this.buildChoiceButtons();
  }

  private addButton(
    x: number, y: number, r: number, label: string, fontSize: string,
    onDown: () => void, onUp?: () => void,
  ): { circle: Phaser.GameObjects.Arc; text: Phaser.GameObjects.Text } {
    const circle = this.scene.add.circle(x, y, r, BTN_COLOR, BTN_ALPHA)
      .setScrollFactor(0).setDepth(200).setInteractive();
    const text = this.scene.add.text(x, y, label, {
      fontSize, color: '#ffffff', fontFamily: 'monospace', fontStyle: 'bold',
    }).setOrigin(0.5).setScrollFactor(0).setDepth(201);

    const release = () => {
      circle.setFillStyle(BTN_COLOR, BTN_ALPHA);
      onUp?.();
    };
    circle.on('pointerdown', () => {
      circle.setFillStyle(BTN_ACTIVE_COLOR, BTN_ACTIVE_ALPHA);
      onDown();
    });
    circle.on('pointerup', release);
    circle.on('pointerout', release);

    return { circle, text };
  }

  private buildDpad() {
    const cx = 80, cy = 535, r = 22, gap = 46;
    const dirs: { dir: Dir; x: number; y: number; label: string }[] = [
      { dir: 'up',    x: cx,       y: cy - gap, label: '▲' },
      { dir: 'down',  x: cx,       y: cy + gap, label: '▼' },
      { dir: 'left',  x: cx - gap, y: cy,       label: '◀' },
      { dir: 'right', x: cx + gap, y: cy,       label: '▶' },
    ];
    for (const d of dirs) {
      this.addButton(d.x, d.y, r, d.label, '18px',
        () => this.setDir(d.dir, true),
        () => this.setDir(d.dir, false));
    }
  }

  private setDir(dir: Dir, pressed: boolean) {
    if (dir === 'up')    this.dy = pressed ? -1 : (this.dy === -1 ? 0 : this.dy);
    if (dir === 'down')  this.dy = pressed ?  1 : (this.dy ===  1 ? 0 : this.dy);
    if (dir === 'left')  this.dx = pressed ? -1 : (this.dx === -1 ? 0 : this.dx);
    if (dir === 'right') this.dx = pressed ?  1 : (this.dx ===  1 ? 0 : this.dx);
  }

  private buildActionButton() {
    const x = CANVAS_W - 60, y = 535, r = 32;
    this.addButton(x, y, r, 'A', '22px', () => { this.actionJustPressed = true; });
  }

  private buildChoiceButtons() {
    const r = 24;
    const positions = [
      { x: CANVAS_W - 220, y: 460 },
      { x: CANVAS_W - 150, y: 460 },
      { x: CANVAS_W - 80,  y: 460 },
    ];
    for (let i = 0; i < 3; i++) {
      const { circle, text } = this.addButton(positions[i].x, positions[i].y, r, String(i + 1), '20px',
        () => { this.choiceJustPressed = i + 1; });
      circle.setVisible(false);
      text.setVisible(false);
      this.choiceButtons.push({ circle, text });
    }
  }

  setChoiceButtonsVisible(visible: boolean) {
    if (!this.enabled) return;
    for (const b of this.choiceButtons) {
      b.circle.setVisible(visible);
      b.text.setVisible(visible);
    }
  }

  getDirection(): { dx: number; dy: number } {
    return { dx: this.dx, dy: this.dy };
  }

  isActionPressed(): boolean {
    const v = this.actionJustPressed;
    this.actionJustPressed = false;
    return v;
  }

  getChoicePressed(): number | null {
    const v = this.choiceJustPressed;
    this.choiceJustPressed = null;
    return v;
  }
}

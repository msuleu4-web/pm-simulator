import * as Phaser from 'phaser';

const BTN_COLOR = 0x333333;
const BTN_ACTIVE_COLOR = 0x5588cc;
const BTN_ALPHA = 0.5;
const BTN_ACTIVE_ALPHA = 0.8;

type Dir = 'up' | 'down' | 'left' | 'right';

const DPAD_DIRS: Dir[] = ['up', 'down', 'left', 'right'];
const DPAD_LABEL: Record<Dir, string> = { up: '▲', down: '▼', left: '◀', right: '▶' };

/**
 * Touch-only virtual gamepad: D-pad (left) + action button "A" (right) +
 * choice buttons "1"/"2"/"3" (right, shown only while a choice panel is open).
 * Drawn purely with Graphics-based shapes — no external images.
 * All buttons are screen-space (scrollFactor 0) and repositioned via layout()
 * whenever the canvas size changes (Phaser.Scale.RESIZE).
 */
export class VirtualPad {
  readonly enabled: boolean;

  private dx = 0;
  private dy = 0;
  private actionJustPressed = false;
  private choiceJustPressed: number | null = null;

  private choiceButtons: { circle: Phaser.GameObjects.Arc; text: Phaser.GameObjects.Text }[] = [];
  private dpadButtons: { circle: Phaser.GameObjects.Arc; text: Phaser.GameObjects.Text }[] = [];
  private actionButton?: { circle: Phaser.GameObjects.Arc; text: Phaser.GameObjects.Text };

  private resizeHandler = (gameSize: Phaser.Structs.Size) => this.layout(gameSize.width, gameSize.height);

  constructor(private scene: Phaser.Scene) {
    this.enabled = !!scene.sys.game.device.input.touch;
    if (this.enabled) this.build();
  }

  private build() {
    this.scene.input.addPointer(3);
    this.buildDpad();
    this.buildActionButton();
    this.buildChoiceButtons();
    this.layout(this.scene.scale.width, this.scene.scale.height);
    this.scene.scale.on('resize', this.resizeHandler);
    this.scene.events.once('shutdown', () => this.scene.scale.off('resize', this.resizeHandler));
  }

  /** Reposition all buttons for the given canvas size (bottom-anchored). */
  private layout(w: number, h: number) {
    const cx = 70, cy = h - 90, gap = 46;
    const dirPos: Record<Dir, [number, number]> = {
      up: [cx, cy - gap],
      down: [cx, cy + gap],
      left: [cx - gap, cy],
      right: [cx + gap, cy],
    };
    this.dpadButtons.forEach((b, i) => {
      const [x, y] = dirPos[DPAD_DIRS[i]];
      b.circle.setPosition(x, y);
      b.text.setPosition(x, y);
    });

    if (this.actionButton) {
      const x = w - 50, y = h - 60;
      this.actionButton.circle.setPosition(x, y);
      this.actionButton.text.setPosition(x, y);
    }

    const choicePos = [
      { x: w - 220, y: h - 140 },
      { x: w - 150, y: h - 140 },
      { x: w - 80, y: h - 140 },
    ];
    this.choiceButtons.forEach((b, i) => {
      b.circle.setPosition(choicePos[i].x, choicePos[i].y);
      b.text.setPosition(choicePos[i].x, choicePos[i].y);
    });
  }

  private addButton(
    r: number, label: string, fontSize: string,
    onDown: () => void, onUp?: () => void,
  ): { circle: Phaser.GameObjects.Arc; text: Phaser.GameObjects.Text } {
    const circle = this.scene.add.circle(0, 0, r, BTN_COLOR, BTN_ALPHA)
      .setScrollFactor(0).setDepth(200).setInteractive();
    const text = this.scene.add.text(0, 0, label, {
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
    const r = 22;
    for (const dir of DPAD_DIRS) {
      this.dpadButtons.push(this.addButton(r, DPAD_LABEL[dir], '18px',
        () => this.setDir(dir, true),
        () => this.setDir(dir, false)));
    }
  }

  private setDir(dir: Dir, pressed: boolean) {
    if (dir === 'up')    this.dy = pressed ? -1 : (this.dy === -1 ? 0 : this.dy);
    if (dir === 'down')  this.dy = pressed ?  1 : (this.dy ===  1 ? 0 : this.dy);
    if (dir === 'left')  this.dx = pressed ? -1 : (this.dx === -1 ? 0 : this.dx);
    if (dir === 'right') this.dx = pressed ?  1 : (this.dx ===  1 ? 0 : this.dx);
  }

  private buildActionButton() {
    this.actionButton = this.addButton(32, 'A', '22px', () => { this.actionJustPressed = true; });
  }

  private buildChoiceButtons() {
    const r = 24;
    for (let i = 0; i < 3; i++) {
      const { circle, text } = this.addButton(r, String(i + 1), '20px',
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

  setDpadVisible(visible: boolean) {
    if (!this.enabled) return;
    for (const b of this.dpadButtons) {
      b.circle.setVisible(visible);
      b.text.setVisible(visible);
    }
    if (!visible) { this.dx = 0; this.dy = 0; }
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

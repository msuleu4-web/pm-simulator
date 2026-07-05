import * as Phaser from 'phaser';

// ── Constants ───────────────────────────────────────────────────────────────

const TILE = 32;
const COLS = 20;
const ROWS = 16;
const GAME_W = COLS * TILE; // 640
const GAME_H = ROWS * TILE; // 512
const PLAYER_SPEED = 160;
const TOTAL_TICKETS = 5;
const TIME_LIMIT = 90;

// Tile type codes
const F = 0; // floor
const W = 1; // wall
const E = 2; // exit (drawn as floor, exit zone drawn on top)
const D = 3; // desk / chair obstacle (solid like wall, different visual)

// ── Tile map (20 cols × 16 rows) ────────────────────────────────────────────

const TILE_MAP: number[][] = [
  [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W],
  [W,F,F,F,W,F,F,F,F,F,F,F,F,F,F,F,F,F,F,W],
  [W,F,F,F,W,F,D,D,F,F,F,F,F,F,F,D,D,F,F,W], // desks in top corridor
  [W,F,F,F,F,F,F,F,W,W,W,W,W,F,F,F,F,F,F,W],
  [W,F,F,F,F,F,F,F,W,F,F,F,W,F,F,F,F,F,F,W],
  [W,W,W,F,F,F,F,F,W,F,F,F,F,F,F,F,F,F,F,W],
  [W,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,W,W,W],
  [W,F,D,D,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,W], // desk cluster left
  [W,F,F,F,F,F,W,W,F,F,F,F,F,F,F,F,F,F,F,W],
  [W,F,F,F,F,F,W,F,F,F,D,F,F,W,W,W,W,W,F,W], // single desk mid
  [W,F,F,F,F,F,W,F,F,F,F,F,F,W,F,F,F,F,F,W],
  [W,W,W,W,F,F,F,F,F,F,F,F,F,W,F,F,F,F,F,W],
  [W,F,F,F,F,F,F,F,F,F,F,F,F,W,F,F,F,F,F,W],
  [W,F,F,F,F,F,F,D,D,F,F,F,F,F,F,F,F,F,F,W], // desk pair bottom
  [W,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,F,E,F,W],
  [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W],
];

// Ticket positions [col, row]
const TICKET_POSITIONS: [number, number][] = [
  [3, 1],   // top-left room
  [15, 1],  // top-right corridor
  [9, 4],   // inside middle room
  [1, 12],  // bottom-left area
  [16, 11], // bottom-right area (behind right wall)
];

// Exit tile position
const EXIT_COL = 17;
const EXIT_ROW = 14;

// Enemy patrol: [startCol, endCol, row, speed px/s]
const ENEMY_PATROLS: [number, number, number, number][] = [
  [1, 5, 6, 80],
  [8, 16, 7, 100],
  [1, 5, 13, 70],
  [14, 18, 12, 90],
];

// ── Color palette ────────────────────────────────────────────────────────────

const C = {
  floor:      0x1a2535,
  floorLine:  0x1e2d40,
  wall:       0x3a4a6b,
  wallEdge:   0x4a5a7b,
  desk:       0x5c3a1e, // office desk / chair
  deskEdge:   0x7a5230,
  player:     0x44ff88,
  playerFill: 0x0a2218,
  enemy:      0xff3333,
  enemyFill:  0x220808,
  ticket:     0xffcc00,
  ticketFill: 0x2a1e00,
  exitLocked: 0x224455,
  exitOpen:   0x00aaff,
  hudBg:      0x000a15,
};

// ── Ticket tracking object ───────────────────────────────────────────────────

interface TicketObj {
  col: number;
  row: number;
  gfx: Phaser.GameObjects.Graphics;
  label: Phaser.GameObjects.Text;
  active: boolean;
}

// ── Scene ────────────────────────────────────────────────────────────────────

export class SierDungeonScene extends Phaser.Scene {
  // Physics objects
  private player!: Phaser.Physics.Arcade.Image;
  private walls!: Phaser.Physics.Arcade.StaticGroup;
  private enemies!: Phaser.Physics.Arcade.Group;

  // State
  private ticketsCollected = 0;
  private timeRemaining = TIME_LIMIT;
  private gameActive = true;
  private exitUnlocked = false;
  private tickets: TicketObj[] = [];
  private enemyDirs: number[] = []; // +1 = right, -1 = left

  // Visuals (redrawn each frame or on event)
  private mapGfx!: Phaser.GameObjects.Graphics;
  private exitGfx!: Phaser.GameObjects.Graphics;
  private entityGfx!: Phaser.GameObjects.Graphics;
  private exitLabel!: Phaser.GameObjects.Text;
  private playerLabel!: Phaser.GameObjects.Text;
  private enemyLabels: Phaser.GameObjects.Text[] = [];

  // HUD
  private ticketHud!: Phaser.GameObjects.Text;
  private timerHud!: Phaser.GameObjects.Text;

  // Input
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keyW!: Phaser.Input.Keyboard.Key;
  private keyA!: Phaser.Input.Keyboard.Key;
  private keyS!: Phaser.Input.Keyboard.Key;
  private keyD!: Phaser.Input.Keyboard.Key;

  constructor() {
    super({ key: 'SierDungeonScene' });
  }

  // ── Preload: generate a 1×1 white pixel texture (no external assets) ──────

  preload() {
    if (!this.textures.exists('px')) {
      const g = this.make.graphics({ x: 0, y: 0 }, false);
      g.fillStyle(0xffffff);
      g.fillRect(0, 0, 1, 1);
      g.generateTexture('px', 1, 1);
      g.destroy();
    }
  }

  // ── Create: runs on scene start and after scene.restart() ────────────────

  create() {
    // Reset all mutable state (important for scene.restart())
    this.ticketsCollected = 0;
    this.timeRemaining = TIME_LIMIT;
    this.gameActive = true;
    this.exitUnlocked = false;
    this.tickets = [];
    this.enemyDirs = [];
    this.enemyLabels = [];

    this.physics.world.setBounds(0, 0, GAME_W, GAME_H);

    // Build scene from back to front
    this.mapGfx    = this.add.graphics().setDepth(0);
    this.exitGfx   = this.add.graphics().setDepth(1);
    this.entityGfx = this.add.graphics().setDepth(5);

    this.drawMap();
    this.createWalls();
    this.createExit();
    this.createTickets();
    this.createPlayer();
    this.createEnemies();
    this.createHud();
    this.setupInput();

    // Player is blocked by walls
    this.physics.add.collider(this.player, this.walls);

    // Enemies are blocked by walls (direction reversal handled in updateEnemyPatrol)
    this.physics.add.collider(this.enemies, this.walls);

    // Player is physically blocked by enemies; contact = game over
    this.physics.add.collider(this.player, this.enemies, () => {
      if (this.gameActive) this.triggerGameOver(false);
    });

    // 1-second countdown tick
    this.time.addEvent({
      delay: 1000,
      callback: this.tickTimer,
      callbackScope: this,
      loop: true,
    });
  }

  // ── Draw map tiles once (static, never redrawn) ──────────────────────────

  private drawMap() {
    const g = this.mapGfx;
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const x = col * TILE;
        const y = row * TILE;
        if (TILE_MAP[row][col] === W) {
          g.fillStyle(C.wall).fillRect(x, y, TILE, TILE);
          g.lineStyle(1, C.wallEdge, 0.7).strokeRect(x + 0.5, y + 0.5, TILE - 1, TILE - 1);
        } else if (TILE_MAP[row][col] === D) {
          // Draw floor beneath, then desk on top
          g.fillStyle(C.floor).fillRect(x, y, TILE, TILE);
          g.fillStyle(C.desk).fillRect(x + 3, y + 3, TILE - 6, TILE - 6);
          g.lineStyle(1, C.deskEdge, 0.9).strokeRect(x + 3, y + 3, TILE - 6, TILE - 6);
          // Desk surface detail line
          g.lineStyle(1, C.deskEdge, 0.4).lineBetween(x + 5, y + TILE / 2, x + TILE - 5, y + TILE / 2);
        } else {
          g.fillStyle(C.floor).fillRect(x, y, TILE, TILE);
          g.lineStyle(1, C.floorLine, 0.25).strokeRect(x, y, TILE, TILE);
        }
      }
    }
  }

  // ── Create invisible static physics bodies for every wall tile ────────────

  private createWalls() {
    this.walls = this.physics.add.staticGroup();
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        // Both walls and desks are solid physics obstacles
        if (TILE_MAP[row][col] !== W && TILE_MAP[row][col] !== D) continue;
        const cx = col * TILE + TILE / 2;
        const cy = row * TILE + TILE / 2;
        // staticGroup.create() uses the 'px' texture; we resize the physics body to one tile
        const body = this.walls.create(cx, cy, 'px') as Phaser.Physics.Arcade.Image;
        body.setDisplaySize(TILE, TILE).setVisible(false).refreshBody();
      }
    }
  }

  // ── Exit zone (drawn on top of floor tile, color changes on unlock) ───────

  private createExit() {
    const cx = EXIT_COL * TILE + TILE / 2;
    const cy = EXIT_ROW * TILE + TILE / 2;
    this.exitLabel = this.add.text(cx, cy, 'EXIT', {
      fontSize: '10px', color: '#335566', fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(3);
    this.drawExit(false);
  }

  private drawExit(unlocked: boolean) {
    const g = this.exitGfx;
    g.clear();
    const x = EXIT_COL * TILE;
    const y = EXIT_ROW * TILE;
    const color = unlocked ? C.exitOpen : C.exitLocked;
    const alpha = unlocked ? 0.7 : 0.35;
    g.fillStyle(color, alpha).fillRect(x + 2, y + 2, TILE - 4, TILE - 4);
    g.lineStyle(2, color, 1).strokeRect(x + 1, y + 1, TILE - 2, TILE - 2);
    this.exitLabel?.setColor(unlocked ? '#44aaff' : '#335566');
  }

  // ── Tickets (yellow squares with "T" label) ───────────────────────────────

  private createTickets() {
    for (const [col, row] of TICKET_POSITIONS) {
      const cx = col * TILE + TILE / 2;
      const cy = row * TILE + TILE / 2;
      const s = 14; // half-size

      const gfx = this.add.graphics().setDepth(2);
      gfx.fillStyle(C.ticketFill).fillRect(cx - s, cy - s, s * 2, s * 2);
      gfx.lineStyle(2, C.ticket).strokeRect(cx - s + 1, cy - s + 1, s * 2 - 2, s * 2 - 2);

      const label = this.add.text(cx, cy, 'T', {
        fontSize: '12px', color: '#ffcc00', fontStyle: 'bold',
      }).setOrigin(0.5).setDepth(3);

      this.tickets.push({ col, row, gfx, label, active: true });
    }
  }

  // ── Player (green square, physics body) ──────────────────────────────────

  private createPlayer() {
    const startX = 1 * TILE + TILE / 2;
    const startY = 1 * TILE + TILE / 2;
    this.player = this.physics.add.image(startX, startY, 'px');
    this.player.setDisplaySize(TILE - 6, TILE - 6).setVisible(false).setCollideWorldBounds(true);

    this.playerLabel = this.add.text(startX, startY, 'SE', {
      fontSize: '11px', color: '#44ff88', fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(6);
  }

  // ── Enemies (red squares, horizontal patrol) ──────────────────────────────

  private createEnemies() {
    this.enemies = this.physics.add.group();
    for (const [startCol, , row] of ENEMY_PATROLS) {
      const x = startCol * TILE + TILE / 2;
      const y = row * TILE + TILE / 2;
      const enemy = this.physics.add.image(x, y, 'px');
      enemy.setDisplaySize(TILE - 8, TILE - 8).setVisible(false);
      (enemy.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
      this.enemies.add(enemy);
      this.enemyDirs.push(1); // start moving right

      const label = this.add.text(x, y, 'BUG', {
        fontSize: '9px', color: '#ff6666', fontStyle: 'bold',
      }).setOrigin(0.5).setDepth(6);
      this.enemyLabels.push(label);
    }
  }

  // ── HUD (top bar: tickets + timer; bottom hint) ───────────────────────────

  private createHud() {
    // Semi-transparent bar at top
    this.add.rectangle(GAME_W / 2, 12, GAME_W, 24, C.hudBg, 0.88)
      .setScrollFactor(0).setDepth(20);

    this.ticketHud = this.add.text(10, 4, `チケット: 0 / ${TOTAL_TICKETS}`, {
      fontSize: '13px', color: '#ffcc00', fontStyle: 'bold',
    }).setScrollFactor(0).setDepth(21);

    this.timerHud = this.add.text(GAME_W - 10, 4, `残り: ${TIME_LIMIT}秒`, {
      fontSize: '13px', color: '#aaddff', fontStyle: 'bold',
    }).setOrigin(1, 0).setScrollFactor(0).setDepth(21);

    // Tiny instruction hint at the bottom
    this.add.text(GAME_W / 2, GAME_H - 4, 'WASD / ↑↓←→ で移動', {
      fontSize: '9px', color: '#334455',
    }).setOrigin(0.5, 1).setScrollFactor(0).setDepth(21);
  }

  // ── Input ─────────────────────────────────────────────────────────────────

  private setupInput() {
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.keyW = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.keyA = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyS = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.keyD = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D);
  }

  // ── Timer (called every 1 second via time.addEvent) ──────────────────────

  private tickTimer() {
    if (!this.gameActive) return;
    this.timeRemaining = Math.max(0, this.timeRemaining - 1);
    this.timerHud.setText(`残り: ${this.timeRemaining}秒`);
    if (this.timeRemaining <= 10) this.timerHud.setColor('#ff4444');
    if (this.timeRemaining <= 0) this.triggerGameOver(true);
  }

  // ── Main update loop ──────────────────────────────────────────────────────

  update() {
    if (!this.gameActive) return;
    this.handlePlayerMovement();
    this.updateEnemyPatrol();
    this.drawEntities();
    this.checkTicketCollection();
    this.checkExit();
  }

  // ── Player movement (WASD / Arrow keys, normalized diagonal) ─────────────

  private handlePlayerMovement() {
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    let vx = 0, vy = 0;

    if (this.cursors.left.isDown  || this.keyA.isDown) vx = -PLAYER_SPEED;
    if (this.cursors.right.isDown || this.keyD.isDown) vx =  PLAYER_SPEED;
    if (this.cursors.up.isDown    || this.keyW.isDown) vy = -PLAYER_SPEED;
    if (this.cursors.down.isDown  || this.keyS.isDown) vy =  PLAYER_SPEED;

    // Prevent diagonal from being faster than cardinal movement
    if (vx !== 0 && vy !== 0) { vx *= 0.707; vy *= 0.707; }

    body.setVelocity(vx, vy);
  }

  // ── Enemy patrol (bounce between startCol and endCol) ────────────────────

  private updateEnemyPatrol() {
    const list = this.enemies.getChildren() as Phaser.Physics.Arcade.Image[];
    list.forEach((enemy, i) => {
      const [startCol, endCol, , speed] = ENEMY_PATROLS[i];
      const minX = startCol * TILE + TILE / 2;
      const maxX = endCol   * TILE + TILE / 2;
      const body  = enemy.body as Phaser.Physics.Arcade.Body;

      // Reverse at patrol endpoints OR when physically blocked by a wall tile
      if (this.enemyDirs[i] === 1  && (body.blocked.right || enemy.x >= maxX)) {
        this.enemyDirs[i] = -1;
      } else if (this.enemyDirs[i] === -1 && (body.blocked.left  || enemy.x <= minX)) {
        this.enemyDirs[i] = 1;
      }

      body.setVelocityX(this.enemyDirs[i] * speed);
      this.enemyLabels[i].setPosition(enemy.x, enemy.y);
    });
  }

  // ── Draw player + enemies using Graphics every frame ─────────────────────

  private drawEntities() {
    const g = this.entityGfx;
    g.clear();

    // Player — green bordered square
    const px = this.player.x;
    const py = this.player.y;
    const ps = (TILE - 6) / 2;
    g.fillStyle(C.playerFill).fillRect(px - ps, py - ps, ps * 2, ps * 2);
    g.lineStyle(2, C.player).strokeRect(px - ps + 1, py - ps + 1, ps * 2 - 2, ps * 2 - 2);
    this.playerLabel.setPosition(px, py);

    // Enemies — red bordered squares
    const list = this.enemies.getChildren() as Phaser.Physics.Arcade.Image[];
    const es = (TILE - 8) / 2;
    list.forEach((enemy) => {
      const ex = enemy.x, ey = enemy.y;
      g.fillStyle(C.enemyFill).fillRect(ex - es, ey - es, es * 2, es * 2);
      g.lineStyle(2, C.enemy).strokeRect(ex - es + 1, ey - es + 1, es * 2 - 2, es * 2 - 2);
    });
  }

  // ── Collect tickets within 18px of player center ─────────────────────────

  private checkTicketCollection() {
    const px = this.player.x;
    const py = this.player.y;
    const radius = 18;

    for (let i = this.tickets.length - 1; i >= 0; i--) {
      const t = this.tickets[i];
      if (!t.active) continue;
      const tx = t.col * TILE + TILE / 2;
      const ty = t.row * TILE + TILE / 2;
      if (Math.abs(px - tx) > radius || Math.abs(py - ty) > radius) continue;

      t.active = false;
      t.gfx.destroy();
      t.label.destroy();
      this.tickets.splice(i, 1);
      this.ticketsCollected++;
      this.ticketHud.setText(`チケット: ${this.ticketsCollected} / ${TOTAL_TICKETS}`);

      if (this.ticketsCollected >= TOTAL_TICKETS) {
        this.exitUnlocked = true;
        this.drawExit(true);
      }
    }
  }

  // ── Win condition: reach exit after collecting all tickets ────────────────

  private checkExit() {
    if (!this.exitUnlocked) return;
    const px = this.player.x;
    const py = this.player.y;
    const ex = EXIT_COL * TILE + TILE / 2;
    const ey = EXIT_ROW * TILE + TILE / 2;
    if (Math.abs(px - ex) < TILE / 2 && Math.abs(py - ey) < TILE / 2) {
      this.triggerGameClear();
    }
  }

  // ── Game Over overlay ─────────────────────────────────────────────────────

  private triggerGameOver(timedOut: boolean) {
    if (!this.gameActive) return;
    this.gameActive = false;
    this.stopAllMovement();

    const depth = 50;
    this.add.rectangle(GAME_W / 2, GAME_H / 2, GAME_W, GAME_H, 0x000000, 0.78)
      .setScrollFactor(0).setDepth(depth);

    this.add.text(GAME_W / 2, GAME_H / 2 - 70, 'GAME OVER', {
      fontSize: '40px', color: '#ff3333', fontStyle: 'bold',
    }).setOrigin(0.5).setScrollFactor(0).setDepth(depth + 1);

    this.add.text(GAME_W / 2, GAME_H / 2 - 15,
      timedOut ? 'デッドラインを超えてしまった...' : 'バグに捕まった！', {
      fontSize: '17px', color: '#ffaaaa',
    }).setOrigin(0.5).setScrollFactor(0).setDepth(depth + 1);

    this.add.text(GAME_W / 2, GAME_H / 2 + 18,
      `回収チケット: ${this.ticketsCollected} / ${TOTAL_TICKETS}`, {
      fontSize: '13px', color: '#ff8888',
    }).setOrigin(0.5).setScrollFactor(0).setDepth(depth + 1);

    this.makeButton(GAME_W / 2, GAME_H / 2 + 68, '[ もう一度 ]', '#880000', depth + 1);
  }

  // ── Game Clear overlay ────────────────────────────────────────────────────

  private triggerGameClear() {
    if (!this.gameActive) return;
    this.gameActive = false;
    this.stopAllMovement();

    const depth = 50;
    this.add.rectangle(GAME_W / 2, GAME_H / 2, GAME_W, GAME_H, 0x001133, 0.85)
      .setScrollFactor(0).setDepth(depth);

    this.add.text(GAME_W / 2, GAME_H / 2 - 75, 'MISSION CLEAR!', {
      fontSize: '38px', color: '#44ff88', fontStyle: 'bold',
    }).setOrigin(0.5).setScrollFactor(0).setDepth(depth + 1);

    this.add.text(GAME_W / 2, GAME_H / 2 - 20,
      'チケット5枚を全て提出し、無事に退社！', {
      fontSize: '15px', color: '#aaffcc',
    }).setOrigin(0.5).setScrollFactor(0).setDepth(depth + 1);

    this.add.text(GAME_W / 2, GAME_H / 2 + 14,
      `残り時間: ${this.timeRemaining}秒`, {
      fontSize: '18px', color: '#88ffcc', fontStyle: 'bold',
    }).setOrigin(0.5).setScrollFactor(0).setDepth(depth + 1);

    this.makeButton(GAME_W / 2, GAME_H / 2 + 70, '[ もう一度プレイ ]', '#004422', depth + 1);
  }

  // ── Shared: stop all physics bodies ──────────────────────────────────────

  private stopAllMovement() {
    (this.player.body as Phaser.Physics.Arcade.Body).setVelocity(0, 0);
    (this.enemies.getChildren() as Phaser.Physics.Arcade.Image[]).forEach((e) => {
      (e.body as Phaser.Physics.Arcade.Body).setVelocity(0, 0);
    });
  }

  // ── Shared: create an interactive restart button ──────────────────────────

  private makeButton(x: number, y: number, text: string, bg: string, depth: number) {
    const btn = this.add.text(x, y, text, {
      fontSize: '20px', color: '#ffffff', backgroundColor: bg,
      padding: { x: 18, y: 9 },
    }).setOrigin(0.5).setScrollFactor(0).setDepth(depth).setInteractive({ useHandCursor: true });

    btn.on('pointerdown', () => this.scene.restart());
    btn.on('pointerover',  () => btn.setAlpha(0.8));
    btn.on('pointerout',   () => btn.setAlpha(1));
  }
}

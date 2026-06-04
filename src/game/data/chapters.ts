export interface NPCDefinition {
  id: string;
  name: string;
  col: number;
  row: number;
  eventId: string;
  color: number;
}

export interface ChapterDefinition {
  id: number;
  title: string;
  phase: string;
  location: string;
  bgColor: number;
  mapRows: string[];
  npcs: NPCDefinition[];
  playerStart: { col: number; row: number };
  exitTile: { col: number; row: number };
  events: string[];
  floorColor: number;
  wallColor: number;
}

// Tile legend:
// 0 = floor  1 = wall  2 = desk  3 = exit-door
// 4 = meeting table  5 = server rack  6 = window  7 = plant

export const chapters: ChapterDefinition[] = [
  {
    id: 1,
    title: '配属・キックオフ',
    phase: '第1章',
    location: '自社オフィス',
    bgColor: 0x1a2330,
    floorColor: 0xd4d9e3,
    wallColor: 0x3d4252,
    mapRows: [
      '1111111111111111111111111',
      '1000000000000000000000001',
      '1022022022022000000000001',
      '1000000000000000000000001',
      '1022022022022000000000001',
      '1000000000000000000000001',
      '1000000000000000000000001',
      '1000000000000000000000001',
      '1000000000000044440000001',
      '1000000000000044440000001',
      '1000000000000000000000001',
      '1000000000000000000000001',
      '1000000000000000000000031',
      '1111111111111111111111111',
    ],
    npcs: [
      { id: 'tanaka-pm', name: '田中PM', col: 20, row: 3, eventId: 'event-1-1', color: 0x9b59b6 },
      { id: 'sato-senior', name: '佐藤先輩', col: 8, row: 9, eventId: 'event-1-2', color: 0x27ae60 },
    ],
    playerStart: { col: 12, row: 11 },
    exitTile: { col: 23, row: 12 },
    events: ['event-1-1', 'event-1-2'],
  },
  {
    id: 2,
    title: '要件定義',
    phase: '第2章',
    location: '客先会議室',
    bgColor: 0x1a2830,
    floorColor: 0xdce8e0,
    wallColor: 0x2c4a3d,
    mapRows: [
      '1111111111111111111111111',
      '1066666666666666666660001',
      '1000000000000000000000001',
      '1000000000000000000000001',
      '1004444444444444440000001',
      '1004444444444444440000001',
      '1004444444444444440000001',
      '1000000000000000000000001',
      '1000000000000000000000001',
      '1000000000000000000000001',
      '1000000000000000000000001',
      '1000000000000000000000001',
      '1000000000000000000000031',
      '1111111111111111111111111',
    ],
    npcs: [
      { id: 'client', name: '顧客担当者', col: 8, row: 8, eventId: 'event-2-1', color: 0xe74c3c },
      { id: 'tanaka-pm', name: '田中PM', col: 18, row: 8, eventId: 'event-2-2', color: 0x9b59b6 },
    ],
    playerStart: { col: 12, row: 11 },
    exitTile: { col: 23, row: 12 },
    events: ['event-2-1', 'event-2-2'],
  },
  {
    id: 3,
    title: '基本設計',
    phase: '第3章',
    location: '客先・島席',
    bgColor: 0x202030,
    floorColor: 0xd8d8e8,
    wallColor: 0x3a3a50,
    mapRows: [
      '1111111111111111111111111',
      '1000000000000000000000001',
      '1022022022022022022020001',
      '1000000000000000000000001',
      '1022022022022022022020001',
      '1000000000000000000000001',
      '1022022022022022022020001',
      '1000000000000000000000001',
      '1000000000000000000000001',
      '1000000000000000000000001',
      '1000000000000000000000001',
      '1000000000000000000000001',
      '1000000000000000000000031',
      '1111111111111111111111111',
    ],
    npcs: [
      { id: 'sato-senior', name: '佐藤先輩', col: 5, row: 7, eventId: 'event-3-1', color: 0x27ae60 },
      { id: 'other-team', name: '連携担当', col: 19, row: 7, eventId: 'event-3-2', color: 0xf39c12 },
    ],
    playerStart: { col: 12, row: 10 },
    exitTile: { col: 23, row: 12 },
    events: ['event-3-1', 'event-3-2'],
  },
  {
    id: 4,
    title: '詳細設計・製造',
    phase: '第4章',
    location: '開発ルーム',
    bgColor: 0x1a1a2a,
    floorColor: 0xd0d0dc,
    wallColor: 0x30304a,
    mapRows: [
      '1111111111111111111111111',
      '1000000000000000000000001',
      '1022022022022000000000001',
      '1000000000000000000000001',
      '1022022022022000000000001',
      '1000000000000000000000001',
      '1000000000000000000000001',
      '1000000000000000000000001',
      '1000000555000000000000001',
      '1000000555000000000000001',
      '1000000000000000000000001',
      '1000000000000000000000001',
      '1000000000000000000000031',
      '1111111111111111111111111',
    ],
    npcs: [
      { id: 'suzuki', name: '鈴木さん', col: 16, row: 6, eventId: 'event-4-1', color: 0xe67e22 },
      { id: 'tanaka-pm', name: '田中PM', col: 20, row: 3, eventId: 'event-4-2', color: 0x9b59b6 },
    ],
    playerStart: { col: 12, row: 11 },
    exitTile: { col: 23, row: 12 },
    events: ['event-4-1', 'event-4-2'],
  },
  {
    id: 5,
    title: 'テスト工程',
    phase: '第5章',
    location: 'テストルーム',
    bgColor: 0x1a2a1a,
    floorColor: 0xd4e8d4,
    wallColor: 0x2a4a2a,
    mapRows: [
      '1111111111111111111111111',
      '1000000000000000000000001',
      '1220000000000000000000001',
      '1220000000000000000000001',
      '1000000000000000000000001',
      '1022022022022022022020001',
      '1000000000000000000000001',
      '1022022022022022022020001',
      '1000000000000000000000001',
      '1000000000000000000000001',
      '1000000000000000000000001',
      '1000000000000000000000001',
      '1000000000000000000000031',
      '1111111111111111111111111',
    ],
    npcs: [
      { id: 'tanaka-pm', name: '田中PM', col: 18, row: 9, eventId: 'event-5-1', color: 0x9b59b6 },
    ],
    playerStart: { col: 12, row: 11 },
    exitTile: { col: 23, row: 12 },
    events: ['event-5-1'],
  },
  {
    id: 6,
    title: '炎上と立て直し',
    phase: '第6章',
    location: '緊急対策室',
    bgColor: 0x2a1010,
    floorColor: 0xe8d4d4,
    wallColor: 0x502020,
    mapRows: [
      '1111111111111111111111111',
      '1000000000000000000000001',
      '1000000000000000000000001',
      '1000000000000000000000001',
      '1004444444444444444440001',
      '1004444444444444444440001',
      '1004444444444444444440001',
      '1000000000000000000000001',
      '1000000000000000000000001',
      '1000000000000000000000001',
      '1000000000000000000000001',
      '1000000000000000000000001',
      '1000000000000000000000031',
      '1111111111111111111111111',
    ],
    npcs: [
      { id: 'tanaka-pm-1', name: '田中PM', col: 12, row: 3, eventId: 'event-6-1', color: 0x9b59b6 },
      { id: 'tanaka-pm-2', name: '田中PM', col: 12, row: 9, eventId: 'event-6-2', color: 0x9b59b6 },
    ],
    playerStart: { col: 5, row: 9 },
    exitTile: { col: 23, row: 12 },
    events: ['event-6-1', 'event-6-2'],
  },
  {
    id: 7,
    title: 'リリース・運用',
    phase: '第7章',
    location: 'サーバー室',
    bgColor: 0x0a1a0a,
    floorColor: 0xc8d8c8,
    wallColor: 0x1a3a1a,
    mapRows: [
      '1111111111111111111111111',
      '1000000000000000000000001',
      '1050550550550000000000001',
      '1050550550550000000000001',
      '1050550550550000000000001',
      '1000000000000000000000001',
      '1000000000000000000000001',
      '1050550550550000000000001',
      '1050550550550000000000001',
      '1000000000000000000000001',
      '1000000000000000000000001',
      '1000000000000000000000001',
      '1000000000000000000000031',
      '1111111111111111111111111',
    ],
    npcs: [
      { id: 'ops-staff', name: '運用担当', col: 16, row: 6, eventId: 'event-7-1', color: 0x3498db },
      { id: 'tanaka-pm', name: '田中PM', col: 20, row: 6, eventId: 'event-7-2', color: 0x9b59b6 },
    ],
    playerStart: { col: 12, row: 11 },
    exitTile: { col: 23, row: 12 },
    events: ['event-7-1', 'event-7-2'],
  },
];

export function getChapter(id: number): ChapterDefinition {
  const ch = chapters.find((c) => c.id === id);
  if (!ch) throw new Error(`Chapter ${id} not found`);
  return ch;
}

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { scryptSync, randomBytes } from 'crypto';

const DATA_DIR = join(process.cwd(), 'data');
const USERS_FILE = join(DATA_DIR, 'users.json');

export interface User {
  username: string;
  hash: string;
  salt: string;
  createdAt: string;
}

function ensureDataDir() {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function readUsers(): User[] {
  ensureDataDir();
  if (!existsSync(USERS_FILE)) {
    writeFileSync(USERS_FILE, '[]', 'utf-8');
    return [];
  }
  return JSON.parse(readFileSync(USERS_FILE, 'utf-8')) as User[];
}

function writeUsers(users: User[]) {
  ensureDataDir();
  writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
}

export function hashPassword(password: string): { hash: string; salt: string } {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return { hash, salt };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const testHash = scryptSync(password, salt, 64).toString('hex');
  return testHash === hash;
}

export function findUser(username: string): User | undefined {
  return readUsers().find((u) => u.username === username);
}

export function createUser(username: string, password: string): User | null {
  const users = readUsers();
  if (users.find((u) => u.username === username)) return null;
  const { hash, salt } = hashPassword(password);
  const user: User = { username, hash, salt, createdAt: new Date().toISOString() };
  writeUsers([...users, user]);
  return user;
}

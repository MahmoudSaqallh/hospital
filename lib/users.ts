import { promises as fs } from "fs";
import path from "path";
import bcrypt from "bcryptjs";

export type PatientUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  createdAt: string;
};

const DATA_DIR = path.join(process.cwd(), "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");

async function ensureUsersFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(USERS_FILE);
  } catch {
    await fs.writeFile(USERS_FILE, "[]", "utf8");
  }
}

export async function readUsers(): Promise<PatientUser[]> {
  await ensureUsersFile();
  const raw = await fs.readFile(USERS_FILE, "utf8");
  try {
    const parsed = JSON.parse(raw) as PatientUser[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeUsers(users: PatientUser[]) {
  await ensureUsersFile();
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), "utf8");
}

export function normalizePhone(phone: string) {
  return phone.replace(/[\s\-]/g, "").trim();
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function findUserByEmailOrPhone(identifier: string) {
  const users = await readUsers();
  const value = identifier.trim().toLowerCase();
  const phoneValue = normalizePhone(identifier);

  return (
    users.find(
      (user) =>
        user.email.toLowerCase() === value ||
        normalizePhone(user.phone) === phoneValue,
    ) ?? null
  );
}

export async function findUserByEmail(email: string) {
  const users = await readUsers();
  const normalized = normalizeEmail(email);
  return users.find((user) => user.email.toLowerCase() === normalized) ?? null;
}

export async function findUserByPhone(phone: string) {
  const users = await readUsers();
  const normalized = normalizePhone(phone);
  return users.find((user) => normalizePhone(user.phone) === normalized) ?? null;
}

export type CreateUserInput = {
  name: string;
  email: string;
  phone: string;
  password: string;
};

export async function createUser(input: CreateUserInput) {
  const name = input.name.trim();
  const email = normalizeEmail(input.email);
  const phone = normalizePhone(input.phone);

  if (!name || !email || !phone || !input.password) {
    throw new Error("MISSING_FIELDS");
  }

  if (input.password.length < 6) {
    throw new Error("WEAK_PASSWORD");
  }

  const existingEmail = await findUserByEmail(email);
  if (existingEmail) {
    throw new Error("EMAIL_EXISTS");
  }

  const existingPhone = await findUserByPhone(phone);
  if (existingPhone) {
    throw new Error("PHONE_EXISTS");
  }

  const users = await readUsers();
  const user: PatientUser = {
    id: `user_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    name,
    email,
    phone,
    passwordHash: await bcrypt.hash(input.password, 10),
    createdAt: new Date().toISOString(),
  };

  users.push(user);
  await writeUsers(users);

  const { passwordHash: _, ...safeUser } = user;
  return safeUser;
}

export async function verifyPassword(user: PatientUser, password: string) {
  return bcrypt.compare(password, user.passwordHash);
}

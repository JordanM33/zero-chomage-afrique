import bcrypt from "bcryptjs";
import fs from "node:fs";
import path from "node:path";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

const dataDir = path.resolve(process.cwd(), "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, "db.json");
const adapter = new JSONFile(dbPath);

export const db = new Low(adapter, {
  users: [],
  images: [],
  siteContent: {
    hero: {},
    formations: [],
    news: [],
  },
});

function nextId(items) {
  if (!items.length) return 1;
  return Math.max(...items.map((item) => item.id)) + 1;
}

export async function initDb() {
  await db.read();

  if (!db.data) {
    db.data = {
      users: [],
      images: [],
      siteContent: {
        hero: {},
        formations: [],
        news: [],
      },
    };
  }

  if (!db.data.users.some((u) => u.email === "admin@zerochomage.local")) {
    db.data.users.push({
      id: nextId(db.data.users),
      fullName: "Admin Principal",
      email: "admin@zerochomage.local",
      role: "admin",
      passwordHash: bcrypt.hashSync("Admin@1234", 10),
      createdAt: new Date().toISOString(),
    });
  } else {
    db.data.users = db.data.users.map((user) =>
      user.email === "admin@zerochomage.local" && !String(user.passwordHash).startsWith("$2")
        ? { ...user, passwordHash: bcrypt.hashSync(String(user.passwordHash), 10) }
        : user,
    );
  }

  db.data.siteContent = db.data.siteContent ?? { hero: {}, formations: [], news: [] };

  await db.write();
}

export function getNextUserId() {
  return nextId(db.data.users);
}

export function getNextImageId() {
  return nextId(db.data.images);
}

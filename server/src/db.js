import bcrypt from "bcryptjs";
import fs from "node:fs";
import path from "node:path";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

/**
 * Schéma de la base (fichier data/db.json) :
 * - users: { id, fullName, email, role, passwordHash, createdAt }
 * - images: { id, label, fileName, url, mimeType, size, uploadedBy, createdAt }
 * - siteContent: contenu éditable du site (hero, formations, news, etc.)
 */
const dataDir = path.resolve(process.cwd(), "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, "db.json");
const adapter = new JSONFile(dbPath);

const VALID_ROLES = new Set(["admin", "editor"]);

export const db = new Low(adapter, {
  users: [],
  images: [],
  siteContent: {
    hero: {},
    formations: [],
    news: [],
  },
});

function guessMime(fileName) {
  const ext = path.extname(fileName).toLowerCase();
  if (ext === ".png") return "image/png";
  if (ext === ".webp") return "image/webp";
  if (ext === ".gif") return "image/gif";
  return "image/jpeg";
}

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

export function isValidRole(role) {
  return VALID_ROLES.has(role);
}

export async function syncUploadsToDb(uploadsDir) {
  if (!fs.existsSync(uploadsDir)) return 0;

  await db.read();
  const known = new Set(db.data.images.map((img) => img.fileName));
  const files = fs.readdirSync(uploadsDir).filter((name) => /\.(jpe?g|png|webp|gif)$/i.test(name));

  let added = 0;
  let nextImageId = getNextImageId();

  for (const fileName of files) {
    if (known.has(fileName)) continue;

    const filePath = path.join(uploadsDir, fileName);
    const stat = fs.statSync(filePath);
    db.data.images.push({
      id: nextImageId++,
      label: fileName.replace(/^\d+-/, "").replace(/-/g, " "),
      fileName,
      url: `/uploads/${fileName}`,
      mimeType: guessMime(fileName),
      size: stat.size,
      uploadedBy: db.data.users[0]?.id ?? 1,
      createdAt: stat.mtime.toISOString(),
    });
    added += 1;
  }

  if (added > 0) {
    await db.write();
  }

  return added;
}

export function getNextUserId() {
  return nextId(db.data.users);
}

export function getNextImageId() {
  return nextId(db.data.images);
}

export function sanitizeUser(user) {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    accessType: user.role,
    createdAt: user.createdAt,
  };
}

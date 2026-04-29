import cors from "cors";
import express from "express";
import fs from "node:fs";
import path from "node:path";
import multer from "multer";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db, getNextImageId, getNextUserId, initDb } from "./db.js";

const app = express();
const port = process.env.PORT || 4000;
const jwtSecret = process.env.JWT_SECRET || "replace-this-secret-in-production";

const uploadsDir = path.resolve(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const safeName = `${Date.now()}-${file.originalname.replaceAll(/\s+/g, "-").toLowerCase()}`;
    cb(null, safeName);
  },
});
const upload = multer({ storage });

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use("/uploads", express.static(uploadsDir));

function signToken(user) {
  return jwt.sign({ sub: user.id, role: user.role, email: user.email }, jwtSecret, { expiresIn: "12h" });
}

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) {
    return res.status(401).json({ error: "Token manquant." });
  }
  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    return next();
  } catch {
    return res.status(401).json({ error: "Token invalide ou expire." });
  }
}

function requireAdmin(req, res, next) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ error: "Acces reserve a l'administrateur." });
  }
  return next();
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body ?? {};
  if (!email || !password) {
    return res.status(400).json({ error: "email et password sont requis." });
  }

  await db.read();
  const user = db.data.users.find((u) => u.email === email);
  if (!user) {
    return res.status(401).json({ error: "Identifiants invalides." });
  }

  const valid = bcrypt.compareSync(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ error: "Identifiants invalides." });
  }

  const token = signToken(user);
  return res.json({
    token,
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    },
  });
});

app.get("/api/auth/me", requireAuth, async (req, res) => {
  await db.read();
  const user = db.data.users.find((u) => u.id === Number(req.user.sub));
  if (!user) {
    return res.status(404).json({ error: "Utilisateur introuvable." });
  }
  return res.json({
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  });
});

app.get("/api/users", requireAuth, requireAdmin, async (_req, res) => {
  await db.read();
  const rows = [...db.data.users]
    .sort((a, b) => b.id - a.id)
    .map((u) => ({ id: u.id, fullName: u.fullName, email: u.email, role: u.role, createdAt: u.createdAt }));
  res.json(rows);
});

app.post("/api/users", requireAuth, requireAdmin, async (req, res) => {
  const { fullName, email, role = "editor", password = "change-me" } = req.body ?? {};
  if (!fullName || !email || !password) {
    return res.status(400).json({ error: "fullName, email et password sont requis." });
  }

  await db.read();
  if (db.data.users.some((u) => u.email === email)) {
    return res.status(409).json({ error: "Impossible de creer cet utilisateur (email deja utilise)." });
  }

  const id = getNextUserId();
  db.data.users.push({
    id,
    fullName,
    email,
    role,
    passwordHash: bcrypt.hashSync(password, 10),
    createdAt: new Date().toISOString(),
  });
  await db.write();
  return res.status(201).json({ id });
});

app.put("/api/users/:id", requireAuth, requireAdmin, async (req, res) => {
  const userId = Number(req.params.id);
  const { fullName, email, role, password } = req.body ?? {};

  if (!fullName || !email || !role) {
    return res.status(400).json({ error: "fullName, email et role sont requis." });
  }

  await db.read();
  const userIndex = db.data.users.findIndex((u) => u.id === userId);
  if (userIndex < 0) {
    return res.status(404).json({ error: "Utilisateur introuvable." });
  }
  if (db.data.users.some((u) => u.email === email && u.id !== userId)) {
    return res.status(409).json({ error: "Impossible de modifier cet utilisateur (email deja utilise)." });
  }

  const current = db.data.users[userIndex];
  db.data.users[userIndex] = {
    ...current,
    fullName,
    email,
    role,
    passwordHash: password ? bcrypt.hashSync(password, 10) : current.passwordHash,
  };
  await db.write();
  return res.json({ ok: true });
});

app.delete("/api/users/:id", requireAuth, requireAdmin, async (req, res) => {
  const userId = Number(req.params.id);
  await db.read();
  const before = db.data.users.length;
  db.data.users = db.data.users.filter((u) => u.id !== userId);
  if (db.data.users.length === before) {
    return res.status(404).json({ error: "Utilisateur introuvable." });
  }
  await db.write();
  res.json({ ok: true });
});

app.get("/api/images", requireAuth, async (_req, res) => {
  await db.read();
  const rows = [...db.data.images].sort((a, b) => b.id - a.id);
  res.json(rows);
});

app.post("/api/images", requireAuth, upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Fichier image manquant." });
  }

  const label = req.body?.label || req.file.originalname;
  const imageUrl = `/uploads/${req.file.filename}`;
  await db.read();
  const id = getNextImageId();
  db.data.images.push({
    id,
    label,
    fileName: req.file.filename,
    url: imageUrl,
    mimeType: req.file.mimetype,
    size: req.file.size,
    uploadedBy: Number(req.user.sub),
    createdAt: new Date().toISOString(),
  });
  await db.write();

  return res.status(201).json({
    id,
    url: imageUrl,
    label,
  });
});

app.delete("/api/images/:id", requireAuth, async (req, res) => {
  const imageId = Number(req.params.id);
  await db.read();
  const row = db.data.images.find((img) => img.id === imageId);
  if (!row) {
    return res.status(404).json({ error: "Image introuvable." });
  }

  db.data.images = db.data.images.filter((img) => img.id !== imageId);
  await db.write();
  const filePath = path.join(uploadsDir, row.fileName);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
  return res.json({ ok: true });
});

app.get("/api/content", async (_req, res) => {
  await db.read();
  res.json({
    payload: db.data.siteContent ?? null,
    updatedAt: new Date().toISOString(),
  });
});

app.put("/api/content", requireAuth, async (req, res) => {
  const payload = req.body?.payload;
  if (!payload) {
    return res.status(400).json({ error: "payload est requis." });
  }
  await db.read();
  db.data.siteContent = payload;
  await db.write();
  return res.json({ ok: true });
});

initDb().then(() => {
  app.listen(port, () => {
    console.log(`ZCA admin API running on http://localhost:${port}`);
  });
});

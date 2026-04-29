# API Admin - ZCA

Ce dossier contient une API backend Express + LowDB (fichier JSON) pour gerer:
- les utilisateurs admin/editor
- les images uploades
- le contenu global du site

## Installation

```bash
cd server
npm install
```

## Lancer l'API

```bash
npm run dev
```

API disponible sur `http://localhost:4000`.

## Endpoints principaux

- `GET /api/health`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/users`
- `POST /api/users`
- `PUT /api/users/:id`
- `DELETE /api/users/:id`
- `GET /api/images`
- `POST /api/images` (multipart form-data, champ: `image`)
- `DELETE /api/images/:id`
- `GET /api/content`
- `PUT /api/content`

Les fichiers uploades sont stockes dans `server/uploads` et exposes via `/uploads/...`.

## Compte admin par defaut

- email: `admin@zerochomage.local`
- mot de passe: `Admin@1234`

## Securite

- Les mots de passe sont stockes avec hash `bcrypt`.
- Les routes sensibles sont protegees avec JWT (`Authorization: Bearer <token>`).

import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { Link } from "react-router-dom";
import {
  DEFAULT_SITE_CONTENT,
  useSiteContent,
  type FormationColor,
  type FormationIcon,
  type SiteContent,
} from "@/context/SiteContentContext";

function uid(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

const ICON_OPTIONS: FormationIcon[] = ["camera", "video", "palette", "bar-chart"];
const COLOR_OPTIONS: FormationColor[] = ["bg-primary", "bg-accent"];
const API_BASE = "http://localhost:4000";
const TOKEN_KEY = "zca-admin-token";

type AuthUser = {
  id: number;
  fullName: string;
  email: string;
  role: string;
};

type ManagedUser = {
  id: number;
  fullName: string;
  email: string;
  role: string;
  createdAt: string;
};

type ManagedImage = {
  id: number;
  label: string;
  fileName: string;
  url: string;
  mimeType: string;
  size: number;
  uploadedBy: number;
  createdAt: string;
};

function ensureCompleteContent(content?: Partial<SiteContent> | null): SiteContent {
  return {
    hero: {
      titleTop: content?.hero?.titleTop || DEFAULT_SITE_CONTENT.hero.titleTop,
      titleMiddle: content?.hero?.titleMiddle || DEFAULT_SITE_CONTENT.hero.titleMiddle,
      titleHighlight: content?.hero?.titleHighlight || DEFAULT_SITE_CONTENT.hero.titleHighlight,
      description: content?.hero?.description || DEFAULT_SITE_CONTENT.hero.description,
    },
    formations:
      content?.formations && content.formations.length > 0 ? content.formations : DEFAULT_SITE_CONTENT.formations,
    news: content?.news && content.news.length > 0 ? content.news : DEFAULT_SITE_CONTENT.news,
  };
}

async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Impossible de lire le fichier image"));
    reader.readAsDataURL(file);
  });
}

export default function Admin() {
  const { content, setContent, resetContent } = useSiteContent();
  const [draft, setDraft] = useState<SiteContent>(content);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<"hero" | "formations" | "news" | "users" | "images">("hero");
  const [apiStatus, setApiStatus] = useState<"unknown" | "online" | "offline">("unknown");
  const [token, setToken] = useState<string | null>(() => window.localStorage.getItem(TOKEN_KEY));
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [email, setEmail] = useState("admin@zerochomage.local");
  const [password, setPassword] = useState("Admin@1234");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [images, setImages] = useState<ManagedImage[]>([]);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState("editor");
  const [newUserPassword, setNewUserPassword] = useState("ChangeMe@123");

  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  useEffect(() => {
    setDraft(content);
  }, [content]);

  useEffect(() => {
    if (!token) return;
    const loadFromApi = async () => {
      try {
        const profileResponse = await fetch(`${API_BASE}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!profileResponse.ok) {
          throw new Error("Session expiree");
        }
        const profile = (await profileResponse.json()) as AuthUser;
        setCurrentUser(profile);

        const response = await fetch(`${API_BASE}/api/content`);
        if (!response.ok) {
          throw new Error("API indisponible");
        }
        const data = (await response.json()) as { payload?: SiteContent };
        const hydrated = ensureCompleteContent(data.payload);
        setContent(hydrated);
        setDraft(hydrated);
        setApiStatus("online");
      } catch {
        setCurrentUser(null);
        setToken(null);
        window.localStorage.removeItem(TOKEN_KEY);
        setApiStatus("offline");
      }
    };
    void loadFromApi();
  }, [setContent, token]);

  const hasChanges = useMemo(() => JSON.stringify(draft) !== JSON.stringify(content), [content, draft]);

  const save = async () => {
    const hydrated = ensureCompleteContent(draft);
    setContent(hydrated);
    setDraft(hydrated);
    if (!token) {
      setSavedAt("session non connectee (sauvegarde locale)");
      return;
    }
    try {
      const response = await fetch(`${API_BASE}/api/content`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ payload: hydrated }),
      });
      if (!response.ok) {
        throw new Error("API indisponible");
      }
      setApiStatus("online");
    } catch {
      setApiStatus("offline");
    }
    setSavedAt(new Date().toLocaleString("fr-FR"));
  };

  const fetchUsers = async () => {
    if (!token || currentUser?.role !== "admin") return;
    try {
      const response = await fetch(`${API_BASE}/api/users`, { headers: authHeaders });
      if (!response.ok) return;
      const data = (await response.json()) as ManagedUser[];
      setUsers(data);
    } catch {
      setApiStatus("offline");
    }
  };

  const fetchImages = async () => {
    if (!token) return;
    try {
      const response = await fetch(`${API_BASE}/api/images`, { headers: authHeaders });
      if (!response.ok) return;
      const data = (await response.json()) as ManagedImage[];
      setImages(data);
    } catch {
      setApiStatus("offline");
    }
  };

  const onFormationFileChange = async (id: string, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    let imageValue = await fileToDataUrl(file);
    if (token) {
      try {
        const formData = new FormData();
        formData.append("image", file);
        formData.append("label", file.name);
        const response = await fetch(`${API_BASE}/api/images`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        if (response.ok) {
          const uploaded = (await response.json()) as { url: string };
          imageValue = `${API_BASE}${uploaded.url}`;
          setApiStatus("online");
        }
      } catch {
        setApiStatus("offline");
      }
    }
    setDraft({
      ...draft,
      formations: draft.formations.map((f) => (f.id === id ? { ...f, image: imageValue } : f)),
    });
  };

  const onNewsFileChange = async (id: string, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    let imageValue = await fileToDataUrl(file);
    if (token) {
      try {
        const formData = new FormData();
        formData.append("image", file);
        formData.append("label", file.name);
        const response = await fetch(`${API_BASE}/api/images`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        if (response.ok) {
          const uploaded = (await response.json()) as { url: string };
          imageValue = `${API_BASE}${uploaded.url}`;
          setApiStatus("online");
        }
      } catch {
        setApiStatus("offline");
      }
    }
    setDraft({
      ...draft,
      news: draft.news.map((n) => (n.id === id ? { ...n, img: imageValue } : n)),
    });
  };

  const login = async () => {
    setLoading(true);
    setLoginError(null);
    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        throw new Error("Identifiants invalides");
      }
      const data = (await response.json()) as { token: string; user: AuthUser };
      setToken(data.token);
      setCurrentUser(data.user);
      window.localStorage.setItem(TOKEN_KEY, data.token);
      setApiStatus("online");
    } catch {
      setLoginError("Email ou mot de passe incorrect.");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setCurrentUser(null);
    window.localStorage.removeItem(TOKEN_KEY);
  };

  const createUser = async () => {
    if (!token) return;
    if (!newUserName || !newUserEmail || !newUserPassword) return;
    const response = await fetch(`${API_BASE}/api/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders },
      body: JSON.stringify({
        fullName: newUserName,
        email: newUserEmail,
        role: newUserRole,
        password: newUserPassword,
      }),
    });
    if (response.ok) {
      setNewUserName("");
      setNewUserEmail("");
      setNewUserRole("editor");
      setNewUserPassword("ChangeMe@123");
      await fetchUsers();
    }
  };

  const deleteUser = async (id: number) => {
    if (!token) return;
    const response = await fetch(`${API_BASE}/api/users/${id}`, {
      method: "DELETE",
      headers: authHeaders,
    });
    if (response.ok) {
      await fetchUsers();
    }
  };

  const deleteImage = async (id: number) => {
    if (!token) return;
    const response = await fetch(`${API_BASE}/api/images/${id}`, {
      method: "DELETE",
      headers: authHeaders,
    });
    if (response.ok) {
      await fetchImages();
    }
  };

  useEffect(() => {
    if (!token || !currentUser) return;
    void fetchImages();
    void fetchUsers();
  }, [token, currentUser]);

  if (!token || !currentUser) {
    return (
      <main className="min-h-screen bg-background py-10">
        <div className="container-zca max-w-md rounded-xl border border-border bg-card p-6">
          <h1 className="font-display text-2xl font-black text-primary">Connexion administrateur</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Connectez-vous pour gerer le contenu, les images et les utilisateurs.
          </p>
          <div className="mt-5 space-y-3">
            <input
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {loginError ? <p className="text-sm text-destructive">{loginError}</p> : null}
            <button
              type="button"
              className="w-full rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
              onClick={() => void login()}
              disabled={loading}
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
            <p className="text-xs text-muted-foreground">Compte initial: admin@zerochomage.local / Admin@1234</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background py-10">
      <div className="container-zca max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-display text-3xl font-black text-primary">Administration du contenu</h1>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">
              Connecte: {currentUser.fullName} ({currentUser.role})
            </span>
            <button type="button" onClick={logout} className="text-sm font-semibold text-destructive underline">
              Deconnexion
            </button>
            <Link to="/" className="text-sm font-semibold text-accent underline">
              Retour au site
            </Link>
          </div>
        </div>

        <p className="mt-2 text-sm text-muted-foreground">
          Modifiez vos contenus, importez des images depuis votre ordinateur et publiez en un clic.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {[
            { id: "hero", label: "Hero" },
            { id: "formations", label: "Formations" },
            { id: "news", label: "Actualites" },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveSection(item.id as "hero" | "formations" | "news" | "users" | "images")}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold ${
                activeSection === item.id ? "bg-primary text-white" : "border border-border"
              }`}
            >
              {item.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setActiveSection("users")}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold ${
              activeSection === "users" ? "bg-primary text-white" : "border border-border"
            }`}
          >
            Utilisateurs
          </button>
          <button
            type="button"
            onClick={() => setActiveSection("images")}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold ${
              activeSection === "images" ? "bg-primary text-white" : "border border-border"
            }`}
          >
            Images
          </button>
        </div>

        <div className="sticky top-24 z-20 mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card/95 p-3 backdrop-blur">
          <button
            type="button"
            onClick={() => void save()}
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            disabled={!hasChanges}
          >
            Enregistrer les modifications
          </button>
          <button
            type="button"
            onClick={() => setDraft(content)}
            className="rounded-md border border-border px-4 py-2 text-sm font-semibold"
          >
            Annuler les changements
          </button>
          <button
            type="button"
            onClick={() => {
              resetContent();
              setDraft(DEFAULT_SITE_CONTENT);
              setSavedAt("contenu reinitialise");
            }}
            className="rounded-md border border-destructive/40 px-4 py-2 text-sm font-semibold text-destructive"
          >
            Reinitialiser le contenu
          </button>
          {savedAt ? <span className="text-xs text-muted-foreground">Derniere sauvegarde: {savedAt}</span> : null}
          <span className={`text-xs ${apiStatus === "online" ? "text-emerald-600" : "text-amber-600"}`}>
            API: {apiStatus === "online" ? "connectee (DB)" : apiStatus === "offline" ? "hors ligne (local)" : "verification..."}
          </span>
        </div>

        <section className={`mt-6 rounded-xl border border-border bg-card p-6 ${activeSection === "hero" ? "" : "hidden"}`}>
          <h2 className="text-xl font-bold text-primary">Hero</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <input
              className="rounded-md border border-border bg-background px-3 py-2 text-sm"
              value={draft.hero.titleTop}
              onChange={(e) => setDraft({ ...draft, hero: { ...draft.hero, titleTop: e.target.value } })}
              placeholder="Ligne 1 du titre"
            />
            <input
              className="rounded-md border border-border bg-background px-3 py-2 text-sm"
              value={draft.hero.titleMiddle}
              onChange={(e) => setDraft({ ...draft, hero: { ...draft.hero, titleMiddle: e.target.value } })}
              placeholder="Ligne 2 du titre"
            />
          </div>
          <input
            className="mt-3 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            value={draft.hero.titleHighlight}
            onChange={(e) => setDraft({ ...draft, hero: { ...draft.hero, titleHighlight: e.target.value } })}
            placeholder="Ligne mise en avant"
          />
          <textarea
            className="mt-3 min-h-24 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            value={draft.hero.description}
            onChange={(e) => setDraft({ ...draft, hero: { ...draft.hero, description: e.target.value } })}
            placeholder="Description du hero"
          />
        </section>

        <section className={`mt-8 rounded-xl border border-border bg-card p-6 ${activeSection === "formations" ? "" : "hidden"}`}>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-primary">Formations</h2>
            <button
              type="button"
              onClick={() =>
                setDraft({
                  ...draft,
                  formations: [
                    ...draft.formations,
                    {
                      id: uid("formation"),
                      title: "NOUVELLE FORMATION",
                      desc: "Description de la nouvelle formation",
                      image: "",
                      icon: "camera",
                      color: "bg-primary",
                    },
                  ],
                })
              }
              className="rounded-md border border-border px-3 py-1.5 text-xs font-semibold"
            >
              Ajouter
            </button>
          </div>

          <div className="mt-4 space-y-4">
            {draft.formations.map((item) => (
              <div key={item.id} className="rounded-lg border border-border p-4">
                <div className="grid gap-3 md:grid-cols-2">
                  <input
                    className="rounded-md border border-border bg-background px-3 py-2 text-sm"
                    value={item.title}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        formations: draft.formations.map((f) =>
                          f.id === item.id ? { ...f, title: e.target.value } : f,
                        ),
                      })
                    }
                    placeholder="Titre"
                  />
                  <input
                    className="rounded-md border border-border bg-background px-3 py-2 text-sm"
                    value={item.image}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        formations: draft.formations.map((f) =>
                          f.id === item.id ? { ...f, image: e.target.value } : f,
                        ),
                      })
                    }
                    placeholder="URL image (https://...)"
                  />
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <label className="cursor-pointer rounded-md border border-border px-3 py-2 text-xs font-semibold">
                    Importer une photo
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(event) => void onFormationFileChange(item.id, event)}
                    />
                  </label>
                  {item.image ? (
                    <img src={item.image} alt={item.title} className="h-14 w-20 rounded-md object-cover border border-border" />
                  ) : null}
                </div>

                <textarea
                  className="mt-3 min-h-20 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  value={item.desc}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      formations: draft.formations.map((f) => (f.id === item.id ? { ...f, desc: e.target.value } : f)),
                    })
                  }
                  placeholder="Description"
                />

                <div className="mt-3 grid gap-3 md:grid-cols-3">
                  <select
                    className="rounded-md border border-border bg-background px-3 py-2 text-sm"
                    value={item.icon}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        formations: draft.formations.map((f) =>
                          f.id === item.id ? { ...f, icon: e.target.value as FormationIcon } : f,
                        ),
                      })
                    }
                  >
                    {ICON_OPTIONS.map((icon) => (
                      <option key={icon} value={icon}>
                        {icon}
                      </option>
                    ))}
                  </select>

                  <select
                    className="rounded-md border border-border bg-background px-3 py-2 text-sm"
                    value={item.color}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        formations: draft.formations.map((f) =>
                          f.id === item.id ? { ...f, color: e.target.value as FormationColor } : f,
                        ),
                      })
                    }
                  >
                    {COLOR_OPTIONS.map((color) => (
                      <option key={color} value={color}>
                        {color}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={() =>
                      setDraft({ ...draft, formations: draft.formations.filter((f) => f.id !== item.id) })
                    }
                    className="rounded-md border border-destructive/40 px-3 py-2 text-sm font-semibold text-destructive"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={`mt-8 rounded-xl border border-border bg-card p-6 ${activeSection === "news" ? "" : "hidden"}`}>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-primary">Actualites</h2>
            <button
              type="button"
              onClick={() =>
                setDraft({
                  ...draft,
                  news: [
                    ...draft.news,
                    {
                      id: uid("news"),
                      date: "01 Janvier 2027",
                      category: "NOUVEAUTE",
                      title: "Nouvelle actualite",
                      desc: "Description de l'actualite",
                      img: "",
                    },
                  ],
                })
              }
              className="rounded-md border border-border px-3 py-1.5 text-xs font-semibold"
            >
              Ajouter
            </button>
          </div>

          <div className="mt-4 space-y-4">
            {draft.news.map((item) => (
              <div key={item.id} className="rounded-lg border border-border p-4">
                <div className="grid gap-3 md:grid-cols-2">
                  <input
                    className="rounded-md border border-border bg-background px-3 py-2 text-sm"
                    value={item.title}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        news: draft.news.map((n) => (n.id === item.id ? { ...n, title: e.target.value } : n)),
                      })
                    }
                    placeholder="Titre"
                  />
                  <input
                    className="rounded-md border border-border bg-background px-3 py-2 text-sm"
                    value={item.img}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        news: draft.news.map((n) => (n.id === item.id ? { ...n, img: e.target.value } : n)),
                      })
                    }
                    placeholder="URL image (https://...)"
                  />
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <label className="cursor-pointer rounded-md border border-border px-3 py-2 text-xs font-semibold">
                    Importer une photo
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(event) => void onNewsFileChange(item.id, event)}
                    />
                  </label>
                  {item.img ? (
                    <img src={item.img} alt={item.title} className="h-14 w-20 rounded-md object-cover border border-border" />
                  ) : null}
                </div>

                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <input
                    className="rounded-md border border-border bg-background px-3 py-2 text-sm"
                    value={item.date}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        news: draft.news.map((n) => (n.id === item.id ? { ...n, date: e.target.value } : n)),
                      })
                    }
                    placeholder="Date (ex: 15 Mars 2026)"
                  />
                  <input
                    className="rounded-md border border-border bg-background px-3 py-2 text-sm"
                    value={item.category}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        news: draft.news.map((n) => (n.id === item.id ? { ...n, category: e.target.value } : n)),
                      })
                    }
                    placeholder="Categorie"
                  />
                </div>

                <textarea
                  className="mt-3 min-h-20 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  value={item.desc}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      news: draft.news.map((n) => (n.id === item.id ? { ...n, desc: e.target.value } : n)),
                    })
                  }
                  placeholder="Description"
                />

                <button
                  type="button"
                  onClick={() => setDraft({ ...draft, news: draft.news.filter((n) => n.id !== item.id) })}
                  className="mt-3 rounded-md border border-destructive/40 px-3 py-2 text-sm font-semibold text-destructive"
                >
                  Supprimer
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className={`mt-8 rounded-xl border border-border bg-card p-6 ${activeSection === "users" ? "" : "hidden"}`}>
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-bold text-primary">Gestion des utilisateurs</h2>
            <button
              type="button"
              onClick={() => void fetchUsers()}
              className="rounded-md border border-border px-3 py-1.5 text-xs font-semibold"
            >
              Actualiser
            </button>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-4">
            <input
              className="rounded-md border border-border bg-background px-3 py-2 text-sm"
              placeholder="Nom complet"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
            />
            <input
              className="rounded-md border border-border bg-background px-3 py-2 text-sm"
              placeholder="Email"
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
            />
            <select
              className="rounded-md border border-border bg-background px-3 py-2 text-sm"
              value={newUserRole}
              onChange={(e) => setNewUserRole(e.target.value)}
            >
              <option value="editor">editor</option>
              <option value="admin">admin</option>
            </select>
            <input
              className="rounded-md border border-border bg-background px-3 py-2 text-sm"
              placeholder="Mot de passe"
              value={newUserPassword}
              onChange={(e) => setNewUserPassword(e.target.value)}
            />
          </div>
          <button
            type="button"
            onClick={() => void createUser()}
            className="mt-3 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white"
          >
            Ajouter utilisateur
          </button>

          <div className="mt-4 space-y-2">
            {users.map((user) => (
              <div key={user.id} className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-border p-3">
                <div className="text-sm">
                  <p className="font-semibold">{user.fullName}</p>
                  <p className="text-muted-foreground">
                    {user.email} - {user.role}
                  </p>
                </div>
                <button
                  type="button"
                  className="rounded-md border border-destructive/40 px-3 py-1.5 text-xs font-semibold text-destructive"
                  onClick={() => void deleteUser(user.id)}
                  disabled={user.id === currentUser.id}
                >
                  Supprimer
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className={`mt-8 rounded-xl border border-border bg-card p-6 ${activeSection === "images" ? "" : "hidden"}`}>
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-bold text-primary">Bibliotheque images</h2>
            <button
              type="button"
              onClick={() => void fetchImages()}
              className="rounded-md border border-border px-3 py-1.5 text-xs font-semibold"
            >
              Actualiser
            </button>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
            {images.map((img) => (
              <div key={img.id} className="rounded-lg border border-border p-2">
                <img
                  src={`${API_BASE}${img.url}`}
                  alt={img.label}
                  className="aspect-square w-full rounded-md object-cover"
                  loading="lazy"
                />
                <p className="mt-2 truncate text-xs text-muted-foreground">{img.label}</p>
                <button
                  type="button"
                  className="mt-2 w-full rounded-md border border-destructive/40 px-2 py-1 text-xs font-semibold text-destructive"
                  onClick={() => void deleteImage(img.id)}
                >
                  Supprimer
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

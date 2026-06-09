import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { Link } from "react-router-dom";
import {
  DEFAULT_SITE_CONTENT,
  useSiteContent,
  type FormationColor,
  type FormationDetailContent,
  type FormationIcon,
  type FormationItem,
  type NewsItem,
  type SiteContent,
} from "@/context/SiteContentContext";
import { emptyFormationDetail, resolveFormationDetail } from "@/lib/formationDetails";
import {
  DEFAULT_REALISATIONS,
  emptyRealisationDetail,
  resolveRealisationDetail,
  type RealisationDetailContent,
  type RealisationItem,
} from "@/lib/realisationDetails";
import { DEFAULT_SITE_GALLERY, type SiteGalleryImage } from "@/lib/siteGallery";

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

function ensureFormationItem(formation: FormationItem): FormationItem {
  return {
    ...formation,
    detail: resolveFormationDetail(formation),
    gallery: formation.gallery ?? [],
  };
}

function ensureNewsItem(news: NewsItem): NewsItem {
  return {
    ...news,
    gallery: news.gallery ?? [],
  };
}

function ensureRealisationItem(item: RealisationItem): RealisationItem {
  return {
    ...item,
    detail: resolveRealisationDetail(item),
    gallery: item.gallery ?? [],
  };
}

function ensureCompleteContent(content?: Partial<SiteContent> | null): SiteContent {
  const formations =
    content?.formations && content.formations.length > 0 ? content.formations : DEFAULT_SITE_CONTENT.formations;
  const news = content?.news && content.news.length > 0 ? content.news : DEFAULT_SITE_CONTENT.news;
  const realisations =
    content?.realisations && content.realisations.length > 0 ? content.realisations : DEFAULT_REALISATIONS;
  return {
    hero: {
      titleTop: content?.hero?.titleTop || DEFAULT_SITE_CONTENT.hero.titleTop,
      titleMiddle: content?.hero?.titleMiddle || DEFAULT_SITE_CONTENT.hero.titleMiddle,
      titleHighlight: content?.hero?.titleHighlight || DEFAULT_SITE_CONTENT.hero.titleHighlight,
      description: content?.hero?.description || DEFAULT_SITE_CONTENT.hero.description,
    },
    formations: formations.map(ensureFormationItem),
    news: news.map(ensureNewsItem),
    realisations: realisations.map(ensureRealisationItem),
    siteGallery:
      content?.siteGallery && content.siteGallery.length > 0 ? content.siteGallery : DEFAULT_SITE_GALLERY,
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

async function resolveImageUpload(file: File, token: string | null): Promise<string> {
  let imageValue = await fileToDataUrl(file);
  if (!token) return imageValue;
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
      return `${API_BASE}${uploaded.url}`;
    }
  } catch {
    // fallback sur data URL locale
  }
  return imageValue;
}

type DetailListField = "program" | "skills" | "outcomes" | "keywords";

function DetailListEditor({
  label,
  items,
  onChange,
  onAdd,
  onRemove,
}: {
  label: string;
  items: string[];
  onChange: (index: number, value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold text-primary">{label}</p>
        <button type="button" onClick={onAdd} className="text-xs font-semibold text-accent underline">
          Ajouter
        </button>
      </div>
      <div className="mt-2 space-y-2">
        {items.map((line, index) => (
          <div key={index} className="flex gap-2">
            <input
              className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm"
              value={line}
              onChange={(e) => onChange(index, e.target.value)}
            />
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="rounded-md border border-destructive/40 px-2 text-xs font-semibold text-destructive"
            >
              X
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Admin() {
  const { content, setContent, resetContent } = useSiteContent();
  const [draft, setDraft] = useState<SiteContent>(content);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<
    "hero" | "formations" | "news" | "realisations" | "galerie" | "users" | "images"
  >("hero");
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

  const updateFormation = (id: string, patch: Partial<FormationItem>) => {
    setDraft({
      ...draft,
      formations: draft.formations.map((f) => (f.id === id ? { ...f, ...patch } : f)),
    });
  };

  const updateFormationDetail = (id: string, patch: Partial<FormationDetailContent>) => {
    const formation = draft.formations.find((f) => f.id === id);
    if (!formation) return;
    const current = resolveFormationDetail(formation);
    updateFormation(id, { detail: { ...current, ...patch } });
  };

  const updateFormationDetailList = (id: string, field: DetailListField, index: number, value: string) => {
    const formation = draft.formations.find((f) => f.id === id);
    if (!formation) return;
    const current = resolveFormationDetail(formation);
    const next = [...current[field]];
    next[index] = value;
    updateFormationDetail(id, { [field]: next });
  };

  const addFormationDetailListItem = (id: string, field: DetailListField) => {
    const formation = draft.formations.find((f) => f.id === id);
    if (!formation) return;
    const current = resolveFormationDetail(formation);
    updateFormationDetail(id, { [field]: [...current[field], ""] });
  };

  const removeFormationDetailListItem = (id: string, field: DetailListField, index: number) => {
    const formation = draft.formations.find((f) => f.id === id);
    if (!formation) return;
    const current = resolveFormationDetail(formation);
    const next = current[field].filter((_, i) => i !== index);
    updateFormationDetail(id, { [field]: next.length > 0 ? next : [""] });
  };

  const onFormationFileChange = async (id: string, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const imageValue = await resolveImageUpload(file, token);
      if (token) setApiStatus("online");
      updateFormation(id, { image: imageValue });
    } catch {
      setApiStatus("offline");
    }
    event.target.value = "";
  };

  const onFormationGalleryFileChange = async (id: string, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const imageValue = await resolveImageUpload(file, token);
      if (token) setApiStatus("online");
      const formation = draft.formations.find((f) => f.id === id);
      if (!formation) return;
      updateFormation(id, { gallery: [...(formation.gallery ?? []), imageValue] });
    } catch {
      setApiStatus("offline");
    }
    event.target.value = "";
  };

  const removeFormationGalleryImage = (id: string, index: number) => {
    const formation = draft.formations.find((f) => f.id === id);
    if (!formation) return;
    updateFormation(id, { gallery: (formation.gallery ?? []).filter((_, i) => i !== index) });
  };

  const updateNews = (id: string, patch: Partial<NewsItem>) => {
    setDraft({
      ...draft,
      news: draft.news.map((n) => (n.id === id ? { ...n, ...patch } : n)),
    });
  };

  const onNewsFileChange = async (id: string, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const imageValue = await resolveImageUpload(file, token);
      if (token) setApiStatus("online");
      updateNews(id, { img: imageValue });
    } catch {
      setApiStatus("offline");
    }
    event.target.value = "";
  };

  const onNewsGalleryFileChange = async (id: string, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const imageValue = await resolveImageUpload(file, token);
      if (token) setApiStatus("online");
      const article = draft.news.find((n) => n.id === id);
      if (!article) return;
      updateNews(id, { gallery: [...(article.gallery ?? []), imageValue] });
    } catch {
      setApiStatus("offline");
    }
    event.target.value = "";
  };

  const removeNewsGalleryImage = (id: string, index: number) => {
    const article = draft.news.find((n) => n.id === id);
    if (!article) return;
    updateNews(id, { gallery: (article.gallery ?? []).filter((_, i) => i !== index) });
  };

  const updateSiteGalleryItem = (id: string, patch: Partial<SiteGalleryImage>) => {
    setDraft({
      ...draft,
      siteGallery: draft.siteGallery.map((img) => (img.id === id ? { ...img, ...patch } : img)),
    });
  };

  const onSiteGalleryFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const imageValue = await resolveImageUpload(file, token);
      if (token) setApiStatus("online");
      setDraft({
        ...draft,
        siteGallery: [
          ...draft.siteGallery,
          {
            id: uid("gallery"),
            src: imageValue,
            alt: file.name.replace(/\.[^.]+$/, ""),
          },
        ],
      });
    } catch {
      setApiStatus("offline");
    }
    event.target.value = "";
  };

  const removeSiteGalleryImage = (id: string) => {
    setDraft({
      ...draft,
      siteGallery: draft.siteGallery.filter((img) => img.id !== id),
    });
  };

  const updateRealisation = (id: string, patch: Partial<RealisationItem>) => {
    setDraft({
      ...draft,
      realisations: draft.realisations.map((r) => (r.id === id ? { ...r, ...patch } : r)),
    });
  };

  const updateRealisationDetail = (id: string, patch: Partial<RealisationDetailContent>) => {
    const item = draft.realisations.find((r) => r.id === id);
    if (!item) return;
    const current = resolveRealisationDetail(item);
    updateRealisation(id, { detail: { ...current, ...patch } });
  };

  const updateRealisationHighlight = (id: string, index: number, value: string) => {
    const item = draft.realisations.find((r) => r.id === id);
    if (!item) return;
    const current = resolveRealisationDetail(item);
    const highlights = [...current.highlights];
    highlights[index] = value;
    updateRealisationDetail(id, { highlights });
  };

  const addRealisationHighlight = (id: string) => {
    const item = draft.realisations.find((r) => r.id === id);
    if (!item) return;
    const current = resolveRealisationDetail(item);
    updateRealisationDetail(id, { highlights: [...current.highlights, ""] });
  };

  const removeRealisationHighlight = (id: string, index: number) => {
    const item = draft.realisations.find((r) => r.id === id);
    if (!item) return;
    const current = resolveRealisationDetail(item);
    const highlights = current.highlights.filter((_, i) => i !== index);
    updateRealisationDetail(id, { highlights: highlights.length > 0 ? highlights : [""] });
  };

  const onRealisationFileChange = async (id: string, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const imageValue = await resolveImageUpload(file, token);
      if (token) setApiStatus("online");
      updateRealisation(id, { image: imageValue });
    } catch {
      setApiStatus("offline");
    }
    event.target.value = "";
  };

  const onRealisationGalleryFileChange = async (id: string, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const imageValue = await resolveImageUpload(file, token);
      if (token) setApiStatus("online");
      const item = draft.realisations.find((r) => r.id === id);
      if (!item) return;
      updateRealisation(id, { gallery: [...(item.gallery ?? []), imageValue] });
    } catch {
      setApiStatus("offline");
    }
    event.target.value = "";
  };

  const removeRealisationGalleryImage = (id: string, index: number) => {
    const item = draft.realisations.find((r) => r.id === id);
    if (!item) return;
    updateRealisation(id, { gallery: (item.gallery ?? []).filter((_, i) => i !== index) });
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
            { id: "realisations", label: "Realisations" },
            { id: "galerie", label: "Galerie" },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() =>
                setActiveSection(
                  item.id as "hero" | "formations" | "news" | "realisations" | "galerie" | "users" | "images",
                )
              }
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
                      detail: emptyFormationDetail(),
                      gallery: [],
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
            {draft.formations.map((item) => {
              const detail = resolveFormationDetail(item);
              const gallery = item.gallery ?? [];
              return (
                <div key={item.id} className="rounded-lg border border-border p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-accent">Carte formation (accueil)</p>
                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    <input
                      className="rounded-md border border-border bg-background px-3 py-2 text-sm"
                      value={item.title}
                      onChange={(e) => updateFormation(item.id, { title: e.target.value })}
                      placeholder="Titre"
                    />
                    <input
                      className="rounded-md border border-border bg-background px-3 py-2 text-sm"
                      value={item.image}
                      onChange={(e) => updateFormation(item.id, { image: e.target.value })}
                      placeholder="URL image principale (https://...)"
                    />
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    <label className="cursor-pointer rounded-md border border-border px-3 py-2 text-xs font-semibold">
                      Importer photo principale
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
                    onChange={(e) => updateFormation(item.id, { desc: e.target.value })}
                    placeholder="Description courte (carte)"
                  />

                  <div className="mt-3 grid gap-3 md:grid-cols-3">
                    <select
                      className="rounded-md border border-border bg-background px-3 py-2 text-sm"
                      value={item.icon}
                      onChange={(e) => updateFormation(item.id, { icon: e.target.value as FormationIcon })}
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
                      onChange={(e) => updateFormation(item.id, { color: e.target.value as FormationColor })}
                    >
                      {COLOR_OPTIONS.map((color) => (
                        <option key={color} value={color}>
                          {color}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={() => setDraft({ ...draft, formations: draft.formations.filter((f) => f.id !== item.id) })}
                      className="rounded-md border border-destructive/40 px-3 py-2 text-sm font-semibold text-destructive"
                    >
                      Supprimer formation
                    </button>
                  </div>

                  <div className="mt-6 rounded-lg border border-dashed border-border bg-background/50 p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-primary">
                      Page &quot;En savoir plus&quot;
                    </p>
                    <textarea
                      className="mt-3 min-h-20 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                      value={detail.intro}
                      onChange={(e) => updateFormationDetail(item.id, { intro: e.target.value })}
                      placeholder="Introduction"
                    />
                    <textarea
                      className="mt-3 min-h-20 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                      value={detail.target}
                      onChange={(e) => updateFormationDetail(item.id, { target: e.target.value })}
                      placeholder="Public cible / objectifs"
                    />

                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <DetailListEditor
                        label="Programme detaille"
                        items={detail.program}
                        onChange={(index, value) => updateFormationDetailList(item.id, "program", index, value)}
                        onAdd={() => addFormationDetailListItem(item.id, "program")}
                        onRemove={(index) => removeFormationDetailListItem(item.id, "program", index)}
                      />
                      <DetailListEditor
                        label="Competences acquises"
                        items={detail.skills}
                        onChange={(index, value) => updateFormationDetailList(item.id, "skills", index, value)}
                        onAdd={() => addFormationDetailListItem(item.id, "skills")}
                        onRemove={(index) => removeFormationDetailListItem(item.id, "skills", index)}
                      />
                      <DetailListEditor
                        label="Debouches possibles"
                        items={detail.outcomes}
                        onChange={(index, value) => updateFormationDetailList(item.id, "outcomes", index, value)}
                        onAdd={() => addFormationDetailListItem(item.id, "outcomes")}
                        onRemove={(index) => removeFormationDetailListItem(item.id, "outcomes", index)}
                      />
                      <DetailListEditor
                        label="Mots-cles"
                        items={detail.keywords}
                        onChange={(index, value) => updateFormationDetailList(item.id, "keywords", index, value)}
                        onAdd={() => addFormationDetailListItem(item.id, "keywords")}
                        onRemove={(index) => removeFormationDetailListItem(item.id, "keywords", index)}
                      />
                    </div>
                  </div>

                  <div className="mt-6 rounded-lg border border-dashed border-border bg-background/50 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-xs font-bold uppercase tracking-wide text-primary">
                        Galerie photos (page detail)
                      </p>
                      <label className="cursor-pointer rounded-md border border-border px-3 py-1.5 text-xs font-semibold">
                        Ajouter une photo
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(event) => void onFormationGalleryFileChange(item.id, event)}
                        />
                      </label>
                    </div>
                    {gallery.length > 0 ? (
                      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                        {gallery.map((src, index) => (
                          <div key={`${src}-${index}`} className="rounded-lg border border-border p-2">
                            <img src={src} alt={`Galerie ${index + 1}`} className="aspect-square w-full rounded-md object-cover" />
                            <button
                              type="button"
                              onClick={() => removeFormationGalleryImage(item.id, index)}
                              className="mt-2 w-full rounded-md border border-destructive/40 px-2 py-1 text-xs font-semibold text-destructive"
                            >
                              Supprimer
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-2 text-xs text-muted-foreground">Aucune photo supplementaire pour le moment.</p>
                    )}
                  </div>
                </div>
              );
            })}
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
                      body: "",
                      gallery: [],
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
            {draft.news.map((item) => {
              const gallery = item.gallery ?? [];
              return (
              <div key={item.id} className="rounded-lg border border-border p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-accent">Carte actualite (accueil)</p>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <input
                    className="rounded-md border border-border bg-background px-3 py-2 text-sm"
                    value={item.title}
                    onChange={(e) => updateNews(item.id, { title: e.target.value })}
                    placeholder="Titre"
                  />
                  <input
                    className="rounded-md border border-border bg-background px-3 py-2 text-sm"
                    value={item.img}
                    onChange={(e) => updateNews(item.id, { img: e.target.value })}
                    placeholder="URL image principale (https://...)"
                  />
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <label className="cursor-pointer rounded-md border border-border px-3 py-2 text-xs font-semibold">
                    Importer photo principale
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
                  placeholder="Description courte (carte)"
                />

                <textarea
                  className="mt-3 min-h-28 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  value={item.body ?? ""}
                  onChange={(e) => updateNews(item.id, { body: e.target.value })}
                  placeholder="Article complet (page Lire la suite)"
                />

                <div className="mt-6 rounded-lg border border-dashed border-border bg-background/50 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs font-bold uppercase tracking-wide text-primary">
                      Galerie photos (page detail)
                    </p>
                    <label className="cursor-pointer rounded-md border border-border px-3 py-1.5 text-xs font-semibold">
                      Ajouter une photo
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(event) => void onNewsGalleryFileChange(item.id, event)}
                      />
                    </label>
                  </div>
                  {gallery.length > 0 ? (
                    <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                      {gallery.map((src, index) => (
                        <div key={`${src}-${index}`} className="rounded-lg border border-border p-2">
                          <img src={src} alt={`Galerie ${index + 1}`} className="aspect-square w-full rounded-md object-cover" />
                          <button
                            type="button"
                            onClick={() => removeNewsGalleryImage(item.id, index)}
                            className="mt-2 w-full rounded-md border border-destructive/40 px-2 py-1 text-xs font-semibold text-destructive"
                          >
                            Supprimer
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-2 text-xs text-muted-foreground">Aucune photo supplementaire pour le moment.</p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setDraft({ ...draft, news: draft.news.filter((n) => n.id !== item.id) })}
                  className="mt-3 rounded-md border border-destructive/40 px-3 py-2 text-sm font-semibold text-destructive"
                >
                  Supprimer actualite
                </button>
              </div>
            );
            })}
          </div>
        </section>

        <section
          className={`mt-8 rounded-xl border border-border bg-card p-6 ${activeSection === "realisations" ? "" : "hidden"}`}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-primary">Nos realisations</h2>
            <button
              type="button"
              onClick={() =>
                setDraft({
                  ...draft,
                  realisations: [
                    ...(draft.realisations ?? DEFAULT_REALISATIONS),
                    {
                      id: uid("realisation"),
                      title: "NOUVELLE REALISATION",
                      desc: "Description de la realisation",
                      image: "",
                      detail: emptyRealisationDetail(),
                      gallery: [],
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
            {(draft.realisations ?? DEFAULT_REALISATIONS).map((item) => {
              const detail = resolveRealisationDetail(item);
              const gallery = item.gallery ?? [];
              return (
                <div key={item.id} className="rounded-lg border border-border p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-accent">Carte realisation (accueil)</p>
                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    <input
                      className="rounded-md border border-border bg-background px-3 py-2 text-sm"
                      value={item.title}
                      onChange={(e) => updateRealisation(item.id, { title: e.target.value })}
                      placeholder="Titre"
                    />
                    <input
                      className="rounded-md border border-border bg-background px-3 py-2 text-sm"
                      value={item.image}
                      onChange={(e) => updateRealisation(item.id, { image: e.target.value })}
                      placeholder="URL image (https://...)"
                    />
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    <label className="cursor-pointer rounded-md border border-border px-3 py-2 text-xs font-semibold">
                      Importer photo principale
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(event) => void onRealisationFileChange(item.id, event)}
                      />
                    </label>
                    {item.image ? (
                      <img src={item.image} alt={item.title} className="h-14 w-20 rounded-md object-cover border border-border" />
                    ) : null}
                  </div>
                  <textarea
                    className="mt-3 min-h-20 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                    value={item.desc}
                    onChange={(e) => updateRealisation(item.id, { desc: e.target.value })}
                    placeholder="Description courte (carte)"
                  />

                  <div className="mt-6 rounded-lg border border-dashed border-border bg-background/50 p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-primary">Page &quot;Voir plus&quot;</p>
                    <textarea
                      className="mt-3 min-h-20 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                      value={detail.intro}
                      onChange={(e) => updateRealisationDetail(item.id, { intro: e.target.value })}
                      placeholder="Introduction"
                    />
                    <textarea
                      className="mt-3 min-h-20 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                      value={detail.context}
                      onChange={(e) => updateRealisationDetail(item.id, { context: e.target.value })}
                      placeholder="Contexte"
                    />
                    <textarea
                      className="mt-3 min-h-20 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                      value={detail.impact}
                      onChange={(e) => updateRealisationDetail(item.id, { impact: e.target.value })}
                      placeholder="Impact"
                    />
                    <div className="mt-4">
                      <DetailListEditor
                        label="Points cles"
                        items={detail.highlights}
                        onChange={(index, value) => updateRealisationHighlight(item.id, index, value)}
                        onAdd={() => addRealisationHighlight(item.id)}
                        onRemove={(index) => removeRealisationHighlight(item.id, index)}
                      />
                    </div>
                  </div>

                  <div className="mt-6 rounded-lg border border-dashed border-border bg-background/50 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-xs font-bold uppercase tracking-wide text-primary">
                        Galerie photos (page detail)
                      </p>
                      <label className="cursor-pointer rounded-md border border-border px-3 py-1.5 text-xs font-semibold">
                        Ajouter une photo
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(event) => void onRealisationGalleryFileChange(item.id, event)}
                        />
                      </label>
                    </div>
                    {gallery.length > 0 ? (
                      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                        {gallery.map((src, index) => (
                          <div key={`${src}-${index}`} className="rounded-lg border border-border p-2">
                            <img src={src} alt={`Galerie ${index + 1}`} className="aspect-square w-full rounded-md object-cover" />
                            <button
                              type="button"
                              onClick={() => removeRealisationGalleryImage(item.id, index)}
                              className="mt-2 w-full rounded-md border border-destructive/40 px-2 py-1 text-xs font-semibold text-destructive"
                            >
                              Supprimer
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-2 text-xs text-muted-foreground">Aucune photo supplementaire pour le moment.</p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setDraft({
                        ...draft,
                        realisations: (draft.realisations ?? DEFAULT_REALISATIONS).filter((r) => r.id !== item.id),
                      })
                    }
                    className="mt-3 rounded-md border border-destructive/40 px-3 py-2 text-sm font-semibold text-destructive"
                  >
                    Supprimer realisation
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        <section className={`mt-8 rounded-xl border border-border bg-card p-6 ${activeSection === "galerie" ? "" : "hidden"}`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-primary">Notre galerie</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Photos affichees dans la section &quot;Notre galerie&quot; sur la page d&apos;accueil.
              </p>
            </div>
            <label className="cursor-pointer rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white">
              Ajouter une photo
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => void onSiteGalleryFileChange(event)}
              />
            </label>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(draft.siteGallery ?? DEFAULT_SITE_GALLERY).map((item) => (
              <div key={item.id} className="rounded-lg border border-border p-3">
                <img src={item.src} alt={item.alt} className="aspect-square w-full rounded-md object-cover" />
                <input
                  className="mt-3 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  value={item.alt}
                  onChange={(e) => updateSiteGalleryItem(item.id, { alt: e.target.value })}
                  placeholder="Legende de la photo"
                />
                <input
                  className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-xs"
                  value={item.src}
                  onChange={(e) => updateSiteGalleryItem(item.id, { src: e.target.value })}
                  placeholder="URL image (https://...)"
                />
                <button
                  type="button"
                  onClick={() => removeSiteGalleryImage(item.id)}
                  className="mt-2 w-full rounded-md border border-destructive/40 px-3 py-1.5 text-xs font-semibold text-destructive"
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

export const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

export function resolveMediaUrl(url: string | undefined): string {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) {
    return url;
  }
  if (url.startsWith("/uploads/")) {
    return `${API_BASE}${url}`;
  }
  return url;
}

export type AccessType = "admin" | "editor";

export const ACCESS_TYPE_LABELS: Record<AccessType, string> = {
  admin: "Administrateur",
  editor: "Éditeur",
};

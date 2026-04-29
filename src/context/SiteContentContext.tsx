import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import photo from "@/assets/photo-1.jpg";
import video from "@/assets/video-1.jpg";
import design from "@/assets/design-1.jpg";
import marketing from "@/assets/formation-marketing.jpg";
import news1 from "@/assets/news-1.jpg";
import news2 from "@/assets/news-2.jpg";
import news3 from "@/assets/news-3.jpg";

export type FormationIcon = "camera" | "video" | "palette" | "bar-chart";
export type FormationColor = "bg-primary" | "bg-accent";

export type FormationItem = {
  id: string;
  title: string;
  desc: string;
  image: string;
  icon: FormationIcon;
  color: FormationColor;
};

export type NewsItem = {
  id: string;
  date: string;
  category: string;
  title: string;
  desc: string;
  img: string;
};

export type HeroContent = {
  titleTop: string;
  titleMiddle: string;
  titleHighlight: string;
  description: string;
};

export type SiteContent = {
  hero: HeroContent;
  formations: FormationItem[];
  news: NewsItem[];
};

type SiteContentContextValue = {
  content: SiteContent;
  setContent: (next: SiteContent) => void;
  resetContent: () => void;
};

const STORAGE_KEY = "zca-site-content-v1";

export const DEFAULT_SITE_CONTENT: SiteContent = {
  hero: {
    titleTop: "FORME-TOI.",
    titleMiddle: "TRAVAILLE.",
    titleHighlight: "SOIS PAYE.",
    description:
      "Zero Chomage Afrique forme et propulse les jeunes vers des opportunites concretes dans les metiers du digital.",
  },
  formations: [
    {
      id: "photo",
      icon: "camera",
      image: photo,
      title: "PHOTOGRAPHIE",
      desc: "Maitrisez la prise de vue, la lumiere et la retouche photo professionnelle.",
      color: "bg-primary",
    },
    {
      id: "video",
      icon: "video",
      image: video,
      title: "VIDEOGRAPHIE & CREATION DE CONTENU",
      desc: "Apprenez a filmer, monter et creer des contenus percutants.",
      color: "bg-accent",
    },
    {
      id: "design",
      icon: "palette",
      image: design,
      title: "DESIGN GRAPHIQUE",
      desc: "Creez des visuels professionnels et des identites impactantes.",
      color: "bg-primary",
    },
    {
      id: "marketing",
      icon: "bar-chart",
      image: marketing,
      title: "MARKETING DIGITAL",
      desc: "Developpez des strategies digitales et generez des resultats.",
      color: "bg-accent",
    },
  ],
  news: [
    {
      id: "news-1",
      img: news1,
      date: "15 Mars 2026",
      category: "FORMATION",
      title: "Lancement de la nouvelle promotion 2026",
      desc: "Plus de 200 jeunes africains rejoignent nos parcours en design, marketing digital, photo et video.",
    },
    {
      id: "news-2",
      img: news2,
      date: "02 Fevrier 2026",
      category: "EVENEMENT",
      title: "Masterclass Entrepreneuriat Numerique",
      desc: "Une journee d'inspiration avec des experts du digital pour booster les ambitions des apprenants.",
    },
    {
      id: "news-3",
      img: news3,
      date: "20 Janvier 2026",
      category: "CEREMONIE",
      title: "Ceremonie de remise des certificats DigiMetier",
      desc: "Plus de 150 diplomes ont recu leur certification apres leur parcours intensif chez Future Horizon.",
    },
  ],
};

const SiteContentContext = createContext<SiteContentContextValue | null>(null);

function getInitialContent(): SiteContent {
  if (typeof window === "undefined") {
    return DEFAULT_SITE_CONTENT;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return DEFAULT_SITE_CONTENT;
  }

  try {
    const parsed = JSON.parse(raw) as SiteContent;
    if (!parsed || !parsed.hero || !Array.isArray(parsed.formations) || !Array.isArray(parsed.news)) {
      return DEFAULT_SITE_CONTENT;
    }
    return parsed;
  } catch {
    return DEFAULT_SITE_CONTENT;
  }
}

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [content, setContentState] = useState<SiteContent>(getInitialContent);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
  }, [content]);

  const value = useMemo<SiteContentContextValue>(
    () => ({
      content,
      setContent: setContentState,
      resetContent: () => setContentState(DEFAULT_SITE_CONTENT),
    }),
    [content],
  );

  return <SiteContentContext.Provider value={value}>{children}</SiteContentContext.Provider>;
}

export function useSiteContent() {
  const ctx = useContext(SiteContentContext);
  if (!ctx) {
    throw new Error("useSiteContent must be used within SiteContentProvider");
  }
  return ctx;
}

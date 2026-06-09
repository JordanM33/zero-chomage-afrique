export type NewsDetailContent = {
  body: string;
  highlights: string[];
};

const DEFAULT_DETAIL: NewsDetailContent = {
  body:
    "Cet evenement s'inscrit dans la dynamique de Zero Chomage Afrique pour former, accompagner et propulser les jeunes vers des opportunites concretes dans le numerique.",
  highlights: [
    "Renforcement des competences pratiques des participants.",
    "Echanges avec des experts et des professionnels du secteur.",
    "Valorisation des parcours et des projets des apprenants.",
  ],
};

const DETAILS_BY_ID: Record<string, NewsDetailContent> = {
  "news-1": {
    body:
      "La promotion 2026 marque une nouvelle etape pour Zero Chomage Afrique avec plus de 200 jeunes inscrits sur nos parcours en design, marketing digital, photographie et videographie. Cette cohorte beneficie d'un programme intensif, oriente terrain, avec des missions reelles et un accompagnement vers l'employabilite.",
    highlights: [
      "Ouverture officielle de la promotion 2026.",
      "Parcours en photo, video, design et marketing digital.",
      "Accompagnement vers l'insertion professionnelle et l'entrepreneuriat.",
    ],
  },
  "news-2": {
    body:
      "La Masterclass Entrepreneuriat Numerique a reuni apprenants, mentors et experts autour des enjeux de creation de valeur, de personal branding et de monetisation des competences digitales. Une journee riche en inspiration, en retours d'experience et en opportunites de networking.",
    highlights: [
      "Interventions d'experts du digital et de l'entrepreneuriat.",
      "Ateliers pratiques et echanges interactifs.",
      "Motivation et orientation vers des objectifs concrets.",
    ],
  },
  "news-3": {
    body:
      "La ceremonie de remise des certificats DigiMetier a honore plus de 150 laureats ayant complete leur parcours intensif. Cet evenement celebre les efforts, les competences acquises et les perspectives professionnelles ouvertes aux participants.",
    highlights: [
      "Remise officielle des certificats aux diplomes.",
      "Reconnaissance des parcours et des projets realises.",
      "Rencontres avec partenaires et professionnels du secteur.",
    ],
  },
};

export function resolveNewsDetail(news: { id: string; desc: string; body?: string }): NewsDetailContent {
  const defaults = DETAILS_BY_ID[news.id] ?? DEFAULT_DETAIL;
  return {
    body: news.body || defaults.body || news.desc,
    highlights: defaults.highlights,
  };
}

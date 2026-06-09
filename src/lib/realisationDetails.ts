import r1 from "@/assets/realisation-1.jpg";
import r2 from "@/assets/realisation-2.jpg";
import r3 from "@/assets/realisation-3.jpg";
import r4 from "@/assets/realisation-4.jpg";

export type RealisationDetailContent = {
  intro: string;
  context: string;
  highlights: string[];
  impact: string;
};

export type RealisationItem = {
  id: string;
  image: string;
  title: string;
  desc: string;
  detail: RealisationDetailContent;
  gallery?: string[];
};

export const DEFAULT_REALISATIONS: RealisationItem[] = [
  {
    id: "formations-cameroun",
    image: r1,
    title: "FORMATIONS AU CAMEROUN",
    desc: "Plusieurs sessions de formations realisees dans les metiers du numerique et du digital.",
    detail: {
      intro:
        "Zero Chomage Afrique a deploye des parcours intensifs au Cameroun pour former des centaines de jeunes aux metiers du digital.",
      context:
        "Ces sessions couvrent la photographie, la videographie, le design graphique et le marketing digital, avec un accompagnement terrain et des projets concrets.",
      highlights: [
        "Sessions pratiques encadrees par des formateurs professionnels.",
        "Ateliers en petits groupes pour un suivi personnalise.",
        "Mise a disposition d'equipements et de logiciels professionnels.",
        "Evaluation continue et certification en fin de parcours.",
      ],
      impact:
        "Des centaines de jeunes ont acquis des competences directement exploitables sur le marche du travail et l'entrepreneuriat digital.",
    },
  },
  {
    id: "masterclass-conferences",
    image: r2,
    title: "MASTERCLASS & CONFERENCES",
    desc: "Des rencontres inspirantes avec des experts pour developper les competences.",
    detail: {
      intro:
        "Nos masterclass reunissent experts du digital, entrepreneurs et apprenants autour de themes strategiques pour l'employabilite.",
      context:
        "Ces evenements permettent d'elargir les horizons, de partager des retours d'experience et de creer des opportunites de networking.",
      highlights: [
        "Interventions de professionnels reconnus du secteur.",
        "Etudes de cas et sessions de questions-reponses.",
        "Echanges entre apprenants, mentors et partenaires.",
        "Themes varies : personal branding, acquisition client, monetisation.",
      ],
      impact:
        "Les participants repartent avec des idees actionnables et un reseau elargi pour accelerer leur insertion professionnelle.",
    },
  },
  {
    id: "eveil-entrepreneurial",
    image: r3,
    title: "EVEIL ENTREPRENEURIAL",
    desc: "Ateliers, incubations et accompagnement de projets de jeunes entrepreneurs.",
    detail: {
      intro:
        "Le programme d'eveil entrepreneurial aide les jeunes a transformer leurs idees en projets viables et durables.",
      context:
        "A travers des ateliers, du mentorat et un accompagnement personnalise, nous structurons les ambitions entrepreneuriales des participants.",
      highlights: [
        "Methodologie de validation d'idee et de business model.",
        "Accompagnement a la creation d'offre et de strategie commerciale.",
        "Sessions de pitch et feedback de mentors experimentes.",
        "Suivi post-formation pour le lancement des activites.",
      ],
      impact:
        "De nombreux porteurs de projet ont lance ou structure leur activite grace a un cadre d'accompagnement concret et exigeant.",
    },
  },
  {
    id: "digimetier-2025",
    image: r4,
    title: "DIGIMETIER 2025",
    desc: "La grande ceremonie de valorisation des talents du digital.",
    detail: {
      intro:
        "DigiMetier 2025 a celebre les parcours, les reussites et l'engagement des talents formes dans l'ecosysteme digital africain.",
      context:
        "Cette ceremonie met en lumiere les competences acquises, les projets realises et les debouches professionnels des apprenants.",
      highlights: [
        "Remise officielle des certificats aux laureats.",
        "Presentation des meilleurs projets et portfolios.",
        "Presence de partenaires institutionnels et professionnels.",
        "Moment de reconnaissance et de motivation pour les nouvelles promotions.",
      ],
      impact:
        "L'evenement renforce la visibilite des talents formes et ouvre des portes vers l'emploi, le freelance et l'entrepreneuriat.",
    },
  },
];

export function emptyRealisationDetail(): RealisationDetailContent {
  return {
    intro: "",
    context: "",
    highlights: [""],
    impact: "",
  };
}

export function resolveRealisationDetail(realisation: {
  id: string;
  detail?: RealisationDetailContent;
}): RealisationDetailContent {
  const defaults = DEFAULT_REALISATIONS.find((item) => item.id === realisation.id)?.detail ?? emptyRealisationDetail();
  if (!realisation.detail) return defaults;
  return {
    intro: realisation.detail.intro || defaults.intro,
    context: realisation.detail.context || defaults.context,
    highlights: realisation.detail.highlights?.length ? realisation.detail.highlights : defaults.highlights,
    impact: realisation.detail.impact || defaults.impact,
  };
}

export function getRealisationById(id: string, items = DEFAULT_REALISATIONS): RealisationItem | undefined {
  return items.find((item) => item.id === id);
}

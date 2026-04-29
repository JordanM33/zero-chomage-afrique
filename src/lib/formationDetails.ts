type FormationDetail = {
  intro: string;
  target: string;
  program: string[];
  skills: string[];
  outcomes: string[];
  keywords: string[];
};

const DETAILS_BY_ID: Record<string, FormationDetail> = {
  photo: {
    intro:
      "Cette formation vous apprend a raconter des histoires fortes avec l'image. Vous passez de debutant a createur capable de produire des photos professionnelles pour des marques, des evenements et des clients prives.",
    target:
      "Ideale pour les jeunes creatifs, les freelances debutants et toute personne qui veut monnayer son talent en photographie.",
    program: [
      "Bases techniques: cadrage, exposition, lumiere naturelle et artificielle.",
      "Direction artistique: storytelling visuel, composition et univers de marque.",
      "Retouche professionnelle avec un workflow optimise pour la livraison client.",
      "Projet reel: shooting complet avec brief, execution et presentation finale.",
    ],
    skills: [
      "Maitriser la prise de vue sur differents contextes.",
      "Produire des images vendables et coherentes avec un objectif business.",
      "Structurer une offre photo claire pour attirer des clients.",
    ],
    outcomes: [
      "Photographe evenementiel",
      "Photographe produit/e-commerce",
      "Freelance photographie",
    ],
    keywords: ["photographie professionnelle", "retouche photo", "storytelling visuel", "freelance creatif"],
  },
  video: {
    intro:
      "La formation videographie vous permet de creer des contenus qui captent l'attention et convertissent. De l'idee au montage final, vous maitrisez une chaine complete de production video.",
    target:
      "Parfaite pour les createurs de contenu, community managers, entrepreneurs et passionnes d'audiovisuel.",
    program: [
      "Pre-production: angle, script, storyboard et preparation du tournage.",
      "Techniques de tournage: plans, mouvements camera, son et lumiere.",
      "Montage dynamique pour reels, clips, contenus YouTube et formats publicitaires.",
      "Publication et optimisation de performance sur les plateformes digitales.",
    ],
    skills: [
      "Concevoir et produire des videos impactantes.",
      "Monter des formats courts et longs orientes engagement.",
      "Transformer une idee en contenu monnayable.",
    ],
    outcomes: ["Videaste freelance", "Monteur video", "Createur de contenu digital"],
    keywords: ["videographie", "montage video", "creation de contenu", "marketing video"],
  },
  design: {
    intro:
      "Cette formation vous donne une methode claire pour creer des visuels qui vendent. Vous apprenez a combiner esthetique, strategie et identite de marque pour livrer des designs a forte valeur.",
    target:
      "Adaptee aux debutants en design, aux entrepreneurs et aux profils qui veulent travailler en agence ou en freelance.",
    program: [
      "Fondamentaux graphiques: typographie, couleurs, hierarchie et composition.",
      "Creation d'identites visuelles et chartes graphiques.",
      "Design pour le digital: reseaux sociaux, ads, interfaces et presentations.",
      "Portfolio professionnel avec cas clients concrets.",
    ],
    skills: [
      "Concevoir une identite visuelle complete et coherente.",
      "Produire rapidement des creations adaptees aux besoins du marche.",
      "Presenter et vendre ses choix design face a un client.",
    ],
    outcomes: ["Graphic designer", "Brand designer", "Freelance design graphique"],
    keywords: ["design graphique", "identite visuelle", "branding", "communication visuelle"],
  },
  marketing: {
    intro:
      "La formation marketing digital vous aide a passer de simple utilisateur des reseaux a profil capable de generer des resultats mesurables pour une marque ou un business.",
    target:
      "Recommandee pour entrepreneurs, etudiants, assistants marketing et toute personne cherchant des competences fortement demandees.",
    program: [
      "Strategie marketing: positionnement, cible, offre et tunnel de conversion.",
      "Acquisition: reseaux sociaux, publicite digitale et contenus performants.",
      "Outils et analytics: mesure de performance, KPIs et optimisation continue.",
      "Etude de cas complete avec plan d'action exploitable immediatement.",
    ],
    skills: [
      "Construire une strategie digitale orientee croissance.",
      "Piloter des campagnes et analyser les resultats.",
      "Generer des leads et des ventes avec des actions concretes.",
    ],
    outcomes: ["Community manager", "Traffic manager junior", "Consultant marketing digital"],
    keywords: ["marketing digital", "acquisition", "strategie digitale", "conversion"],
  },
};

export function getFormationDetailById(id: string): FormationDetail {
  return (
    DETAILS_BY_ID[id] ?? {
      intro:
        "Cette formation est concue pour vous donner des competences pratiques, applicables rapidement sur des projets reels et recherchees sur le marche du travail.",
      target:
        "Elle s'adresse aux jeunes, porteurs de projet et professionnels en reconversion qui veulent monter en competence.",
      program: [
        "Module 1: fondamentaux et outils indispensables.",
        "Module 2: pratique guidee avec exercices progressifs.",
        "Module 3: projet concret pour valider les acquis.",
        "Module 4: accompagnement vers l'employabilite.",
      ],
      skills: [
        "Appliquer une methode professionnelle sur des cas reels.",
        "Produire des livrables de qualite adaptes au marche.",
        "Valoriser ses competences dans un portfolio solide.",
      ],
      outcomes: ["Freelance", "Collaborateur en entreprise", "Prestataire de services digitaux"],
      keywords: ["formation professionnelle", "competences digitales", "employabilite", "metiers du digital"],
    }
  );
}

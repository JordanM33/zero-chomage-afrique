import { Award, Users, Briefcase, Monitor, Rocket } from "lucide-react";

const REASONS = [
  {
    icon: Award,
    title: "FORMATION CERTIFIANTE",
    desc: "Obtiens une certification valorisable sur le marche, preuve concrete de tes competences et de ta capacite a livrer des resultats professionnels.",
  },
  {
    icon: Users,
    title: "ACCOMPAGNEMENT PERSONNALISÉ",
    desc: "Chaque apprenant avance avec un mentor, un plan de progression clair et des retours reguliers pour accelerer sa montee en competence.",
  },
  {
    icon: Briefcase,
    title: "MISSIONS RÉMUNÉRÉES",
    desc: "Transforme rapidement ton apprentissage en revenus grace a des missions reelles, encadrees et adaptees a ton niveau.",
  },
  {
    icon: Monitor,
    title: "MATÉRIEL PROFESSIONNEL",
    desc: "Travaille avec les outils, logiciels et methodes utilises sur le terrain pour etre operationnel des la fin de ta formation.",
  },
  {
    icon: Rocket,
    title: "ÉVEIL ENTREPRENEURIAL",
    desc: "Developpe l'esprit d'initiative, apprends a structurer une offre claire et construis un projet durable a fort impact.",
  },
];

export const WhyUs = () => {
  return (
    <section id="a-propos" className="relative py-20 bg-primary text-white overflow-hidden">
      {/* subtle pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--accent))_0%,transparent_40%),radial-gradient(circle_at_80%_80%,hsl(var(--accent))_0%,transparent_40%)]" />

      <div className="container-zca relative">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-center">
          POURQUOI <span className="text-accent">NOUS CHOISIR ?</span>
        </h2>
        <p className="text-center text-white/70 mt-2">Un programme complet, gratuit et orienté résultats</p>

        <div className="mt-14 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {REASONS.map((r, i) => (
            <div key={i} className="text-center group">
              <div className="mx-auto h-16 w-16 grid place-items-center mb-4 transition-base group-hover:scale-110">
                <r.icon className="h-12 w-12 text-white" strokeWidth={1.5} />
              </div>
              <h3 className="font-display font-bold text-sm tracking-wide leading-tight">{r.title}</h3>
              <p className="mt-2 text-xs text-white/70 leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

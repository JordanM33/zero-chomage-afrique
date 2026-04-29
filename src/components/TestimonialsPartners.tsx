import { useState } from "react";
import t1 from "@/assets/testimonial-1.jpg";
import t2 from "@/assets/testimonial-2.jpg";
import t3 from "@/assets/testimonial-3.jpg";
import partnerPhoto1 from "@/assets/partner-photo-1.png";
import partnerPhoto2 from "@/assets/partner-photo-2.png";
import partnerPhoto3 from "@/assets/partner-photo-3.png";

const TESTIMONIALS = [
  {
    img: t1,
    name: "Aïssatou M.",
    role: "Community Manager",
    quote:
      "Avant, je ne savais rien faire sur ordinateur. Aujourd'hui, je suis community manager et je gagne ma vie grâce à Zéro Chômage Afrique.",
  },
  {
    img: t2,
    name: "Karim D.",
    role: "Vidéaste indépendant",
    quote:
      "La formation m'a donné les compétences techniques et la confiance pour lancer mon studio vidéo en moins d'un an.",
  },
  {
    img: t3,
    name: "Sandra K.",
    role: "Designer Graphique",
    quote:
      "Un accompagnement personnalisé exceptionnel. Je travaille aujourd'hui avec des marques internationales depuis Abidjan.",
  },
  {
    img: t1,
    name: "Kevin A.",
    role: "Photographe Freelance",
    quote:
      "En quelques mois, je suis passe de passionne a professionnel. J'ai signe mes premiers contrats grace au portfolio construit pendant la formation.",
  },
  {
    img: t2,
    name: "Nadine B.",
    role: "Assistante Marketing Digital",
    quote:
      "Les cours sont pratiques, concrets et orientés terrain. Aujourd'hui, je gere des campagnes qui donnent de vrais resultats.",
  },
  {
    img: t3,
    name: "Landry T.",
    role: "Monteur Video",
    quote:
      "J'ai appris a produire des reels et videos publicitaires qui convertissent. Mes clients me recommandent pour la qualite de mon travail.",
  },
  {
    img: t1,
    name: "Prisca E.",
    role: "Entrepreneure Creative",
    quote:
      "L'eveil entrepreneurial m'a aidee a lancer mon activite avec une strategie claire, des offres solides et une communication plus impactante.",
  },
  {
    img: t2,
    name: "Moussa O.",
    role: "Community Manager Junior",
    quote:
      "Le suivi personnalise m'a donne confiance. Je gere maintenant plusieurs pages d'entreprises et je vis de mes competences digitales.",
  },
  {
    img: t3,
    name: "Rachel N.",
    role: "Graphiste Independante",
    quote:
      "J'ai appris a structurer mes services, fixer mes prix et livrer des visuels professionnels. Mon activite est devenue stable.",
  },
  {
    img: t1,
    name: "Didier C.",
    role: "Videaste Evenementiel",
    quote:
      "La qualite de l'encadrement est remarquable. Je couvre maintenant des evenements majeurs et je facture des prestations premium.",
  },
];

const PARTNERS = [
  { type: "photo", label: "Membre Future Horizon", src: partnerPhoto1 },
  { type: "photo", label: "Equipe terrain", src: partnerPhoto2 },
  { type: "photo", label: "Talent forme", src: partnerPhoto3 },
] as const;

export const TestimonialsPartners = () => {
  const [idx, setIdx] = useState(0);
  const t = TESTIMONIALS[idx];

  return (
    <section className="py-16 bg-primary-deep text-white">
      <div className="container-zca grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        {/* Testimonials */}
        <div>
          <h3 className="text-accent font-display font-bold text-lg tracking-wide">TÉMOIGNAGES</h3>
          <p className="text-white/70 text-sm mt-1">Ils ont été formés, ils témoignent !</p>

          <div className="mt-6 flex items-start gap-4">
            <img
              src={t.img}
              alt={t.name}
              loading="lazy"
              width={80}
              height={80}
              className="h-16 w-16 rounded-full object-cover ring-2 ring-accent shrink-0"
            />
            <div>
              <p className="text-sm leading-relaxed text-white/90 italic">"{t.quote}"</p>
              <p className="mt-3 text-sm font-bold">{t.name}</p>
              <p className="text-xs text-white/60">{t.role}</p>
            </div>
          </div>

          <div className="flex gap-2 mt-6">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                aria-label={`Témoignage ${i + 1}`}
                onClick={() => setIdx(i)}
                className={`h-2 rounded-full transition-base ${
                  i === idx ? "w-8 bg-accent" : "w-2 bg-white/30 hover:bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Partners */}
        <div className="lg:border-l lg:border-white/15 lg:pl-12">
          <h3 className="font-display font-bold text-lg text-center lg:text-left">
            ILS <span className="text-accent">NOUS FONT CONFIANCE</span>
          </h3>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {PARTNERS.map((p) => (
              <div key={p.label} className="rounded-lg overflow-hidden shadow-card hover:scale-105 transition-base">
                <img src={p.src} alt={p.label} className="h-full w-full object-cover aspect-square" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

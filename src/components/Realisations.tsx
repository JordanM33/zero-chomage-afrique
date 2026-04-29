import { ArrowRight } from "lucide-react";
import r1 from "@/assets/realisation-1.jpg";
import r2 from "@/assets/realisation-2.jpg";
import r3 from "@/assets/realisation-3.jpg";
import r4 from "@/assets/realisation-4.jpg";

const ITEMS = [
  { img: r1, title: "FORMATIONS AU CAMEROUN", desc: "Plusieurs sessions de formations réalisées dans les métiers du numérique et du digital." },
  { img: r2, title: "MASTERCLASS & CONFÉRENCES", desc: "Des rencontres inspirantes avec des experts pour développer les compétences." },
  { img: r3, title: "ÉVEIL ENTREPRENEURIAL", desc: "Ateliers, incubations et accompagnement de projets de jeunes entrepreneurs." },
  { img: r4, title: "DIGIMÉTIER 2025", desc: "La grande cérémonie de valorisation des talents du digital." },
];

export const Realisations = () => {
  return (
    <section id="realisations" className="py-20 bg-secondary">
      <div className="container-zca">
        <h2 className="section-heading">
          NOS <span className="text-accent">RÉALISATIONS</span>
        </h2>
        <p className="section-subheading">Des actions concrètes, des résultats mesurables</p>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {ITEMS.map((it, i) => (
            <article
              key={i}
              className="group rounded-xl bg-background overflow-hidden shadow-card hover:shadow-elevated transition-smooth hover:-translate-y-1"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={it.img}
                  alt={it.title}
                  loading="lazy"
                  width={800}
                  height={600}
                  className="w-full h-full object-cover transition-smooth group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <h3 className="font-display font-bold text-accent text-sm tracking-wide leading-tight">{it.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{it.desc}</p>
                <a
                  href="#"
                  className="mt-4 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-primary hover:gap-2 transition-base"
                >
                  Voir plus <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

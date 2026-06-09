import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { DEFAULT_SITE_CONTENT, useSiteContent } from "@/context/SiteContentContext";

export const Realisations = () => {
  const {
    content: { realisations },
  } = useSiteContent();
  const items = realisations.length > 0 ? realisations : DEFAULT_SITE_CONTENT.realisations;

  return (
    <section id="realisations" className="py-20 bg-secondary">
      <div className="container-zca">
        <h2 className="section-heading">
          NOS <span className="text-accent">RÉALISATIONS</span>
        </h2>
        <p className="section-subheading">Des actions concrètes, des résultats mesurables</p>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((it) => (
            <article
              key={it.id}
              className="group rounded-xl bg-background overflow-hidden shadow-card hover:shadow-elevated transition-smooth hover:-translate-y-1"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={it.image}
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
                <Link
                  to={`/realisations/${it.id}`}
                  className="mt-4 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-primary hover:gap-2 transition-base"
                >
                  Voir plus <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

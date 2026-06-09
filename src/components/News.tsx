import { Calendar, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { DEFAULT_SITE_CONTENT, useSiteContent } from "@/context/SiteContentContext";

export const News = () => {
  const {
    content: { news },
  } = useSiteContent();
  const newsItems = news.length > 0 ? news : DEFAULT_SITE_CONTENT.news;

  return (
    <section id="actualites" className="py-20 bg-background">
      <div className="container-zca">
        <h2 className="section-heading">
          NOS <span className="text-accent">ACTUALITÉS</span>
        </h2>
        <p className="section-subheading">Restez informés de nos derniers événements et annonces</p>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {newsItems.map((it) => (
            <article
              key={it.id}
              className="group rounded-xl bg-background overflow-hidden shadow-card hover:shadow-elevated transition-smooth hover:-translate-y-1 border border-border"
            >
              <div className="aspect-[16/10] overflow-hidden relative">
                <img
                  src={it.img}
                  alt={it.title}
                  loading="lazy"
                  width={1024}
                  height={640}
                  className="w-full h-full object-cover transition-smooth group-hover:scale-105"
                />
                <span className="absolute top-3 left-3 bg-accent text-accent-foreground text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded">
                  {it.category}
                </span>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  {it.date}
                </div>
                <h3 className="mt-2 font-display font-bold text-primary text-base leading-snug">
                  {it.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{it.desc}</p>
                <Link
                  to={`/actualites/${it.id}`}
                  className="mt-4 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-accent hover:gap-2 transition-base"
                >
                  Lire la suite <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

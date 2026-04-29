import { Camera, Video, Palette, BarChart3, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { DEFAULT_SITE_CONTENT, useSiteContent, type FormationIcon } from "@/context/SiteContentContext";

const ICONS: Record<FormationIcon, typeof Camera> = {
  camera: Camera,
  video: Video,
  palette: Palette,
  "bar-chart": BarChart3,
};

export const Formations = () => {
  const {
    content: { formations },
  } = useSiteContent();
  const formationsItems = formations.length > 0 ? formations : DEFAULT_SITE_CONTENT.formations;

  return (
    <section id="formations" className="py-20 bg-background">
      <div className="container-zca">
        <h2 className="section-heading">
          NOS <span className="text-accent">FORMATIONS</span>
        </h2>
        <p className="section-subheading">Des formations pratiques pour des métiers d'avenir</p>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {formationsItems.map((f) => {
            const Icon = ICONS[f.icon] ?? Camera;
            return (
            <article
              key={f.id}
              className="group rounded-xl bg-secondary overflow-hidden shadow-card hover:shadow-elevated transition-smooth hover:-translate-y-1"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={f.image}
                  alt={f.title}
                  loading="lazy"
                  width={800}
                  height={600}
                  className="w-full h-full object-cover transition-smooth group-hover:scale-105"
                />
                <div
                  className={`absolute top-3 left-3 ${f.color} h-12 w-12 rounded-full grid place-items-center shadow-elevated`}
                >
                  <Icon className="h-6 w-6 text-white" strokeWidth={2} />
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-display font-bold text-primary text-base leading-tight min-h-[3rem]">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                <Link
                  to={`/formations/${f.id}`}
                  className="mt-4 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-accent hover:gap-2 transition-base"
                >
                  En savoir plus <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

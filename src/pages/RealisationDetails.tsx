import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { DEFAULT_SITE_CONTENT, useSiteContent } from "@/context/SiteContentContext";
import { resolveRealisationDetail } from "@/lib/realisationDetails";

export default function RealisationDetails() {
  const { id } = useParams<{ id: string }>();
  const {
    content: { realisations },
  } = useSiteContent();
  const items = realisations.length > 0 ? realisations : DEFAULT_SITE_CONTENT.realisations;
  const realisation = items.find((item) => item.id === id);

  if (!realisation || !id) {
    return (
      <main className="min-h-screen bg-background py-16">
        <div className="container-zca max-w-3xl">
          <h1 className="font-display text-3xl font-black text-primary">Realisation introuvable</h1>
          <p className="mt-3 text-muted-foreground">Cette realisation n'existe pas ou a ete retiree.</p>
          <Link to="/" className="mt-6 inline-flex items-center gap-2 text-accent font-semibold">
            <ArrowLeft className="h-4 w-4" />
            Retour a l'accueil
          </Link>
        </div>
      </main>
    );
  }

  const detail = resolveRealisationDetail(realisation);
  const gallery = realisation.gallery ?? [];

  return (
    <main className="min-h-screen bg-background py-10">
      <div className="container-zca max-w-5xl">
        <Link to="/#realisations" className="inline-flex items-center gap-2 text-sm font-semibold text-accent">
          <ArrowLeft className="h-4 w-4" />
          Retour aux realisations
        </Link>

        <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card">
          <img src={realisation.image} alt={realisation.title} className="h-72 w-full object-cover md:h-96" />
          {gallery.length > 0 ? (
            <div className="grid grid-cols-2 gap-1 border-b border-border sm:grid-cols-3 md:grid-cols-4">
              {gallery.map((src, index) => (
                <img
                  key={`${src}-${index}`}
                  src={src}
                  alt={`${realisation.title} - photo ${index + 1}`}
                  className="aspect-[4/3] w-full object-cover"
                  loading="lazy"
                />
              ))}
            </div>
          ) : null}
          <div className="p-6 md:p-10">
            <h1 className="font-display text-3xl font-black text-primary md:text-4xl">{realisation.title}</h1>
            <p className="mt-4 text-base leading-relaxed text-foreground">{detail.intro}</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{detail.context}</p>

            <section className="mt-8">
              <h2 className="text-lg font-bold text-primary">Points cles</h2>
              <ul className="mt-3 space-y-2">
                {detail.highlights.map((line, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-accent shrink-0" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-8 rounded-xl border border-border bg-secondary/50 p-5">
              <h2 className="text-lg font-bold text-primary">Impact</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{detail.impact}</p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

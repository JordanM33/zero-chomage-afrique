import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { useSiteContent } from "@/context/SiteContentContext";
import { resolveFormationDetail } from "@/lib/formationDetails";
import { REGISTRATION_URL } from "@/lib/links";

export default function FormationDetails() {
  const { id } = useParams<{ id: string }>();
  const {
    content: { formations },
  } = useSiteContent();

  const formation = formations.find((item) => item.id === id);

  if (!formation || !id) {
    return (
      <main className="min-h-screen bg-background py-16">
        <div className="container-zca max-w-3xl">
          <h1 className="font-display text-3xl font-black text-primary">Formation introuvable</h1>
          <p className="mt-3 text-muted-foreground">
            La formation demandee n'existe pas ou a ete supprimee depuis l'administration.
          </p>
          <Link to="/" className="mt-6 inline-flex items-center gap-2 text-accent font-semibold">
            <ArrowLeft className="h-4 w-4" />
            Retour a l'accueil
          </Link>
        </div>
      </main>
    );
  }

  const detail = resolveFormationDetail(formation);
  const gallery = formation.gallery ?? [];

  return (
    <main className="min-h-screen bg-background py-10">
      <div className="container-zca max-w-5xl">
        <Link to="/#formations" className="inline-flex items-center gap-2 text-sm font-semibold text-accent">
          <ArrowLeft className="h-4 w-4" />
          Retour aux formations
        </Link>

        <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card">
          <img src={formation.image} alt={formation.title} className="h-72 w-full object-cover md:h-96" />
          {gallery.length > 0 ? (
            <div className="grid grid-cols-2 gap-1 border-b border-border sm:grid-cols-3 md:grid-cols-4">
              {gallery.map((src, index) => (
                <img
                  key={`${src}-${index}`}
                  src={src}
                  alt={`${formation.title} - photo ${index + 1}`}
                  className="aspect-[4/3] w-full object-cover"
                  loading="lazy"
                />
              ))}
            </div>
          ) : null}
          <div className="p-6 md:p-10">
            <h1 className="font-display text-3xl font-black text-primary md:text-4xl">{formation.title}</h1>
            <p className="mt-4 text-base leading-relaxed text-foreground">{detail.intro}</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{detail.target}</p>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <section>
                <h2 className="text-lg font-bold text-primary">Programme detaille</h2>
                <ul className="mt-3 space-y-2">
                  {detail.program.map((line, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-accent shrink-0" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-bold text-primary">Competences acquises</h2>
                <ul className="mt-3 space-y-2">
                  {detail.skills.map((line, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-accent shrink-0" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            <section className="mt-8">
              <h2 className="text-lg font-bold text-primary">Debouches possibles</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {detail.outcomes.map((outcome) => (
                  <span
                    key={outcome}
                    className="rounded-full border border-border bg-secondary px-3 py-1 text-xs font-semibold text-primary"
                  >
                    {outcome}
                  </span>
                ))}
              </div>
            </section>

            <section className="mt-8">
              <h2 className="text-lg font-bold text-primary">Mots-cles de la formation</h2>
              <p className="mt-2 text-sm text-muted-foreground">{detail.keywords.join(" - ")}</p>
            </section>

            <a
              href={REGISTRATION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-bold text-white transition-base hover:opacity-90"
            >
              Je m'inscris maintenant
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}

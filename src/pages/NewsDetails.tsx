import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Calendar, CheckCircle2 } from "lucide-react";
import { DEFAULT_SITE_CONTENT, useSiteContent } from "@/context/SiteContentContext";
import { resolveNewsDetail } from "@/lib/newsDetails";
import { REGISTRATION_URL } from "@/lib/links";

export default function NewsDetails() {
  const { id } = useParams<{ id: string }>();
  const {
    content: { news },
  } = useSiteContent();
  const newsItems = news.length > 0 ? news : DEFAULT_SITE_CONTENT.news;
  const article = newsItems.find((item) => item.id === id);

  if (!article || !id) {
    return (
      <main className="min-h-screen bg-background py-16">
        <div className="container-zca max-w-3xl">
          <h1 className="font-display text-3xl font-black text-primary">Actualite introuvable</h1>
          <p className="mt-3 text-muted-foreground">Cette actualite n'existe pas ou a ete supprimee.</p>
          <Link to="/" className="mt-6 inline-flex items-center gap-2 text-accent font-semibold">
            <ArrowLeft className="h-4 w-4" />
            Retour a l'accueil
          </Link>
        </div>
      </main>
    );
  }

  const detail = resolveNewsDetail(article);
  const gallery = article.gallery ?? [];

  return (
    <main className="min-h-screen bg-background py-10">
      <div className="container-zca max-w-5xl">
        <Link to="/#actualites" className="inline-flex items-center gap-2 text-sm font-semibold text-accent">
          <ArrowLeft className="h-4 w-4" />
          Retour aux actualites
        </Link>

        <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card">
          <div className="relative">
            <img src={article.img} alt={article.title} className="h-72 w-full object-cover md:h-96" />
            <span className="absolute top-4 left-4 rounded bg-accent px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-accent-foreground">
              {article.category}
            </span>
          </div>
          {gallery.length > 0 ? (
            <div className="grid grid-cols-2 gap-1 border-b border-border sm:grid-cols-3 md:grid-cols-4">
              {gallery.map((src, index) => (
                <img
                  key={`${src}-${index}`}
                  src={src}
                  alt={`${article.title} - photo ${index + 1}`}
                  className="aspect-[4/3] w-full object-cover"
                  loading="lazy"
                />
              ))}
            </div>
          ) : null}
          <div className="p-6 md:p-10">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {article.date}
            </div>
            <h1 className="mt-3 font-display text-3xl font-black text-primary md:text-4xl">{article.title}</h1>
            <p className="mt-4 text-base font-medium leading-relaxed text-foreground">{article.desc}</p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground whitespace-pre-line">{detail.body}</p>

            <section className="mt-8">
              <h2 className="text-lg font-bold text-primary">A retenir</h2>
              <ul className="mt-3 space-y-2">
                {detail.highlights.map((line, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-accent shrink-0" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
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

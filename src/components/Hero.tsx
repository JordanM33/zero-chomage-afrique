import { ArrowRight, Calendar, GraduationCap, Briefcase, TrendingUp, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Counter } from "@/components/Counter";
import heroImg from "@/assets/hero-students.jpg";
import { REGISTRATION_URL } from "@/lib/links";
import { DEFAULT_SITE_CONTENT, useSiteContent } from "@/context/SiteContentContext";

export const Hero = () => {
  const { content } = useSiteContent();
  const hero = content.hero?.titleTop ? content.hero : DEFAULT_SITE_CONTENT.hero;

  return (
    <section id="accueil" className="relative pt-20">
      <div className="relative min-h-[640px] lg:min-h-[680px] overflow-hidden">
        <img
          src={heroImg}
          alt="Jeunes africains formés au digital — Zéro Chômage Afrique"
          className="absolute inset-0 w-full h-full object-cover"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-hero-overlay" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-deep/90 via-primary/60 to-transparent" />

        <div className="container-zca relative z-10 py-20 lg:py-28">
          <div className="max-w-2xl animate-fade-up">
            <h1 className="font-display font-black text-white text-3xl sm:text-4xl lg:text-5xl xl:text-6xl leading-[1.1] tracking-tight max-w-4xl">
              {hero.titleTop} {hero.titleMiddle}{" "}
              <span className="text-accent">{hero.titleHighlight}</span>
            </h1>
            <p className="mt-6 text-lg text-white/85 max-w-lg leading-relaxed">
              {hero.description}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button variant="cta" size="xl" asChild>
                <a href={REGISTRATION_URL} target="_blank" rel="noopener noreferrer">
                  S'INSCRIRE MAINTENANT <ArrowRight className="ml-1" />
                </a>
              </Button>
              <Button variant="heroOutline" size="xl" asChild>
                <a href="#test">
                  PASSER LE TEST <Calendar className="ml-1" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats band */}
      <div className="bg-primary text-white">
        <div className="container-zca grid grid-cols-2 lg:grid-cols-4 gap-6 py-8">
          {[
            {
              icon: GraduationCap,
              end: 12835,
              prefix: "+ ",
              label: "Jeunes, Femmes et Handicapés formés",
            },
            {
              icon: Briefcase,
              end: 685,
              prefix: "+ ",
              label: "missions terrains réalisées dans les entreprises",
            },
            {
              icon: TrendingUp,
              label: "d'accompagnement au financement d'entreprise",
              text: "+ de 85 865 000 Fcfa",
            },
            { icon: MapPin, label: "Présence", text: "Cameroun\nCôte d'ivoire", stacked: true },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-4">
              <s.icon className="h-9 w-9 text-accent shrink-0" strokeWidth={1.75} />
              <div>
                <div className="text-xl lg:text-2xl font-display font-bold">
                  {s.stacked ? (
                    <span className="flex flex-col leading-tight">
                      <span>{s.text?.split("\n")[0]}</span>
                      <span>{s.text?.split("\n")[1]}</span>
                    </span>
                  ) : s.text ? (
                    s.text
                  ) : (
                    <Counter end={s.end!} prefix={s.prefix} />
                  )}
                </div>
                <div className="text-sm text-white/70">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

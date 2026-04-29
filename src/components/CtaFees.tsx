import { ArrowRight, ShieldCheck, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { REGISTRATION_URL } from "@/lib/links";

const ADVANTAGES = [
  "La disponibilité et la protection du matériel",
  "Les licences logicielles professionnelles",
  "La location d'équipements supplémentaires",
  "La connexion internet et autres commodités",
];

export const CtaFees = () => {
  return (
    <section id="inscription" className="py-16 bg-primary text-white">
      <div className="container-zca grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* CTA */}
        <div>
          <h2 className="font-display font-bold text-3xl md:text-4xl leading-tight">
            PRÊT À CHANGER <span className="text-accent">TON AVENIR ?</span>
          </h2>
          <p className="mt-3 text-white/80">
            Rejoins la prochaine cohorte et deviens acteur de ta réussite.
          </p>
          <Button variant="cta" size="xl" className="mt-6" asChild>
            <a href={REGISTRATION_URL} target="_blank" rel="noopener noreferrer">
              S'INSCRIRE MAINTENANT <ArrowRight className="ml-1" />
            </a>
          </Button>
        </div>

        {/* Fees */}
        <div className="bg-background text-foreground rounded-xl p-6 sm:p-8 shadow-elevated">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-lg bg-primary grid place-items-center shrink-0">
              <ShieldCheck className="h-6 w-6 text-accent" />
            </div>
            <div>
              <h3 className="font-display font-bold text-primary text-sm tracking-wide">
                PARTICIPATION AUX FRAIS D'ASSURANCE ET DE FORMATION
              </h3>
              <div className="font-display font-black text-primary text-4xl mt-1">
                30 000 <span className="text-2xl">FCFA</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Cette contribution permet de garantir :
              </p>
            </div>
          </div>

          <ul className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
            {ADVANTAGES.map((a) => (
              <li key={a} className="flex items-start gap-2 text-sm text-foreground">
                <Check className="h-4 w-4 text-success shrink-0 mt-0.5" />
                <span>{a}</span>
              </li>
            ))}
          </ul>

          <div className="mt-5 pt-4 border-t border-border text-xs text-center text-muted-foreground font-medium tracking-wide">
            PAIEMENT EN PRÉSENTIEL LORS DE LA RENCONTRE DE LANCEMENT DU PROGRAMME
          </div>
        </div>
      </div>
    </section>
  );
};

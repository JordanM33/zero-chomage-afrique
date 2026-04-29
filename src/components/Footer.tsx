import { Phone, Mail, MapPin, Facebook, Youtube, Linkedin, BookOpen } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { REGISTRATION_URL } from "@/lib/links";
import { downloadStudentGuide } from "@/lib/downloadGuide";

const QUICK: [string, string, boolean?][] = [
  ["Accueil", "#accueil"],
  ["À propos", "#a-propos"],
  ["Formations", "#formations"],
  ["Réalisations", "#realisations"],
  ["Actualités", "#actualites"],
  ["Galerie", "#galerie"],
  ["Contact", "#contact"],
  ["Inscription", REGISTRATION_URL, true],
];

export const Footer = () => {
  return (
    <footer id="contact" className="bg-primary-deep text-white">
      <div className="container-zca py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <Logo variant="light" />
        </div>

        <div>
          <h4 className="font-display font-bold text-sm tracking-wide mb-4">LIENS RAPIDES</h4>
          <div className="grid grid-cols-2 gap-y-2">
            {QUICK.map(([label, href, external]) => (
              <a
                key={label}
                href={href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                className="text-sm text-white/70 hover:text-accent transition-base"
              >
                {label}
              </a>
            ))}
            <button
              type="button"
              onClick={downloadStudentGuide}
              className="text-sm text-white/70 hover:text-accent transition-base text-left"
            >
              Guide étudiant
            </button>
          </div>
          <Button variant="cta" size="sm" className="mt-5" onClick={downloadStudentGuide}>
            <BookOpen className="h-4 w-4" />
            TÉLÉCHARGER LE GUIDE
          </Button>
        </div>

        <div>
          <h4 className="font-display font-bold text-sm tracking-wide mb-4">CONTACTEZ-NOUS</h4>
          <ul className="space-y-3 text-sm text-white/70">
            <li className="flex items-start gap-2">
              <Phone className="h-4 w-4 text-accent shrink-0 mt-0.5" />
              <div className="flex flex-col">
                <a href="tel:+22505450773 73" className="hover:text-accent transition-base">
                  Côte d'Ivoire : +225 05 45 07 73 73
                </a>
                <a href="tel:+237658281992" className="hover:text-accent transition-base">
                  Cameroun : +237 658 28 19 92
                </a>
              </div>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-accent shrink-0" />
              <a href="mailto:africauphorizon@gmail.com" className="hover:text-accent transition-base break-all">
                africauphorizon@gmail.com
              </a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-accent shrink-0 mt-0.5" />
              <div className="flex flex-col gap-2">
                <div>
                  <p className="font-semibold text-white">Abidjan – Côte d'Ivoire</p>
                  <p>
                    Cocody – Angré Nouveau CHU, allant vers le Rond-Point Saint-Viateur,
                    145 Rue Bonoua – Bessikoi
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-white">Yaoundé – Cameroun</p>
                  <p>
                    Biyem Assi, allant vers le Lycée de Biyem Assi I, Mairie d'Ekounou
                  </p>
                </div>
              </div>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-bold text-sm tracking-wide mb-4">RESTONS CONNECTÉS</h4>
          <p className="text-sm text-white/70">Abonne-toi pour recevoir nos actualités</p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="mt-3 flex gap-2"
          >
            <Input
              type="email"
              placeholder="Votre e-mail"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-accent"
            />
            <Button variant="cta" type="submit">S'ABONNER</Button>
          </form>
          <div className="flex gap-3 mt-5">
            {([
              { Icon: Facebook, href: "https://www.facebook.com/profile.php?id=61572976396264", label: "Facebook" },
              { Icon: Youtube, href: "#", label: "YouTube" },
              { Icon: Linkedin, href: "#", label: "LinkedIn" },
            ]).map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                aria-label={label}
                className="h-9 w-9 rounded-full bg-white/10 grid place-items-center hover:bg-accent transition-base"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-zca py-5 text-center text-xs text-white/50">
          © 2025 Zéro Chômage Afrique – Tous droits réservés.
        </div>
      </div>
    </footer>
  );
};

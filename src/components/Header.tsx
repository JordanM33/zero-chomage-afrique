import { useEffect, useState } from "react";
import { Menu, X, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { REGISTRATION_URL } from "@/lib/links";
import { downloadStudentGuide } from "@/lib/downloadGuide";

const NAV = [
  { href: "#accueil", label: "Accueil" },
  { href: "#a-propos", label: "À propos" },
  { href: "#formations", label: "Formations" },
  { href: "#realisations", label: "Réalisations" },
  { href: "#actualites", label: "Actualités" },
  { href: "#galerie", label: "Galerie" },
  { href: "#contact", label: "Contact" },
];

export const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-base ${
        scrolled ? "bg-background/95 backdrop-blur shadow-card" : "bg-background/70 backdrop-blur"
      }`}
    >
      <div className="container-zca flex items-center justify-between gap-4 h-20">
        <Logo />

        <nav className="hidden lg:flex items-center gap-3 xl:gap-5">
          {NAV.map((item, i) => (
            <a
              key={item.href}
              href={item.href}
              className={`text-[12px] xl:text-[13px] font-semibold tracking-wide uppercase whitespace-nowrap transition-base hover:text-accent ${
                i === 0 ? "text-accent" : "text-primary"
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-2 shrink-0">
          <Button variant="outline" size="sm" asChild>
            <Link to="/admin" className="whitespace-nowrap">
              ADMIN
            </Link>
          </Button>
          <Button variant="outline" size="sm" onClick={downloadStudentGuide} className="whitespace-nowrap">
            <BookOpen className="h-4 w-4" />
            <span className="hidden xl:inline">GUIDE</span>
          </Button>
          <Button variant="cta" size="sm" asChild>
            <a href={REGISTRATION_URL} target="_blank" rel="noopener noreferrer" className="whitespace-nowrap">S'INSCRIRE</a>
          </Button>
        </div>

        <button
          className="lg:hidden p-2 text-primary"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden bg-background border-t border-border animate-fade-in">
          <nav className="container-zca flex flex-col py-4 gap-1">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="py-3 text-sm font-semibold uppercase text-primary hover:text-accent border-b border-border/50"
              >
                {item.label}
              </a>
            ))}
            <Button
              variant="outline"
              className="mt-4"
              asChild
            >
              <Link to="/admin" onClick={() => setOpen(false)}>
                ADMIN
              </Link>
            </Button>
            <Button
              variant="outline"
              className="mt-2"
              onClick={() => {
                setOpen(false);
                downloadStudentGuide();
              }}
            >
              <BookOpen className="h-4 w-4" />
              GUIDE ÉTUDIANT
            </Button>
            <Button variant="cta" className="mt-2" asChild>
              <a
                href={REGISTRATION_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
              >
                S'INSCRIRE
              </a>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

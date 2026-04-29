import g1 from "@/assets/gallery-1.jpg";
import g2 from "@/assets/gallery-2.jpg";
import g3 from "@/assets/gallery-3.jpg";
import g4 from "@/assets/gallery-4.jpg";
import g5 from "@/assets/gallery-5.jpg";
import p2 from "@/assets/photo-2.jpg";
import p3 from "@/assets/photo-3.jpg";
import p4 from "@/assets/photo-4.jpg";
import v2 from "@/assets/video-2.jpg";
import v3 from "@/assets/video-3.jpg";
import d2 from "@/assets/design-2.jpg";

const IMAGES = [
  { src: g1, alt: "Cérémonie de remise des diplômes Future Horizon" },
  { src: g2, alt: "Accueil d'une autorité officielle à Future Horizon" },
  { src: g3, alt: "Invités d'honneur lors d'un événement Future Horizon" },
  { src: g4, alt: "Moment convivial avec un membre de la communauté" },
  { src: g5, alt: "Photo de groupe de la communauté Future Horizon" },
  { src: p2, alt: "Atelier pratique de photographie en studio" },
  { src: p3, alt: "Étudiant en photographie capturant une scène" },
  { src: p4, alt: "Apprenti photographe en plein shooting" },
  { src: v2, alt: "Régie de production vidéo multi-caméras" },
  { src: v3, alt: "Tournage en équipe avec caméras professionnelles" },
  { src: d2, alt: "Étudiants travaillant sur le manuel de cours en design graphique" },
];

export const Gallery = () => {
  return (
    <section id="galerie" className="py-20 bg-secondary">
      <div className="container-zca">
        <h2 className="section-heading">
          NOTRE <span className="text-accent">GALERIE</span>
        </h2>
        <p className="section-subheading">
          Plongez dans l'univers Future Horizon en images
        </p>

        <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-4">
          {IMAGES.map((img, i) => (
            <div
              key={i}
              className={`group relative overflow-hidden rounded-xl shadow-card hover:shadow-elevated transition-smooth ${
                i === 0 ? "md:row-span-2 md:col-span-1 aspect-square md:aspect-auto" : "aspect-square"
              }`}
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                width={1024}
                height={1024}
                className="w-full h-full object-cover transition-smooth group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-base" />
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-base">
                <p className="text-white text-xs font-semibold">{img.alt}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

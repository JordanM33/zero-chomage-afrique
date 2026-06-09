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

export type SiteGalleryImage = {
  id: string;
  src: string;
  alt: string;
};

export const DEFAULT_SITE_GALLERY: SiteGalleryImage[] = [
  { id: "gallery-1", src: g1, alt: "Ceremonie de remise des diplomes Future Horizon" },
  { id: "gallery-2", src: g2, alt: "Accueil d'une autorite officielle a Future Horizon" },
  { id: "gallery-3", src: g3, alt: "Invites d'honneur lors d'un evenement Future Horizon" },
  { id: "gallery-4", src: g4, alt: "Moment convivial avec un membre de la communaute" },
  { id: "gallery-5", src: g5, alt: "Photo de groupe de la communaute Future Horizon" },
  { id: "gallery-6", src: p2, alt: "Atelier pratique de photographie en studio" },
  { id: "gallery-7", src: p3, alt: "Etudiant en photographie capturant une scene" },
  { id: "gallery-8", src: p4, alt: "Apprenti photographe en plein shooting" },
  { id: "gallery-9", src: v2, alt: "Regie de production video multi-cameras" },
  { id: "gallery-10", src: v3, alt: "Tournage en equipe avec cameras professionnelles" },
  { id: "gallery-11", src: d2, alt: "Etudiants travaillant sur le manuel de cours en design graphique" },
];

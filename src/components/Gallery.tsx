import { DEFAULT_SITE_CONTENT, useSiteContent } from "@/context/SiteContentContext";

export const Gallery = () => {
  const {
    content: { siteGallery },
  } = useSiteContent();
  const images = siteGallery.length > 0 ? siteGallery : DEFAULT_SITE_CONTENT.siteGallery;

  return (
    <section id="galerie" className="py-20 bg-secondary">
      <div className="container-zca">
        <h2 className="section-heading">
          NOTRE <span className="text-accent">GALERIE</span>
        </h2>
        <p className="section-subheading">Plongez dans l'univers Future Horizon en images</p>

        <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((img, i) => (
            <div
              key={img.id}
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

import { Link } from "react-router-dom";
import logoOfficial from "@/assets/logo-official.jpg";

export const Logo = ({ variant = "dark" }: { variant?: "dark" | "light" }) => {
  return (
    <Link
      to="/"
      className="flex items-center group"
      aria-label="Future Horizon — Zéro Chômage Afrique"
    >
      <img
        src={logoOfficial}
        alt="Future Horizon — Zéro Chômage Afrique : Former, Propulser, Transformer"
        className={`h-12 sm:h-14 md:h-16 w-auto object-contain transition-base group-hover:scale-[1.02] ${
          variant === "light" ? "bg-white rounded-md p-1.5" : ""
        }`}
        loading="eager"
        decoding="async"
      />
    </Link>
  );
};

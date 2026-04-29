import { toast } from "@/hooks/use-toast";
import { STUDENT_GUIDE_URL, STUDENT_GUIDE_FILENAME } from "@/lib/links";

export const downloadStudentGuide = async () => {
  const toastId = toast({
    title: "Téléchargement en cours…",
    description: "Préparation du Guide de l'étudiant (18 Mo).",
  });

  try {
    const response = await fetch(STUDENT_GUIDE_URL);
    if (!response.ok) throw new Error("Network error");
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = STUDENT_GUIDE_FILENAME;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);

    toastId.update({
      id: toastId.id,
      title: "Téléchargement lancé ✅",
      description: "Le guide est en cours de téléchargement.",
    });
  } catch (e) {
    toastId.update({
      id: toastId.id,
      title: "Échec du téléchargement",
      description: "Veuillez réessayer dans un instant.",
      variant: "destructive",
    });
  }
};

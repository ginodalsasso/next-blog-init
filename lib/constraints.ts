import { z } from "zod";

// Définir le schéma de validation avec Zod
export const articleConstraints = z.object({
    title: z.string().min(5, {
        message: "Le titre doit comporter au moins 5 caractères.",
    }),
    text: z.string().min(50, {
        message:
            "Le contenu de l'article doit comporter au moins 50 caractères.",
    }),
    slug: z.string().min(5, {
        message: "Le slug est obligatoire.",
    }),
});
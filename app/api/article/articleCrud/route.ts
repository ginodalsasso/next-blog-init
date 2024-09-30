import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
    try {
        const { title, slug, text } = await req.json(); // Récupérez les données du corps de la requête
        const newArticle = await db.article.create({ // Créez un nouvel Article
            data: { 
                title,
                slug,
                text,
                createdAt: new Date(),
            },
        });
        return NextResponse.json(newArticle, { status: 201 });
    } catch (error) {
        console.error("[CREATE_ARTICLE_ERROR]", error);
    }
}

// export async function DELETE (req: NextRequest) {
//     try {
//         const { id } = await req.json(); // Récupère l'id du commentaire à supprimer
//         await db.comment.delete({ where: { id } }); // Supprime le commentaire
//         return NextResponse.json({ message: "Commentaire supprimé" });
//     } catch (error) {
//         console.error("[DELETE_COMMENT_ERROR]", error);
//     }
// }

// export async function PUT (req: NextRequest) {
//     try {
//         const { id, text } = await req.json(); // Récupère l'id et le texte du commentaire
//         const updatedComment = await db.comment.update({ // Met à jour le commentaire
//             where: { id },
//             data: { text },
//         });
//         return NextResponse.json(updatedComment);
//     } catch (error) {
//         console.error("[UPDATE_COMMENT_ERROR]", error);
//     }
// }
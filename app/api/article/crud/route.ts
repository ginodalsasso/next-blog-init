import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
    try {
        const { text, userId, articleId } = await req.json(); // Récupérez les données du corps de la requête
        const newComment = await db.comment.create({ // Créez un nouveau commentaire
            data: { 
                text,
                userId,
                articleId,
                createdAt: new Date(),
            },
        });
        return NextResponse.json(newComment, { status: 201 });
    } catch (error) {
        console.error("[CREATE_COMMENT_ERROR]", error);
    }
}

export async function DELETE (req: NextRequest) {
    try {
        const { id } = await req.json(); // Récupère l'id du commentaire à supprimer
        await db.comment.delete({ where: { id } }); // Supprime le commentaire
        return NextResponse.json({ message: "Commentaire supprimé" });
    } catch (error) {
        console.error("[DELETE_COMMENT_ERROR]", error);
    }
}
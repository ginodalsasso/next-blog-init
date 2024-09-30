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

export async function DELETE (req: NextRequest) {
    try {
        const { id } = await req.json(); // Récupère l'id de l'article à supprimer
        await db.article.delete({ where: { id } }); // Supprime l'article
        return NextResponse.json({ message: "Article supprimé" });
    } catch (error) {
        console.error("[DELETE_ARTICLE_ERROR]", error);
    }
}

export async function PUT (req: NextRequest) {
    try {
        const { id, title, slug, text } = await req.json(); // Récupère les données du corps de la requête
        const updatedArticle = await db.article.update({ // Met à jour l'article
            where: { id },
            data: { 
                title, 
                slug, 
                text 
            },
        });
        return NextResponse.json(updatedArticle);
    } catch (error) {
        console.error("[UPDATE_ARTICLE_ERROR]", error);
    }
}
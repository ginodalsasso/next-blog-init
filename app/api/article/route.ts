import { db } from "@/lib/db";
import { NextResponse } from "next/server";


export async function GET() {
    try {
        // Récupérer les articles
        const articles = await db.article.findMany({ // db=prisma article=modèle findMany=méthode
            orderBy: { 
                createdAt: 'desc'
            },
            include: { // Inclure les tags (jointure)
                tags: {
                    include: { tag: true } 
                }
            }

        }); 
        return NextResponse.json(articles); // Retourner les articles en json

    } catch(error) {
        console.log("[ARTICLES]", error); // Afficher l'erreur dans la console
        return new NextResponse("Internal Error", {status: 500 }); // Retourner une erreur 500
    }
}
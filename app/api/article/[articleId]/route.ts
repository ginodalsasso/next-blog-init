import { db } from "@/lib/db";
import { longFormatters } from "date-fns";
import { NextRequest, NextResponse } from "next/server";

// GET /api/article/[articleId]
export async function GET(req: NextRequest, { params }: { params: { articleId: string } }) {
    // Récupérer l'id de l'article
    const { articleId } = params; //const articleId = params.articleId;
    
    try {
        // Récupérer un article par son id
        const article = await db.article.findUnique({ // db=prisma article=modèle findUnique=méthode
            where: {
                id: articleId // id=id de l'article
            },
            include: { // (jointure)
                tags: { // Inclure les tags
                    include: { tag: true }
                }, 
                comments: {  // Inclure les commentaires
                    orderBy: {
                        createdAt: 'desc'
                    },
                } 
            }
        }) 

        return NextResponse.json(article); // Retourner les articles en json

    } catch(error) {
        console.log("[ARTICLE]", error); // Afficher l'erreur dans la console
        return new NextResponse("Internal Error", {status: 500 }); // Retourner une erreur 500
    }

} 
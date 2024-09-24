import { db } from "@/lib/db";
import { NextResponse } from "next/server";


export async function GET() {
    try {
        // Récupérer les articles
        const tags = await db.tag.findMany({ // db=prisma tag=modèle findMany=méthode
            orderBy: { 
                name: 'asc'
            }
        }); 
        return NextResponse.json(tags); // Retourner les articles en json

    } catch(error) {
        console.log("[TAGS]", error); // Afficher l'erreur dans la console
        return new NextResponse("Internal Error", {status: 500 }); // Retourner une erreur 500
    }
}
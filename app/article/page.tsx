import { db } from "@/lib/db";
import React from "react";

const ArticlePage = async () => {

    // Récupérer les articles
    const articles = await db.article.findMany({
        orderBy: { createdAt: 'desc'}
    }); // db=prisma article=modèle findMany=méthode

    return <div>
        <h1 className="mb-4">Blog</h1>

        {/* Liste des articles */}
        { articles.map((article: any) => (
            <div key={article.id} className="mb-6">
                <h2 className="text-2xl font-semibold text-emerald-500">{article.title}</h2>
                <p>{article.text}</p>
            </div>
        )) }
    </div>;
};

export default ArticlePage;

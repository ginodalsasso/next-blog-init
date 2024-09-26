'use client' // Mode strict du JavaScript pour éviter des erreurs courantes

import React, { useEffect, useState } from "react";
import ArticleCard from "@/components/ArticleCard";
import Link from "next/link";

const ArticlePage = () => {
    const [articles, setArticles] = useState<ArticleWithTagsAndComments[]>([]); // Initialiser la liste des articles

    useEffect(() => {
        const fetchArticles = async () => {
            const response = await fetch('/api/article'); // Appeler l'API article
            const data: ArticleWithTagsAndComments[] = await response.json(); // Récupérer les données en json
            setArticles(data); // Mettre à jour la liste des articles
        };

        fetchArticles(); // Appeler la fonction fetchArticles
    }, []); // Appeler la fonction fetchArticles au chargement de la page

    return <>
        <h1 className="text-4xl font-bold mb-6">Blog</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Liste des articles */}
            { articles.map((article) => (
                <Link key={article.id} href={`/article/${article.id}`}>
                    <ArticleCard article={article} />
                </Link>
            )) }
        </div>
    </>;
};

export default ArticlePage;
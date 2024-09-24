'use client'

import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import React, { useEffect, useState } from "react";

const ArticlePage = () => {
    const [articles, setArticles] = useState([]); // Initialiser la liste des articles

    useEffect(() => {
        const fetchArticles = async () => {
            const response = await fetch('/api/article'); // Appeler l'API article
            const data = await response.json(); // Récupérer les données en json
            setArticles(data); // Mettre à jour la liste des articles
        };

        fetchArticles(); // Appeler la fonction fetchArticles
    }, []); // Appeler la fonction fetchArticles au chargement de la page

    return <div>
        <h1 className="mb-4">Blog</h1>

        {/* Liste des articles */}
        { articles.map((article: any) => (
            <div key={article.id} className="mb-6">
                <h2 className="text-2xl font-semibold text-emerald-500">{article.title}</h2>

                <p>{formatDate(article.createdAt)}</p>

                {article.tags.map((tagArticle: any) => (
                    <span key={tagArticle.tag.id} className="mr-2 text-sm text-gray-500">
                        {tagArticle.tag.name}
                    </span>
                ))}

                <p>{article.text}</p>
            </div>
        )) }
    </div>;
};

export default ArticlePage;

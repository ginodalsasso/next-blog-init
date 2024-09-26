'use client' // Passer le composant en composant client, Next proposant de base des composants serveurs

import Tag from "@/components/Tag";
import React, { useEffect, useState } from "react";

const ArticleDetailPage = ({ params }: { params: { articleId: string } }) => {
    
    const [article, setArticle] = useState<ArticleWithTagsAndComments | null>(null); // Initialiser l'article

useEffect(() => {
    const fetchArticle = async () => {
        const response = await fetch(`/api/article/${params.articleId}`); // Appeler l'API article
        const data: ArticleWithTagsAndComments = await response.json(); // Récupérer les données en json
        setArticle(data); // Mettre à jour l'article
    };

    fetchArticle(); // Appeler la fonction fetchArticle

}, [params.articleId]); // Appeler la fonction fetchArticle au chargement de la page

    return (
        <div>
            <h1>{article?.title}</h1>
            <p>{article?.text}</p>
            <div>
                {article?.tags.map((tagArticle: TagArticleType) => (
                    <Tag key={tagArticle.tag.id} text={tagArticle.tag.name}/>
                ))}
            </div>
        </div>
    )
}; 

export default ArticleDetailPage;

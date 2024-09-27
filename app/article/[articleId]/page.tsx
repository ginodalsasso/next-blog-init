'use client';

import Tag from "@/components/Tag";
import React, { useEffect, useState } from "react";

const ArticleDetailPage = ({ params }: { params: { articleId: string } }) => {
    const [article, setArticle] = useState<ArticleWithTagsAndComments | null>(null);
    const [form, setForm] = useState<CommentType>({ 
        text: "", 
        id: "", 
        userId: "", 
        articleId: params.articleId 
    });

    
    // Récupérer les données de l'article
    useEffect(() => {
        const fetchArticle = async () => {
            const response = await fetch(`/api/article/${params.articleId}`);
            const data: ArticleWithTagsAndComments = await response.json();
            setArticle(data);
        };

        fetchArticle();
    }, [params.articleId]);



    // Créez une fonction `create` pour envoyer les données du formulaire
    async function create(data: CommentType) {
        try {
            await fetch('/api/article/create', {
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'POST'
            });
            setForm({ text: "", id: "", userId: "", articleId: params.articleId }); // Réinitialisez le formulaire
        } catch (error) {
            console.log("[CREATE_COMMENT]", error);
        }
    }
    // Créez une fonction `handleSubmit` pour gérer la soumission du formulaire
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const userId = "user_id";
        
        // Créez un nouvel objet `comment` avec les données du formulaire
        const comment: CommentType = {
            ...form, // Utilisez les données du formulaire
            userId,
            createdAt: new Date()
        };

        await create(comment); // Appelez la fonction `create` avec le nouvel objet
    };



    return (
        <div className="border rounded-lg p-6 xl:w-[70%] mx-auto">
            <h1 className="text-4xl font-semibold text-emerald-500 text-center mb-2">{article?.title}</h1>
            <div className="flex justify-center mb-6">
                {article?.tags.map((tagArticle: TagArticleType) => (
                    <Tag key={tagArticle.tag.id} text={tagArticle.tag.name} />
                ))}
            </div>
            <p className="mx-auto text-center w-[90%] p-4 bg-slate-700 rounded-md">{article?.text}</p>

            <form 
                onSubmit={handleSubmit}
                className="flex flex-col w-full mt-10"
            >
                <textarea
                    placeholder="Content" 
                    value={form.text}
                    onChange={e => setForm({ ...form, text: e.target.value })}
                    className="border border-gray-300 p-2 rounded mb-4 text-black"
                />

                <button 
                    type="submit"
                    className="bg-emerald-500 text-white p-2 rounded"
                >
                    Submit  
                </button>
            </form>
        </div>
    );
}; 

export default ArticleDetailPage;

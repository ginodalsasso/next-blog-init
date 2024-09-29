'use client';

import Tag from "@/components/Tag";
import Comment from "@/components/Comment";  // Assurez-vous d'importer le composant Comment
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";  // Importez le hook `useUser`

const ArticleDetailPage = ({ params }: { params: { articleId: string } }) => {
    const [article, setArticle] = useState<ArticleWithTagsAndComments | null>(null); // État pour stocker l'article et les commentaires associés
    const [form, setForm] = useState<CommentType>({ 
        text: "", 
        id: "", 
        userId: "", 
        articleId: params.articleId 
    });

    const { user } = useUser(); // useUser pour récupérer l'utilisateur connecté

    // Récupérer les données de l'article
    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const response = await fetch(`/api/article/${params.articleId}`);
                const data: ArticleWithTagsAndComments = await response.json();
                setArticle(data);
            } catch (error) {
                console.error("Erreur lors de la récupération de l'article:", error);
            }
        };

        fetchArticle();
    }, [params.articleId]);

    // Créez une fonction `createComment` pour envoyer les données du formulaire
    async function createComment(data: CommentType) {
        try {
            await fetch('/api/article/crud', {
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'POST'
            });
            setForm({ text: "", id: "", userId: "", articleId: params.articleId }); // Réinitialise le formulaire

            // Mettre à jour les commentaires après la soumission
            setArticle(prevArticle => {
                if (!prevArticle) return prevArticle; // Vérifie si l'article existe
                // Retourne l'article avec le nouveau commentaire
                return {
                    ...prevArticle, // Garde les données de l'article
                    comments: [...prevArticle.comments, data] // Ajoute le commentaire à la liste
                };
            });
        } catch (error) {
            console.log("[CREATE_COMMENT]", error);
        }
    }

    // fonction `handleSubmit` pour gérer la soumission du formulaire
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Vérifie si l'utilisateur est connecté
        if (!user) {
            console.log("Utilisateur non connecté");
            return;
        }
        
        // nouvel objet `comment` avec les données du formulaire
        const newComment: CommentType = {
            ...form, // données du formulaire
            userId: user.id, // id de l'utilisateur connecté
            createdAt: new Date()
        };

        await createComment(newComment); // fonction `createComment` avec le nouvel objet
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

            {/* Affichage des commentaires */}
            <div className="flex flex-col items-center mt-10">
                {article?.comments.map((commentArticle: CommentType) => (
                    <Comment 
                        key={commentArticle.id} 
                        userId={commentArticle.userId}
                        createdAt={commentArticle.createdAt} 
                        text={commentArticle.text} 
                    />
                ))}
            </div>
        </div>
    );
}; 

export default ArticleDetailPage;

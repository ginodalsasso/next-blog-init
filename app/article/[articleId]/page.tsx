"use client";

import React, { useEffect, useState } from "react";
import Tag from "@/components/Tag";
import CommentDetail from "../comments/[commentId]/comment"; // Importation du composant CommentDetail
import { z } from "zod";

// Définir le schéma pour les commentaires
const commentSchema = z.object({
    text: z.string().min(5, "Le texte du commentaire ne peut pas être vide"),
});

const ArticleDetailPage = ({ params }: { params: { articleId: string } }) => {
    const [article, setArticle] = useState<ArticleWithTagsAndComments | null>(null); // État pour stocker l'article et les commentaires associés.

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


    // Fonction `createComment` pour envoyer les données du formulaire
    async function createComment(data: CommentType) {
        // Valide les données avec zod avant de les envoyer à l'API
        const validateData = commentSchema.safeParse({ text: data.text });
        if (!validateData.success) {
            console.error("Validation error:", validateData.error);
            return; // Arrêter si la validation échoue
        }

        const newComment: CommentType = {
            ...data, 
            text: validateData.data.text,
        };

        try {
            await fetch("/api/article/commentCrud", {
                body: JSON.stringify(validateData.data), // Converti les données validées en JSON pour l'envoi
                headers: { "Content-Type": "application/json" },
                method: "POST",
            });
            // Mettre à jour l'état de l'article après l'ajout du commentaire
            setArticle((prevArticle) => {
                if (!prevArticle) return prevArticle; 
                return {
                    ...prevArticle, 
                    comments: [...prevArticle.comments, newComment], // Ajoute le commentaire validé à la liste
                } as ArticleWithTagsAndComments; // as pour forcer le type attendu par Typescript
            });
        } catch (error) {
            console.log("[CREATE_COMMENT]", error);
        }
    }

    // Fonction `deleteComment` pour supprimer le commentaire
    async function deleteComment(commentId: string) {
        try {
            await fetch(`/api/article/commentCrud`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: commentId }), // Envoie l'ID du commentaire à supprimer
            });
            setArticle((prevArticle) => {
                if (!prevArticle) return prevArticle; // Vérifie si l'article existe
                return {
                    ...prevArticle, // Garde les données de l'article
                    comments: prevArticle.comments.filter((comment) => comment.id !== commentId), // Supprime le commentaire
                };
            });
        } catch (error) {
            console.log("[DELETE_COMMENT]", error);
        }
    }

    // Fonction `editComment` pour modifier le commentaire
    async function editComment(data: CommentType) {
        // Valider les données avec zod avant de les envoyer à l'API
        const validateUpdtatedData = commentSchema.safeParse({ text: data.text });
        if (!validateUpdtatedData.success) {
            console.error("Validation error:", validateUpdtatedData.error);
            return; // Arrêter si la validation échoue
        }

        const updatedComment: CommentType = {
            ...data, 
            text: validateUpdtatedData.data.text,
        };

        try {
            await fetch(`/api/article/commentCrud`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(validateUpdtatedData.data),
            });
            setArticle((prevArticle) => {
                if (!prevArticle) return prevArticle; // Vérifie si l'article existe
                return {
                    ...prevArticle, // Garde les données de l'article
                    comments: prevArticle.comments.map((comment) =>
                        comment.id === updatedComment.id ? updatedComment : comment // Met à jour le commentaire correspondant
                    ),
                };
            });
        } catch (error) {
            console.error("[UPDATE_COMMENT]", error);
        }
    }


    return (
        <div className="border rounded-lg p-6 xl:w-[70%] mx-auto">
            <h1 className="text-4xl font-semibold text-emerald-500 text-center mb-2">{article?.title}</h1>
            <div className="flex justify-center mb-6">
                {article?.tags.map((tagArticle: TagArticleType) => (
                    <Tag key={tagArticle.tag.id} text={tagArticle.tag.name} />
                ))}
            </div>
            <p className="mx-auto text-center w-[90%] p-4 bg-slate-700 rounded-md">{article?.text}</p>

            {/* CommentDetail pour la gestion des commentaires */}
            <CommentDetail
                comments={article?.comments || []}
                articleId={params.articleId}
                onAddComment={createComment}
                onDeleteComment={deleteComment}
                onEditComment={editComment}
            />
        </div>
    );
};

export default ArticleDetailPage;

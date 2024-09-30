"use client";

import React, { useEffect, useState } from "react";
import Tag from "@/components/Tag";
import CommentDetail from "../comments/[commentId]/comment"; // Importation du composant CommentDetail
import Button from "@/components/Button";
import DeleteArticle from "./delete/page";


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
        try {
            await fetch("/api/article/commentCrud", {
                body: JSON.stringify(data),
                headers: { "Content-Type": "application/json" },
                method: "POST",
            });
            setArticle((prevArticle) => {
                if (!prevArticle) return prevArticle; // Vérifie si l'article existe
                return {
                    ...prevArticle, // Garde les données de l'article
                    comments: [...prevArticle.comments, data], // Ajoute le commentaire à la liste
                };
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
    async function editComment(updatedComment: CommentType) {
        try {
            await fetch(`/api/article/commentCrud`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedComment),
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
            <div className="flex justify-end gap-2">
                <Button href={`/article/${params.articleId}/edit`} style="fa-solid fa-edit" />
                {/* <Button href="/" style="fa-solid fa-trash"/> */}
                {article && <DeleteArticle article={article} />}

            </div>
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

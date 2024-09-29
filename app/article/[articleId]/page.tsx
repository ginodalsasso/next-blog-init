"use client";

import Tag from "@/components/Tag";
import Comment from "@/components/Comment"; // Assurez-vous d'importer le composant Comment
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs"; // Importez le hook `useUser`

const ArticleDetailPage = ({ params }: { params: { articleId: string } }) => {
    const [article, setArticle] = useState<ArticleWithTagsAndComments | null>(
        null
    ); // État pour stocker l'article et les commentaires associés
    const [form, setForm] = useState<CommentType>({
        text: "",
        id: "",
        userId: "",
        articleId: params.articleId,
    });

    const { user } = useUser(); // useUser pour récupérer l'utilisateur connecté

    // Récupérer les données de l'article
    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const response = await fetch(
                    `/api/article/${params.articleId}`
                );
                const data: ArticleWithTagsAndComments = await response.json();
                setArticle(data);
            } catch (error) {
                console.error(
                    "Erreur lors de la récupération de l'article:",
                    error
                );
            }
        };

        fetchArticle();
    }, [params.articleId]);

    // fonction `createComment` pour envoyer les données du formulaire _____________________________CREATE
    async function createComment(data: CommentType) {
        try {
            await fetch("/api/article/crud", {
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json",
                },
                method: "POST",
            });
            setForm({
                // Réinitialise le formulaire
                text: "",
                id: "",
                userId: "",
                articleId: params.articleId,
            });

            // Mettre à jour les commentaires après la soumission
            setArticle((prevArticle) => {
                if (!prevArticle) return prevArticle; // Vérifie si l'article existe
                // Retourne l'article avec le nouveau commentaire
                return {
                    ...prevArticle, // Garde les données de l'article
                    comments: [...prevArticle.comments, data], // Ajoute le commentaire à la liste
                };
            });
        } catch (error) {
            console.log("[CREATE_COMMENT]", error);
        }
    }

    // fonction `deleteComment` pour suprimer le commentaire _____________________________DELETE
    async function deleteComment(commentId: string) {
        try {
            const response = await fetch(`/api/article/crud`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: commentId }), // Envoie l'id du commentaire à supprimer
            });

            if (!response.ok) {
                throw new Error("Erreur lors de la suppression du commentaire");
            }

            // Supprime le commentaire du state localement après la suppression côté serveur
            setArticle((prevArticle) => {
                if (!prevArticle) return prevArticle; // Vérifie si l'article existe
                return {
                    ...prevArticle, // Garde les données de l'article
                    comments: prevArticle.comments.filter( //nouveau tableau de commentaires en excluant celui qui a été supprimé
                        (comment) => comment.id !== commentId //seul le commentaire dont l'id ne correspond pas à commentId est conservé dans le nouveau tableau
                    ),
                };
            });

            const result = await response.json(); // Récupère le message de succès
            console.log(result.message);
        } catch (error) {
            console.log("[DELETE_COMMENT]", error);
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
            createdAt: new Date(),
        };

        await createComment(newComment); // fonction `createComment` avec le nouvel objet
    };

    return (
        <div className="border rounded-lg p-6 xl:w-[70%] mx-auto">
            <h1 className="text-4xl font-semibold text-emerald-500 text-center mb-2">
                {article?.title}
            </h1>
            <div className="flex justify-center mb-6">
                {article?.tags.map((tagArticle: TagArticleType) => (
                    <Tag key={tagArticle.tag.id} text={tagArticle.tag.name} />
                ))}
            </div>
            <p className="mx-auto text-center w-[90%] p-4 bg-slate-700 rounded-md">
                {article?.text}
            </p>

            <form
                onSubmit={handleSubmit}
                className="flex flex-col w-full mt-10"
            >
                <textarea
                    placeholder="Content"
                    value={form.text}
                    onChange={(e) => setForm({ ...form, text: e.target.value })}
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
                {article?.comments.map(
                    (commentArticle: CommentType) => (
                        console.log(commentArticle),
                        (
                            <Comment
                                key={commentArticle.id}
                                id={commentArticle.id}
                                userId={commentArticle.userId}
                                createdAt={commentArticle.createdAt}
                                text={commentArticle.text}
                                onDelete={deleteComment} // Passez la fonction de suppression
                            />
                        )
                    )
                )}
            </div>
        </div>
    );
};

export default ArticleDetailPage;

"use client";

import Tag from "@/components/Tag";
import Comment from "@/components/Comment"; // Assurez-vous d'importer le composant Comment
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs"; // Importez le hook `useUser`
import { Modal } from "@/components/Modal";
import Button from "@/components/Button";

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

    const [selectedComment, setSelectedComment] = useState<CommentType | null>(null); // État pour stocker le commentaire sélectionné
    const [isModalOpen, setIsModalOpen] = useState(false); // État pour ouvrir et fermer le modal

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

    // fonctions `handleEditComment` pour éditer le commentaire _____________________________PUT
    const handleEditComment = (comment: CommentType) => {
        setSelectedComment(comment);
        setIsModalOpen(true);
    };

    const handleClose = () => {
        setSelectedComment(null); // Réinitialiser le commentaire sélectionné
        setIsModalOpen(false); // Fermer le modal
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!selectedComment) return; // Vérifie si un commentaire est sélectionné

        try {
            const response = await fetch(`/api/article/crud`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify ({
                    id: selectedComment.id,
                    text: selectedComment.text,
                }),
            });

            if(!response.ok) {
                throw new Error("Erreur lors de la mise à jour du commentaire");
            }

            const updatedComment = await response.json(); // Récupère le commentaire mis à jour
            setIsModalOpen(false); // Ferme le modal

            setArticle((prevArticle) => {
                if(!prevArticle) return prevArticle; // Vérifie si l'article existe
                return {
                    ...prevArticle, // Garde les données de l'article
                    comments: prevArticle.comments.map((comment) => { // Pour chaque commentaire
                        if(comment.id === updatedComment.id) { // Si l'id du commentaire correspond à l'id du commentaire mis à jour
                            return updatedComment; // Retourne le commentaire mis à jour
                        }
                        return comment; // Sinon, retourne le commentaire tel quel
                    }),
                }
            })
        } catch (error) {
            console.error("[UPDATE_COMMENT]", error);
        }
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
                    placeholder="Contenu du commentaire"
                    value={form.text}
                    onChange={(e) => setForm({ ...form, text: e.target.value })}
                    className="border border-gray-300 p-2 rounded mb-4 text-black mx-auto w-[90%]"
                />

                <Button
                    type="submit"
                    label="Envoyer"
                    style="bg-emerald-500 text-white font-bold p-2 rounded mx-auto w-[90%] hover:bg-emerald-400"
                />
            </form>

            {/* Affichage des commentaires */}
            <div className="flex flex-col items-center mt-10 mx-auto w-[90%]">
                {article?.comments.map(
                    (commentArticle: CommentType) => (
                        (
                            <Comment
                                key={commentArticle.id}
                                id={commentArticle.id}
                                userId={commentArticle.userId}
                                createdAt={commentArticle.createdAt}
                                text={commentArticle.text}
                                onDelete={deleteComment} // Passe la fonction de suppression
                                onEdit={() => handleEditComment(commentArticle)} // Passe la fonction d'édition
                            />
                        )
                    )
                )}
            </div>
            {isModalOpen && (
                <Modal onClose={handleClose}>
                    <h1>Éditer le commentaire</h1>
                    {selectedComment && (
                        <form onSubmit={handleEditSubmit}>
                            <textarea
                                value={selectedComment.text}
                                onChange={(e) =>
                                    setSelectedComment({ ...selectedComment, text: e.target.value }) // Met à jour le texte du commentaire
                                }
                                className="border border-gray-300 p-2 rounded mb-4 text-black w-full"
                            />
                            <div className="flex gap-2 justify-end">
                                <Button
                                    type="button"
                                    label="Fermer"
                                    style="bg-red-500 text-white px-4 py-2 rounded"
                                    onClick={handleClose}
                                />
                                <Button 
                                    type="submit" 
                                    label="Enregistrer" 
                                    style="bg-emerald-500 text-white p-2 rounded"
                                />    
                            </div>
                        </form>
                    )}
                </Modal>
            )}
        </div>
    );
};

export default ArticleDetailPage;

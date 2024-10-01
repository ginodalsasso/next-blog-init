"use client";

import React, { useState } from "react";
import Comment from "@/components/Comment";
import Button from "@/components/Button";
import { useUser } from "@clerk/nextjs"; // Importer le hook `useUser` pour gérer l'utilisateur connecté.
import { Modal } from "@/components/Modal"; // Importer le composant `Modal` pour l'édition de commentaire.
import { z } from "zod";

// schéma de validation pour le commentaire
const commentSchema = z.object({
    text: z.string().min(5, { message: "Le commentaire doit comporter au moins 5 caractères." }),
});

type CommentType = {
    text: string;
    id: string;
    userId: string;
    articleId: string;
    createdAt?: Date;
};

type CommentDetailProps = { // Propriétés du composant CommentDetail
    comments: CommentType[]; // Liste des commentaires associés à l'article.
    articleId: string; // ID de l'article auquel les commentaires sont liés.
    onAddComment: (comment: CommentType) => void; // Fonction pour ajouter un commentaire.
    onDeleteComment: (id: string) => void; // Fonction pour supprimer un commentaire.
    onEditComment: (comment: CommentType) => void; // Fonction pour modifier un commentaire.
};

const CommentDetail = ({ comments, articleId, onAddComment, onDeleteComment, onEditComment }: CommentDetailProps) => {
    const [form, setForm] = useState<CommentType>({
        text: "",
        id: "",
        userId: "",
        articleId,
    }); // État pour gérer le formulaire d'ajout de commentaire.

    const [error, setError] = useState<string | null>(null); // État pour les erreurs du formulaire d'ajout.
    const [editError, setEditError] = useState<string | null>(null); // État pour les erreurs du formulaire d'édition.
    const [selectedComment, setSelectedComment] = useState<CommentType | null>(null); // État pour stocker le commentaire sélectionné pour modification.
    const [isModalOpen, setIsModalOpen] = useState(false); // État pour ouvrir et fermer le modal d'édition.
    const { user } = useUser(); // Récupération de l'utilisateur connecté.

    // Gérer la soumission du formulaire pour ajouter un commentaire
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        try {
            // Valide le formulaire en utilisant commentSchema.parse()
            const validatedData = commentSchema.parse({ text: form.text });
            const newComment = { ...form, ...validatedData, userId: user.id, createdAt: new Date() };

            onAddComment(newComment); // Ajoute le commentaire
            setForm({ text: "", id: "", userId: "", articleId }); // Réinitialise le formulaire après l'ajout
            setError(null); // Réinitialise l'erreur après succès
        } catch (error) {
            if (error instanceof z.ZodError) {
                setError(error.errors[0].message); // Affiche le message d'erreur de validation
            } else {
                setError("Une erreur est survenue lors de l'ajout du commentaire.");
            }
        }
    };

    // Gérer la soumission du formulaire pour modifier un commentaire
    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedComment) return;

        try {
            // Valide le formulaire avec commentSchema.parse()
            const validatedData = commentSchema.parse({ text: selectedComment.text });
            const updatedComment = { ...selectedComment, ...validatedData };

            onEditComment(updatedComment); // Met à jour le commentaire
            setIsModalOpen(false); // Ferme le modal après succès
            setEditError(null); // Réinitialise l'erreur après succès
        } catch (error) {
            if (error instanceof z.ZodError) {
                setEditError(error.errors[0].message); // Affiche le message d'erreur de validation
            } else {
                setEditError("Une erreur est survenue lors de la modification du commentaire.");
            }
        }
    };

    // Ouvrir le modal pour éditer le commentaire
    const handleEditComment = (comment: CommentType) => {
        setSelectedComment(comment);
        setIsModalOpen(true);
        setEditError(null); // Réinitialiser l'erreur à l'ouverture du modal.
    };

    // Fermer le modal
    const handleClose = () => {
        setSelectedComment(null);
        setIsModalOpen(false);
        setEditError(null); // Réinitialiser l'erreur à la fermeture du modal.
    };

    return (
        <div className="flex flex-col items-center mx-auto">
            {/* Formulaire d'ajout de commentaire */}
            <form onSubmit={handleSubmit} className="flex flex-col w-full my-5">
                <textarea
                    placeholder="Contenu du commentaire"
                    value={form.text}
                    onChange={(e) => {
                        setForm({ ...form, text: e.target.value });
                        setError(null); // Réinitialise l'erreur lors de la modification du texte
                    }}
                    className="border border-gray-300 p-2 rounded mb-4 text-black mx-auto w-[90%]"
                />
                {error && <p className="text-red-500 text-sm mb-2 mx-auto w-[90%]">{error}</p>}

                <Button
                    type="submit"
                    label="Envoyer"
                    style="bg-emerald-500 text-white font-bold p-2 rounded mx-auto w-[90%] hover:bg-emerald-400"
                />
            </form>

            {/* Affichage des commentaires */}
            {comments.map((comment) => (
                <Comment
                    key={comment.id}
                    id={comment.id}
                    userId={comment.userId}
                    createdAt={comment.createdAt}
                    text={comment.text}
                    onDelete={onDeleteComment} // Passe la fonction de suppression.
                    onEdit={() => handleEditComment(comment)} // Passe la fonction d'édition.
                />
            ))}

            {/* Modal pour éditer le commentaire */}
            {isModalOpen && (
                <Modal onClose={handleClose}>
                    <h1>Éditer le commentaire</h1>
                    {selectedComment && (
                        <form onSubmit={handleEditSubmit}>
                            <textarea
                                value={selectedComment.text}
                                onChange={(e) => {
                                    setSelectedComment({ ...selectedComment, text: e.target.value }); // Met à jour le contenu du commentaire.
                                    setEditError(null); // Réinitialise l'erreur lors de la modification du texte
                                }}
                                className="border border-gray-300 p-2 rounded mb-4 text-black w-full"
                            />
                            {editError && <p className="text-red-500 text-sm mb-2">{editError}</p>}
                            <div className="flex gap-2 justify-end">
                                <Button
                                    type="button"
                                    label="Fermer"
                                    style="border border-slate-300 text-black px-4 py-2 rounded"
                                    onClick={handleClose}
                                />
                                <Button type="submit" label="Enregistrer" style="bg-emerald-500 text-white p-2 rounded" />
                            </div>
                        </form>
                    )}
                </Modal>
            )}
        </div>
    );
};

export default CommentDetail;

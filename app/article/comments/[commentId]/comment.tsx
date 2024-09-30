"use client";

import React, { useState } from "react";
import Comment from "@/components/Comment";
import Button from "@/components/Button";
import { useUser } from "@clerk/nextjs"; // Importer le hook `useUser` pour gérer l'utilisateur connecté.
import { Modal } from "@/components/Modal"; // Importer le composant `Modal` pour l'édition de commentaire.

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

    const [selectedComment, setSelectedComment] = useState<CommentType | null>(null); // État pour stocker le commentaire sélectionné pour modification.
    const [isModalOpen, setIsModalOpen] = useState(false); // État pour ouvrir et fermer le modal d'édition.
    const { user } = useUser(); // Récupération de l'utilisateur connecté.

    // Gérer la soumission du formulaire pour ajouter un commentaire
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        const newComment = { ...form, userId: user.id, createdAt: new Date() };
        onAddComment(newComment);
        setForm({ text: "", id: "", userId: "", articleId }); // Réinitialise le formulaire après l'ajout.
    };

    // Gérer la soumission du formulaire pour modifier un commentaire
    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedComment) return;
        onEditComment(selectedComment);
        setIsModalOpen(false);
    };

    // Ouvrir le modal pour éditer le commentaire
    const handleEditComment = (comment: CommentType) => {
        setSelectedComment(comment);
        setIsModalOpen(true);
    };

    // Fermer le modal
    const handleClose = () => {
        setSelectedComment(null);
        setIsModalOpen(false);
    };

    return (
        <div className="flex flex-col items-center mx-auto">
            {/* Formulaire d'ajout de commentaire */}
            <form onSubmit={handleSubmit} className="flex flex-col w-full my-5">
                <textarea
                    placeholder="Contenu du commentaire"
                    value={form.text}
                    onChange={(e) => setForm({ ...form, text: e.target.value })} // Met à jour le contenu du commentaire.
                    className="border border-gray-300 p-2 rounded mb-4 text-black mx-auto w-[90%]"
                />
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
                        <form onSubmit={handleEditSubmit}> {/* Soumet le formulaire pour modifier le commentaire. */}
                            <textarea
                                value={selectedComment.text}
                                onChange={(e) =>
                                    setSelectedComment({ ...selectedComment, text: e.target.value }) // Met à jour le contenu du commentaire.
                                }
                                className="border border-gray-300 p-2 rounded mb-4 text-black w-full"
                            />
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

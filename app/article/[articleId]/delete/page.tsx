"use client";

import { Modal } from "@/components/Modal";
import { Article } from "@prisma/client";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Importer useRouter pour la navigation
import Button from "@/components/Button"; // Assurez-vous que le composant Button est bien importé

const DeleteArticle = ({ article }: { article: Article }) => {
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(
        null
    );
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter(); // Pour la redirection après suppression

    // Ouvre le modal pour confirmer la suppression
    const handleDeleteArticle = () => {
        setSelectedArticle(article);
        setIsModalOpen(true);
    };

    // Ferme le modal
    const handleClose = () => {
        setSelectedArticle(null); // Réinitialise l'article sélectionné
        setIsModalOpen(false); // Ferme le modal
    };

    // Gère la soumission de la suppression de l'article
    const handleDeleteSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedArticle) return;

        try {
            // Appel à l'API pour supprimer l'article
            await fetch("/api/article/articleCrud", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: article.id }), // Envoie l'ID de l'article à supprimer
            });

            setIsModalOpen(false);
            router.push("/article"); // Redirige vers la page d'accueil après suppression
        } catch (error) {
            console.error(
                "Erreur lors de la suppression de l'article :",
                error
            );
        }
    };

    return (
        <div>
            {/* Bouton de suppression */}
            <Button label="Supprimer" style="border border-slate-300 px-4 py-2 rounded-lg" onClick={handleDeleteArticle} />

            {/* Modal pour confirmer la suppression */}
            {isModalOpen && (
                <Modal onClose={handleClose}>
                    <h1>Supprimer l&apos;article</h1>
                    {selectedArticle && (
                        <form onSubmit={handleDeleteSubmit}>
                            <p className="mb-8">Êtes-vous sûr de vouloir supprimer l&apos;article {selectedArticle.title} ?</p>
                            <div className="flex gap-2 justify-end">
                                <Button
                                    type="button"
                                    label="Fermer"
                                    style="border border-slate-300 px-4 py-2 rounded-lg"
                                    onClick={handleClose}
                                />
                                <Button
                                    type="submit"
                                    label="Supprimer"
                                    style="px-4 py-2 rounded-lg bg-red-500 text-white"
                                />
                            </div>
                        </form>
                    )}
                </Modal>
            )}
        </div>
    );
};

export default DeleteArticle;

import React from "react";
import { useUser } from "@clerk/nextjs";
import { formatDate } from "../lib/utils";
import Button from "./Button";

type CommentProps = {
    id: string; // Id du commentaire
    userId: string;
    createdAt: Date | undefined;
    text: string;
    onDelete: (id: string) => void; // Fonction pour supprimer un commentaire
};

const Comment: React.FC<CommentProps> = ({ id, userId, createdAt, text, onDelete }) => {
    // useUser pour récupérer les informations de l'utilisateur
    const { user } = useUser();

    //fonction formatDate pour formater la date du commentaire
    const formattedDate = createdAt ? formatDate(createdAt) : "Date non disponible";

    // Fonction pour gérer la suppression du commentaire
    const handleDelete = () => {
        onDelete(id);
    };

    return (
        <div className="bg-white border border-gray-300 p-4 rounded-lg mb-4 w-full">
            <div className="flex items-center mb-2">
                <span className={`font-semibold mr-2 
                    ${user?.id === userId ? "text-emerald-500" : ""}`} // Vérifie si l'utilisateur est l'auteur du commentaire
                >
                    {userId}
                </span>
                <span className="text-gray-500 text-sm">{formattedDate}</span>
            </div>
            <p className="text-gray-700">{text}</p>
            {/* // Vérifie si l'utilisateur est l'auteur du commentaire */}
            {user?.id === userId && (
                <Button 
                    style="px-4 py-2 rounded-lg bg-slate-800" 
                    href="" 
                    label="Supprimer" 
                    onClick={handleDelete}
                />
            )}
        </div>
    );
};

export default Comment;

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
    onEdit: (id: string) => void; // Fonction pour éditer un commentaire
};

const Comment: React.FC<CommentProps> = ({ id, userId, createdAt, text, onDelete, onEdit }) => {
    // useUser pour récupérer les informations de l'utilisateur
    const { user } = useUser();

    //fonction formatDate pour formater la date du commentaire
    const formattedDate = createdAt ? formatDate(createdAt) : "Date non disponible";

    // Fonction pour gérer la suppression du commentaire
    const handleDelete = () => {
        onDelete(id);
    };

    // Fonction pour gérer l'édition du commentaire
    const handleEdit = () => {
        onEdit(id);
    };

    return (
        <div className="bg-white border border-gray-300 p-4 rounded-lg my-4 w-[90%]">
            <div className="flex flex-col  mb-2">
                <span className={`font-semibold mr-2 
                    ${user?.id === userId ? "text-emerald-500" : "text-slate-900"}`} // Vérifie si l'utilisateur est l'auteur du commentaire pour changer le style 
                >
                    {/* {userId} */}
                    {user?.username}
                </span>
                <span className="text-gray-500 text-sm mb-4">{formattedDate}</span>
                <hr />
            </div>
            <p className="text-gray-700">{text}</p>
            {/* // Vérifie si l'utilisateur est l'auteur du commentaire */}
            {user?.id === userId && (
                <div className="flex gap-2 justify-end mt-4">
                    {/* Bouton "Éditer" */}
                    <Button 
                        type="submit"
                        style="px-4 py-2 rounded-lg bg-blue-500 text-white" 
                        href="" 
                        label="Éditer" 
                        onClick={handleEdit} // Utilise la fonction handleEdit pour déclencher l'édition
                    />

                    {/* Bouton "Supprimer" */}
                    <Button 
                        type="submit"
                        style="px-4 py-2 rounded-lg bg-red-500 text-white" 
                        href="" 
                        label="Supprimer" 
                        onClick={handleDelete} 
                    />

                </div>
            )}
        </div>
    );
};

export default Comment;

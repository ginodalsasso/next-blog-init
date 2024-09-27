import React from "react";
import { useUser } from "@clerk/nextjs";
import { formatDate } from "../lib/utils";

type CommentProps = {
    userId: string;
    createdAt: Date | undefined;
    text: string;
};

const Comment: React.FC<CommentProps> = ({ userId, createdAt, text }) => {
    // useUser pour récupérer les informations de l'utilisateur
    const { user } = useUser();

    //fonction formatDate pour formater la date du commentaire
    const formattedDate = createdAt ? formatDate(createdAt) : "Date non disponible";

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
        </div>
    );
};

export default Comment;

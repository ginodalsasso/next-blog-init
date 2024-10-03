import React, { useState } from "react";

const MultipleFileUpload = () => {
    const [files, setFiles] = useState<FileList | null>(null);
    const [status, setStatus] = useState<"initiale" | "chargement..." | "succès" | "échoué">("initiale");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setStatus("initiale");
            setFiles(e.target.files);
        }
    };

    const handleUpload = async () => {
        if (files) {
            setStatus("chargement...");
            const formData = new FormData();

            [...files].forEach((file) => { // 
                formData.append("file", file); // file etant le nom du champ dans le formulaire
            });

            try {
                const result = await fetch("/api/upload/uploadCrud", {
                    method: "POST",
                    body: formData,
                });

                await result.json(); // Convertir la réponse en JSON pour l'afficher
                setStatus("succès");
            } catch (error) {
                console.log(error);
                setStatus("échoué");
            }
        }
    };

    const Result = ({ status }: { status: string }) => {
        if (status === "succès") {
            return <p>✅ Upload terminé</p>;
        } else if (status === "échoué") {
            return <p>❌ Upload échoué</p>;
        } else if (status === "chargement...") {
            return <p>⏳ Upload en cours</p>;
        } else {
            return null;
        }
    };

    return (
        <>
            <div>
                <input id="file" type="file" multiple onChange={handleFileChange} />
            </div>
            {files && [...files].map((file, index) => (
                <section key={file.name}>
                    Fichier {index + 1}:
                    <ul>
                        <li>Nom: {file.name}</li>
                        <li>Type: {file.type}</li>
                        <li>Taille: {file.size} bytes</li>
                    </ul>
                </section>
            ))}

            {files && (
                <button
                    onClick={handleUpload}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Upload {files.length > 1 ? 'fichiers' : 'fichier'}
                </button>
            )}
            <Result status={status} />
        </>
    );
};

export default MultipleFileUpload;

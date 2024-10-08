import React, { useState } from "react";

const FileUpload = () => {
    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState<
        "initiale" | "chargement..." | "succès" | "échoué"
    >("initiale");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setStatus("initiale");
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (file) {
            setStatus("chargement...");
            const formData = new FormData();
            formData.append("file", file); // file etant le nom du champ dans le formulaire

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
                <input type="file" onChange={handleFileChange} />
            </div>
            {file && (
                <div>
                    <ul>
                        <li>Nom: {file.name}</li>
                        <li>Type: {file.type}</li>
                        <li>Taille: {file.size} bytes</li>
                    </ul>
                </div>
            )}

            {file && (
                <button
                    onClick={handleUpload}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Upload
                </button>
            )}
            <Result status={status} />
        </>
    );
};

// https://uploadcare.com/blog/how-to-upload-file-in-react/
export default FileUpload;

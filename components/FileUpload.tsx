import React, { useState } from 'react';

const FileUpload = () => {
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0])
        }    
    };

    const handleUpload = async() => {
        if(file) {
            console.log("Chargement...");
            const formData = new FormData(); 
            formData.append('file', file); // file etant le nom du champ dans le formulaire
            try {
                const result = await fetch('/api/upload/uploadCrud', { 
                    method: 'POST',
                    body: formData
                });

                await result.json()
            
                } catch (error) {
                console.log(error);
            }
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
                        <li>Filename: {file.name}</li>
                        <li>Filetype: {file.type}</li>
                        <li>Filesize: {file.size} bytes</li>
                    </ul>
                </div>
            )}

            {file && (
                <button
                    onClick={handleUpload}
                    className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
                >
                    Upload 
                </button>
            )}
        </>
    )
}

export default FileUpload;
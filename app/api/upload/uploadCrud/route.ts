import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { mkdir, stat, writeFile } from 'fs/promises';
import { join } from 'path';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB taille max
const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png']; //fichiers autorisés

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData(); // Récupération des données
        const files = formData.getAll('file') as File[]; // Récupération des fichier dans un tableau

        if (!files || files.length === 0) {
            return NextResponse.json({ error: 'File not provided' }, { status: 400 });
        }

        const relativeUploadDir = 'public/upload/img';
        const uploadDir = join(process.cwd(), relativeUploadDir); // join() pour créer un chemin absolu a partir du chemin relatif, évite aussi la faille de chemin

        try { // Creer le dossier s'il n'existe pas
            await stat(uploadDir); // Vérifie si le dossier existe
        } catch {
            await mkdir(uploadDir, { recursive: true });// Crée le dossier
        }

        const uploadFile = async (file: File) => {
            if (!allowedTypes.includes(file.type)) {
                throw new Error(`File type ${file.type} not supported`);
            }

            if (file.size > MAX_FILE_SIZE) {
                throw new Error(`File size exceeds the limit of ${MAX_FILE_SIZE} bytes`);
            }

            const buffer = Buffer.from(await file.arrayBuffer()); // Convertir le fichier en tampon
            const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`; // Générer un nom de fichier unique
            const filename = `${uniqueSuffix}.${file.name.split('.').pop()}`;
            const filePath = join(uploadDir, filename);

            await writeFile(filePath, buffer);// Ecrire le fichier dans le dossier
            return `/${relativeUploadDir}/${filename}`; 
        };

        const fileUrls = await Promise.all(files.map(uploadFile));

        const results = await Promise.all(
            fileUrls.map(url => db.image.create({ data: { url } })) // pour chaque fichier, nous le créons
        );

        return NextResponse.json(results, { status: 201 });
    } catch (error) {
        console.error('[UPLOAD_IMAGES_ERROR]', error);
        return NextResponse.json({ error: 'Failed to upload images' }, { status: 500 });
    }
}

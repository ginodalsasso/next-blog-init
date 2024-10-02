import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { mkdir, stat, writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(req: NextRequest) {
    try {
        // Parse the form data
        const formData = await req.formData();

        const image = formData.get('file') as File;
        if (!image) {
            return NextResponse.json({ error: 'File not provided' }, { status: 400 });
        }

        const buffer = Buffer.from(await image.arrayBuffer()); // Convertir le fichier en tampon
        const relativeUploadDir = 'public/upload/img'; // Dossier de téléchargement

        const uploadDir = join(process.cwd(), relativeUploadDir); // join() pour créer un chemin absolu a partir du chemin relatif

        // Creer le dossier s'il n'existe pas
        try {
            await stat(uploadDir); // Vérifie si le dossier existe
        } catch {
            await mkdir(uploadDir, { recursive: true }); // Crée le dossier
        }

        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`; // Générer un nom de fichier unique
        const filename = `${uniqueSuffix}.${image.name.split('.').pop()}`; // Créer un nom de fichier avec l'extension
        const filePath = join(uploadDir, filename); // Chemin du fichier

        await writeFile(filePath, buffer); // Ecrire le fichier dans le dossier

        const fileUrl = `/${relativeUploadDir}/${filename}`;

        // Save to database
        const result = await db.image.create({
            data: {
                url: fileUrl,
            },
        });

        return NextResponse.json(result, { status: 201 });
    } catch (error) {
        console.error('[CREATE_IMAGE_ERROR]', error);
        return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
    }
}

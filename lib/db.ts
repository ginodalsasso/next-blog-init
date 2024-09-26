import { PrismaClient } from '@prisma/client';

// Déclarer une variable globale pour stocker l'instance de PrismaClient
declare global {
    const prisma: PrismaClient | undefined;
}

// Créer une instance de PrismaClient
export const db = globalThis.prisma || new PrismaClient();

// Si nous sommes en mode développement, nous assignons l'instance de Prisma à la variable globale
if (process.env.NODE_ENV !== 'production') {
    globalThis.prisma = db;
}
"use client"

import { Article } from '@prisma/client'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

    const UpdateArticlePage  = ({ params }: { params: { articleId: string } }) => {

        const [form, setForm] = useState<Article>({ // Initialisation du formulaire avec les valeurs par défaut
            id: "",
            title: "",
            text: "",
            slug: "",
            createdAt: new Date(),
        });

        const [isLoading, setIsLoading] = useState(false); // Gestion de l'état de chargement
        const router = useRouter(); // Pour la redirection de l'utilisateur

        // Récupérer les données de l'article
        useEffect(() => {
            const fetchArticle = async () => {
                try {
                    const response = await fetch(`/api/article/${params.articleId}`);
                    const data: ArticleWithTagsAndComments = await response.json();
                    setForm(data);
                } catch (error) {
                    console.error("Erreur lors de la récupération de l'article:", error);
                }
            };
            fetchArticle();
        }, [params.articleId]);

        // Fonction pour gérer la soumission du formulaire
        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            setIsLoading(true); // Met à jour l'état de chargement

            try {
                await updateArticle(form); // Appel de la fonction `createArticle` pour envoyer les données du formulaire
                setForm({ id: "", title: "", text: "", slug: "", createdAt: new Date() }); // Réinitialise le formulaire après l'ajout
                router.push(`/article/${params.articleId}`); // Redirige l'utilisateur vers la page des articles
            } catch (error) {
                console.error("[UPDATE_ARTICLE_ERROR]", error);
            } finally {
                setIsLoading(false); // Met à jour l'état de chargement
            }
        }

        const updateArticle = async (data: Article) => { // Fonction pour envoyer les données du formulaire 
            try {
                await fetch("/api/article/articleCrud", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
                });
            } catch (error) {
                console.error("[UPDATE_ARTICLE]", error);
            }
        }

    return (
        <form className='flex flex-col w-full my-5' onSubmit={handleSubmit}>
            <h1 className='text-2xl text-center mb-5'>Créer un nouvel article</h1>
            {/* Champ de saisie pour le titre */}
            <input 
                type="text" 
                placeholder="Titre de l'article"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })} // Met à jour le titre de l'article
                className='border border-gray-300 p-2 rounded mb-4 text-black mx-auto w-[90%]'
                required
            />
            <input 
                type="text" 
                placeholder="Slug de l'article"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })} // Met à jour le slug de l'article
                className='border border-gray-300 p-2 rounded mb-4 text-black mx-auto w-[90%]'
                required
            />
            {/* Champ de saisie pour le contenu */}
            <textarea 
                placeholder="Contenu de l'article"
                value={form.text}
                onChange={(e) => setForm({ ...form, text: e.target.value })} // Met à jour le contenu de l'article
                className='border border-gray-300 p-2 rounded mb-4 text-black mx-auto w-[90%]'
                required
            />
            <button
                type="submit"
                className='bg-emerald-500 text-white font-bold p-2 rounded mx-auto w-[90%] hover:bg-emerald-400'
                disabled={isLoading}
            >
                {isLoading ? 'Chargement...' : 'Editer l\'article'}
            </button>
        </form>
    )
}

export default UpdateArticlePage
import React from "react";
import { formatDate } from "@/lib/utils";
// import Button from "./Button";
import Tag from "./Tag";
import Button from "./Button";
import DeleteArticle from "@/app/article/[articleId]/delete/page";

interface ArticleCardProps {
    article: ArticleWithTagsAndComments; // ArticleWithTagsAndComments from types/types.ts
}

const ArticleCard:React.FC<ArticleCardProps> = ({ article }) => {
    return (
        <div
            key={article.id}
            className="border border-gray-500 p-6 rounded-xl hover:bg-slate-700"
        >
            <div className="flex justify-between">
                <h2 className="text-2xl font-semibold text-emerald-500">
                    {article.title}
                </h2>

                <div className="flex justify-end  gap-2">
                    <Button href={`/article/${article.id}/edit`} label="Editer" style="border border-slate-300 px-4 py-2 rounded-lg" />
                    {article && <DeleteArticle article={article} />}
                </div>
            </div>

            <p className="text-sm text-slate-300">
                {formatDate(article.createdAt)}
            </p>

            <div className="flex flex-wrap gap-2 my-2">
                {article.tags.map((tagArticle) => (
                    <Tag key={tagArticle.tag.id} text={tagArticle.tag.name} />
                ))}
            </div>

            <p className="line-clamp-4 mb-10">
                {/*  Afficher les 4 premières lignes de l'article */}
                {article.text}
            </p>

            <Button 
                href={`/article/${article.id}`} 
                style="border border-slate-300 px-4 py-2 rounded-lg " 
                label="Lire la suite..." 
            />
        </div>
    );
};

export default ArticleCard;

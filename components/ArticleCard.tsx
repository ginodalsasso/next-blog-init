import React from "react";
import { formatDate } from "@/lib/utils";
// import Button from "./Button";
import Tag from "./Tag";

interface ArticleCardProps {
    article: ArticleWithTagsAndComments; // ArticleWithTagsAndComments from types/types.ts
}

const ArticleCard:React.FC<ArticleCardProps> = ({ article }) => {
    return (
        <div
            key={article.id}
            className="border border-gray-500 p-6 rounded-xl hover:bg-slate-700"
        >
            <h2 className="text-2xl font-semibold text-emerald-500">
                {article.title}
            </h2>

            <p className="text-sm text-slate-300">
                {formatDate(article.createdAt)}
            </p>

            <div className="flex flex-wrap gap-2 my-2">
                {article.tags.map((tagArticle) => (
                    <Tag key={tagArticle.tag.id} text={tagArticle.tag.name} />
                ))}
            </div>

            <p className="line-clamp-4">
                {/*  Afficher les 4 premières lignes de l'article */}
                {article.text}
            </p>
            
            {/* <Button label="Lire la suite..." /> */}
        </div>
    );
};

export default ArticleCard;

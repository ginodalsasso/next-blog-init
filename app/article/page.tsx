import { db } from "@/lib/db";
import React from "react";

const ArticlePage = async () => {

    return <div>
        <h1 className="mb-4">Blog</h1>

        {/* Liste des articles */}
        { articles.map((article: any) => (
            <div key={article.id} className="mb-6">
                <h2 className="text-2xl font-semibold text-emerald-500">{article.title}</h2>

                <p>{article.createdAt.toLocaleDateString()} {article.createdAt.toLocaleTimeString()}</p>

                {article.tags.map((tagArticle: any) => (
                    <span key={tagArticle.tag.id} className="mr-2 text-sm text-gray-500">
                        {tagArticle.tag.name}
                    </span>
                ))}

                <p>{article.text}</p>
            </div>
        )) }
    </div>;
};

export default ArticlePage;

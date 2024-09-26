interface TagType {
    id: string;
    name: string;
}

interface TagArticleType {
    id: string;
    tag: TagType;
}

interface CommentType {
    id: string;
    text: string;
    userId: string;
    createdAt: Date;
}

interface ArticleWithTagsAndComments {
    id: string;
    title: string;
    text: string;
    slug: string;
    createdAt: Date;
    tags: TagArticleType[];
    comments: CommentType[];
}
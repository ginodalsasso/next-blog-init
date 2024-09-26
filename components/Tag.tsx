import React from "react";

interface TagProps {
    text: string;
}

const Tag: React.FC<TagProps> = ({ text }) => {


    return (
        <span className="text-xs rounded-full bg-slate-600 px-3 py-1 text-white">
            {text}
        </span>
    );
};

export default Tag;

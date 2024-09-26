import React from "react";
import Link from "next/link";

interface ButtonProps {
    label: string;
    href: string;
    style: string;
}

const Button: React.FC<ButtonProps> = ({ label, href, style }) => {
    return (
        <Link
            className={style}
            href={href}
        >
            {label}
        </Link>
    );
};

export default Button;

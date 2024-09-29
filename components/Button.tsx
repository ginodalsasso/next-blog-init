import React from "react";
import Link from "next/link";

interface ButtonProps {
    label: string;
    href: string;
    style: string;
    onClick?: () => void; // fonction otpionnelle
}

const Button: React.FC<ButtonProps> = ({ label, href, style, onClick }) => {

    if(href && !onClick) {
        return (
            <Link
                className={style}
                href={href}
            >
                {label}
            </Link>
        );
    }

    return (
        <button className={style} onClick={onClick}>
            {label}
        </button>
    );
};

export default Button;

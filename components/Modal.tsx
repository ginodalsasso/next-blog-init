import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

type ModalProps = {
    children: React.ReactNode;  // Typage pour les enfants du composant
    onClose?: () => void;       // Typage pour la fonction onClose, optionnelle
};

export function Modal({ children, onClose }: ModalProps) {
    const dialogRef = useRef<HTMLDialogElement | null>(null); // Référence pour le modal

    // Affiche le modal dès que le composant est monté
    useEffect(() => {
        // Vérifier si dialogRef.current est défini et n'est pas null
        if (dialogRef.current) {
            dialogRef.current.showModal(); // Affiche le modal s'il est référencé
        }
    }, []);
    const handleClose = (e: React.SyntheticEvent) => { // Fonction pour fermer le modal
        e.preventDefault();
        onClose?.(); // si onClose est défini, on l'appelle
    };

    return createPortal(
        <dialog 
            className="fixed inset-0 lg:w-1/2 bg-white p-10 rounded-lg"
            ref={dialogRef} 
            onClose={handleClose}
        >
            <div>
                {children}
            </div>
        </dialog>
        , document.body
    );
}

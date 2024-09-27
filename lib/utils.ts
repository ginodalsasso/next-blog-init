import { format } from "date-fns";

export function formatDate(date: Date): string {
    return format(new Date(date), "MMMM do, HH:mm") ?? "Date not available";
}

// Vérifie le rôle de l'utilisateur
// function checkUserRole(session) {
//     if (
//         !session ||
//         !session.user ||
//         !session.user.organizationMemberships ||
//         session.user.organizationMemberships.length === 0
//     ) {
//         return null; // retourne null si la session, l'utilisateur ou les appartenances à l'organisation n'existent pas
//     }

//     const organizationMemberships = session.user.organizationMemberships;

//     // boucle sur les appartenances à l'organisation
//     for (const membership of organizationMemberships) {
//         if (membership.role) {
//             return membership.role.toLowerCase(); // retourne le rôle en minuscules
//         }
//     }

//     return null; // retourn null si le rôle n'existe pas
// }

// export { checkUserRole };

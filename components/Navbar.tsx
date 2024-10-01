import Link from "next/link";
import { SignedOut, UserButton, SignedIn } from "@clerk/nextjs";
// import { checkUserRole } from "@/lib/utils";
import Button from "./Button";

const Navbar = () => {
    // console.log(useSession());
    // const { isLoaded, session, isSignedIn } = useSession()
    
    // if (!isLoaded) {
    //     // Add logic to handle loading state
    //     return null
    // }
    // if (!isSignedIn) {
    //     // Add logic to handle not signed in state
    //     return null
    // }

    // const userRole = checkUserRole(session);

    const links = [
        { title: "Profile", url: "/user-profile" },
        { title: "Blog", url: "/article" },
    ];

    return (
        <header className="body-font">
            <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center justify-between">
                <nav className="md:ml-auto md:mr-auto flex flex-wrap items-center justify-center gap-10">
                    <SignedIn>
                        {links.map((link) =>
                            // (link.role === "admin" && userRole === "admin") ||
                            // !link.role ? (
                                <Link key={link.title} href={link.url}>
                                    <div className="mr-5 cursor-pointer hover:text-gray-900">
                                        {link.title}
                                    </div>
                                </Link>
                            // ) : null
                        )}
                    </SignedIn>
                </nav>
                <div className="md:flex items-center">
                    {/* // Si l'utilisateur est connecté, affiche le bouton de déconnexion */}
                    <SignedIn>
                        <UserButton afterSignOutUrl="/" />
                    </SignedIn>
                    {/* // Si l'utilisateur n'est pas connecté, affiche les boutons de connexion et d'inscription */}
                    <SignedOut>
                        <Button 
                            style="text-white bg-emerald-500 border-0 py-2 px-4 focus:outline-none hover:bg-emerald-600 rounded text-base mr-4 cursor-pointer" 
                            href="/sign-in" 
                            label="Login"
                            
                        />
                        <Button 
                            style="text-white bg-emerald-500 border-0 py-2 px-4 focus:outline-none hover:bg-emerald-600 rounded text-base mr-4 cursor-pointer" 
                            href="/sign-up" 
                            label="Sign Up"
                        />
                    </SignedOut>
                </div>
            </div>
        </header>
    );
};

export default Navbar;

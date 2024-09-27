import Link from "next/link";
import { SignedOut, UserButton, SignedIn } from "@clerk/nextjs";

const Navbar = () => {
    const links = [
        { title: "Profile", url: "/profile" },
        { title: "Dashboard", url: "/user" },
        { title: "Admin Dashboard", url: "/admin", role: "admin" },
        { title: "Blog", url: "/article" },
    ];

    return (
        <header className="body-font">
            <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center justify-between">
                <nav className="md:ml-auto md:mr-auto flex flex-wrap items-center justify-center gap-10">
                    <SignedIn>
                        {links.map(
                            (link) => (
                                <Link key={link.title} href={link.url}>
                                    <div className="mr-5 cursor-pointer hover:text-gray-900">
                                        {link.title}
                                    </div>
                                </Link>
                            )
                        )}
                    </SignedIn>
                </nav>
                <div className="md:flex items-center">
                    <SignedIn>
                        <UserButton afterSignOutUrl="/" />
                    </SignedIn>
                    <SignedOut>
                        <Link href="/sign-in">
                            <div className="text-white bg-emerald-500 border-0 py-2 px-4 focus:outline-none hover:bg-emerald-600 rounded text-base mr-4 cursor-pointer">
                                Login
                            </div>
                        </Link>
                        <Link href="/sign-up">
                            <div className="text-white bg-emerald-500 border-0 py-2 px-4 focus:outline-none hover:bg-emerald-600 rounded text-base mr-4 cursor-pointer">
                                Sign Up
                            </div>
                        </Link>
                    </SignedOut>
                </div>
            </div>
        </header>
    );
};

export default Navbar;

import Link from "next/link";
import Button from "./Button";

const Navbar = () => {
    // const links = [
    //     { title: "Profile", url: "/profile" },
    //     { title: "Dashboard", url: "/user" },
    //     { title: "Admin Dashboard", url: "/admin", role: "admin" },
    // ];

    return (
        <header className="body-font">
            <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center justify-between">
                <div className="flex items-center">
                </div>
                <nav className="md:ml-auto md:mr-auto flex flex-wrap items-center justify-center gap-10">
                    <Button style="hover:text-emerald-500" label="Profile" href="/profile" />
                    <Button style="hover:text-emerald-500" label="Dashboard" href="/user" />
                    <Button style="hover:text-emerald-500" label="Admin Dashboard" href="/admin" />
                    <Button style="hover:text-emerald-500" label="Article" href="/article" />
                </nav>
                <div className="md:flex items-center">
                    <Button 
                        style="text-white bg-emerald-500 border-0 py-2 px-4 focus:outline-none hover:bg-emerald-600 rounded text-base mr-4" 
                        label="Login" 
                        href="/sign-in" 
                    />
                    <Button 
                        style="text-white bg-emerald-500 border-0 py-2 px-4 focus:outline-none hover:bg-emerald-600 rounded text-base mr-4" 
                        label="Sign Up" 
                        href="/sign-up" 
                    />
                </div>
            </div>
        </header>
    );
};

export default Navbar;

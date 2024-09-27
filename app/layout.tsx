import {
    ClerkProvider,
    // SignInButton,
    // SignedIn,
    // SignedOut,
    // UserButton,
} from "@clerk/nextjs";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geistSans = localFont({
    src: "./fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});
const geistMono = localFont({
    src: "./fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});

export const metadata: Metadata = {
    title: "Blog NextJS",
    description: "Exercice blog NextJS",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClerkProvider>
            <html lang="en">
                <body
                    className={`${geistSans.variable} ${geistMono.variable} antialiased`}
                >
                    <main className="bg-slate-800 min-h-screen p-6 text-white">
                        <Navbar />
                        {children}
                    </main>
                </body>
            </html>
        </ClerkProvider>
    );
}

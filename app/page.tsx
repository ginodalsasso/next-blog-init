"use client"

import FileUpload from "@/components/FileUpload";
import MultipleFileUpload from "@/components/MultipleFileUpload";


export default function Home() {
    return (
        <div>
            <h1>Welcome to Our Blog</h1>
            <p>Discover amazing things with us!</p>
            <FileUpload />
            
            <MultipleFileUpload/>

        </div>
    );
}

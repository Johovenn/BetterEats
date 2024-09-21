"use client"

import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function LandingPage(){
    const router = useRouter()

    return(
        <main className="w-full bg-paper-default">
            <Navbar />
            <main className="px-20 py-10">
                <h1>Landing Page</h1>
            </main>
        </main>
    )
}
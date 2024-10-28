"use client"

import Loading from "@/components/Loading";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LandingPage(){
    const router = useRouter()
    const {user} = useUser()
    const role = user?.publicMetadata?.role

    return(
        <main className="w-full bg-paper-default">
            <Navbar />
            <main className="px-20 py-10">
                <h1>Landing Page</h1>
            </main>
        </main>
    )
}
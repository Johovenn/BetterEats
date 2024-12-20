"use client"

import Sidebar from "@/components/Sidebar";
import { useAuth } from "@clerk/nextjs";
import { ReactNode } from "react";

export default function AppLayout({children}: {children: ReactNode}){
    const user = useAuth()

    return (
        <>
            {
                user.isSignedIn
                    &&
                <Sidebar />
            }
            <main className="ml-10 w-full px-20 py-8">
                {children}
            </main>
        </>
    );
}
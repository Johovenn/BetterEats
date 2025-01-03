import Navbar from "@/components/Navbar";
import { ReactNode } from "react";


export default function AuthLayout({children}: {children: ReactNode}){
    return(
        <main className="w-full">
            <Navbar hideNavigation className="absolute"/>
            <section className="flex items-center justify-center h-screen w-full">
                {children}
            </section>
        </main>
    )
}
"use client"

import { cn } from "@/lib/utils"
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "./ui/button"
import { UtensilsCrossed } from "lucide-react"

export default function Navbar(){
    const router = useRouter()

    return( 
        <nav className="py-4 px-20 flex justify-between items-center w-full border-b-2">
            <h1 className="text-2xl font-medium flex items-center gap-2">
                Better
                <UtensilsCrossed size={32} color="green"/>
                Eats
            </h1>
            <ul className="flex gap-10">
                <li>
                    <Link href={"#home"}>Home</Link>
                </li>
                <li>
                    <Link href={"#about"}>
                        About Us
                    </Link>
                </li>
                <li>
                    <Link href={"#features"}>
                        Features
                    </Link>
                </li>
                <li>
                    <Link href={"#contact"}>
                        Contact
                    </Link>
                </li>
            </ul>
            <SignedOut>
                <div>
                    <Button className="rounded-xl border border-primary mr-2" variant={"outline"} onClick={() => router.push(`/sign-up`)}>Register</Button>
                    <Button className="rounded-xl" onClick={() => router.push(`/sign-in`)}>Login</Button>
                </div>
            </SignedOut>
        </nav>
    )
}
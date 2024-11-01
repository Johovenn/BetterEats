"use client"

import { cn } from "@/lib/utils"
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "./ui/button"
import { UtensilsCrossed } from "lucide-react"

export default function Navbar(){
    const router = useRouter()
    const {user} = useUser()
    const role = user?.publicMetadata?.role

    const handleDashboardButton = () => {
        role !== 'admin' ? router.push(`/dashboard`) : router.push(`/admin/dashboard`)
    }

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
                <div className="gap-3">
                    <Button className="mr-4" variant={"outline"} onClick={() => router.push(`/sign-up`)}>Register</Button>
                    <Button onClick={() => router.push(`/sign-in`)} >Login</Button>
                </div>
            </SignedOut>
            <SignedIn>
                <Button onClick={handleDashboardButton}>Go to Dashboard</Button>
            </SignedIn>
        </nav>
    )
}
"use client"

import { cn } from "@/lib/utils"
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "./ui/button"
import { Clover, Leaf, UtensilsCrossed } from "lucide-react"

interface NavbarProps{
    hideNavigation?: boolean
    className?: string
}

export default function Navbar(props: NavbarProps){
    const router = useRouter()
    const {user} = useUser()
    const role = user?.publicMetadata?.role

    const handleDashboardButton = () => {
        role !== 'admin' ? router.push(`/dashboard`) : router.push(`/admin/dashboard`)
    }

    return( 
        <nav className={cn(props.className, "py-4 px-20 flex justify-between items-center w-full")}>
            <Link href={'/'} className="text-2xl font-medium flex items-center gap-2 text-green-primary font-">
                BetterEats
                <Clover size={28} color="#B2533E"/>
            </Link>
            {
                !props.hideNavigation
                    &&
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
                </ul>
            }
            <SignedOut>
                <div className="gap-3">
                    <Button className="mr-4" variant={"outline"} onClick={() => router.push(`/sign-up`)}>Register</Button>
                    <Button onClick={() => router.push(`/sign-in`)} >Login</Button>
                </div>
            </SignedOut>
            <SignedIn>
                <Button onClick={handleDashboardButton}>Dashboard</Button>
            </SignedIn>
        </nav>
    )
}
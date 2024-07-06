"use client"

import { cn } from "@/lib/utils"
import { SignedIn, SignedOut, useAuth, UserButton } from "@clerk/nextjs"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Navbar(){
    const pathname = usePathname()
    const { isSignedIn } = useAuth()

    const links = [
        {
            title: 'Home',
            href: '/',
            active: pathname === '/'
        },
        {
            title: 'Meal Planner',
            href: '/meal-planner',
            active: pathname === '/meal-planner'
        },
        {
            title: 'Food Search',
            href: '/food-search',
            active: pathname === '/search'
        },
        {
            title: 'BMI Calculator',
            href: '/bmi-calculator',
            active: pathname === '/bmi-calculator'
        },
        {
            title: 'Community',
            href: '/community',
            active: pathname === '/community'
        }
    ]

    if(pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up')){
        return <div></div>
    }

    return(
        <nav className="p-4 flex items-center">
            <div className="flex items-center gap-5">
                <h1 className="text-2xl font-bold">BetterEats</h1>
                {
                    links.map((link) => (
                        <Link key={link.title} href={link.href} className={cn("hover:underline hover:underline-offset-4 transition-all", link.active ? 'text-black font-semibold underline underline-offset-4' : 'text-gray-500 hover:text-black')}>{link.title}</Link>
                    ))
                }
            </div>

            <SignedOut>
                <div className="ml-auto gap-5">
                    <Link className="px-4 py-2 mr-5 border border-slate-300 rounded-[10px] hover:bg-slate-300 transition-all" href={'/sign-up'}>Register</Link>
                    <Link className="px-4 py-2 border bg-slate-600 rounded-[10px] hover:bg-slate-700 transition-all  text-white" href={'/sign-in'}>Login</Link>
                </div>
            </SignedOut>
            <SignedIn>
                <div className="ml-auto">
                    <UserButton></UserButton>
                </div>
            </SignedIn>
        </nav>
    )
}
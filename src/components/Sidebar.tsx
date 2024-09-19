"use client"

import { link } from "fs";
import { Calculator, HomeIcon, SearchIcon, UsersIcon, UtensilsCrossed, UtensilsIcon } from "lucide-react";
import { ReactNode } from "react";
import { Separator } from "./ui/separator";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";

interface NavigationProps{
    title: string
    icon: ReactNode
    link: string
}

export default function Sidebar(){
    const pathname = usePathname()

    const links: NavigationProps[] = [
        {
            title: 'Home',
            icon: <HomeIcon/>,
            link: '/home',
        },
        {
            title: 'Search',
            icon: <SearchIcon />,
            link: '/search'
        },
        {
            title: 'BMI Calculator',
            icon: <Calculator />,
            link: '/bmi-calculator'
        },
        {
            title: 'Meal Planner',
            icon: <UtensilsIcon />,
            link: '/meal-planner'
        },
        {
            title: 'Community',
            icon: <UsersIcon/>,
            link: '/community'
        }
    ]

    if(pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up') || pathname === '/'){
        return null
    }

    return(
        <aside className="h-screen p-3 bg-[#fafafa] border-r flex flex-col items-center">
            <ul className="space-y-10 flex flex-col justify-center items-center pt-2">
                <Image src="/BetterEats.png" alt="Logo" width={40} height={40}/>
                {/* <h1 className="">BE</h1> */}
                {
                    links.map((link) => (
                        <li key={link.title}>
                            <a href={link.link}className={cn(
                                "flex items-center justify-center p-2 rounded-xl transition-colors duration-200",
                                pathname === link.link ? "bg-green-500 text-white" : "hover:bg-green-200"
                            )}>{link.icon}</a>
                        </li>
                    ))
                }
            </ul>
            <div className="mt-auto">
                <UserButton />
            </div>
        </aside>
    )
}
"use client"

import { link } from "fs";
import { Calculator, HomeIcon, Newspaper, SearchIcon, UsersIcon, UtensilsCrossed, UtensilsIcon } from "lucide-react";
import { ReactNode } from "react";
import { Separator } from "./ui/separator";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import HoverTooltip from "./Tooltip";

interface NavigationProps{
    title: string
    icon: ReactNode
    link: string
}

export default function Sidebar(){
    const pathname = usePathname()

    const links: NavigationProps[] = [
        {
            title: 'Dashboard',
            icon: <HomeIcon/>,
            link: '/dashboard',
        },
        {
            title: 'Search',
            icon: <SearchIcon />,
            link: '/search'
        },
        {
            title: 'BMR Calculator',
            icon: <Calculator />,
            link: '/bmr-calculator'
        },
        {
            title: 'Meal Planner',
            icon: <UtensilsIcon />,
            link: '/meal-planner'
        },
        {
            title: 'Articles',
            icon: <Newspaper/>,
            link: '/articles'
        }
    ]

    if(pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up') || pathname === '/'){
        return null
    }

    return(
        <aside className="h-screen p-3 border-r bg-white flex flex-col items-center fixed">
            <ul className="space-y-10 flex flex-col justify-center items-center pt-2">
                <Image src="/BetterEats.png" alt="Logo" width={40} height={40} className="w-auto h-auto" priority/>
                <TooltipProvider>
                    {links.map((link) => (
                        <li key={link.title}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <a
                                    href={link.link}
                                    className={cn(
                                    "flex items-center justify-center p-2 rounded-xl transition-colors duration-200",
                                    pathname === link.link ? "bg-green-500 text-white" : "hover:bg-green-200"
                                    )}
                                >
                                    {link.icon}
                                </a>
                            </TooltipTrigger>
                            <TooltipContent side="right" className="bg-[#fafafa] rounded-lg">
                                <span>{link.title}</span>
                            </TooltipContent>
                        </Tooltip>
                        </li>
                    ))}
                </TooltipProvider>
            </ul>
            <div className="mt-auto">
                <UserButton />
            </div>
        </aside>
    )
}
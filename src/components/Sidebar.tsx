"use client"

import { link } from "fs";
import { Calculator, HomeIcon, Newspaper, NewspaperIcon, SearchIcon, UsersIcon, UtensilsCrossed, UtensilsIcon } from "lucide-react";
import { ReactNode } from "react";
import { Separator } from "./ui/separator";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth, UserButton, useUser } from "@clerk/nextjs";
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
    const {user} = useUser()

    const links: NavigationProps[] = [
        {
            title: 'Dashboard',
            icon: <HomeIcon size={20}/>,
            link: '/dashboard',
        },
        {
            title: 'Search',
            icon: <SearchIcon size={20}/>,
            link: '/search'
        },
        {
            title: 'TDEE Calculator',
            icon: <Calculator size={20}/>,
            link: '/tdee-calculator'
        },
        {
            title: 'Meal Planner',
            icon: <UtensilsIcon size={20}/>,
            link: '/meal-planner'
        },
        {
            title: 'Articles',
            icon: <Newspaper size={20}/>,
            link: '/article'
        }
    ]
    
    const adminLinks: NavigationProps[] = [
        {
            title: 'Dashboard',
            icon: <HomeIcon size={20}/>,
            link: '/admin/dashboard',
        },
        {
            title: 'Add Meal',
            icon: <UtensilsIcon size={20}/>,
            link: '/admin/meal',
        },
        {
            title: 'Add Article',
            icon: <NewspaperIcon size={20}/>,
            link: '/admin/add-article'
        }
    ]

    if(pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up') || pathname === '/'){
        return null
    }

    return(
        <aside className="h-screen p-3 border-r bg-white flex flex-col items-center fixed">
            <ul className="space-y-10 flex flex-col justify-center items-center pt-2">
                <Image src="/BetterEats.png" alt="Logo" width={30} height={30} className="w-auto h-auto" priority/>
                <TooltipProvider>
                    {
                        user?.publicMetadata?.role !== 'admin'
                            ?
                        links.map((link) => (
                            <li key={link.title}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <a
                                        href={link.link}
                                        className={cn(
                                        "flex items-center justify-center p-2 rounded-xl transition-colors duration-200",
                                        pathname === link.link ? "bg-orange-primary text-white" : "hover:bg-orange-primary/20"
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
                        ))
                            :
                        adminLinks.map((link) => (
                            <li key={link.title}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <a
                                        href={link.link}
                                        className={cn(
                                        "flex items-center justify-center p-2 rounded-xl transition-colors duration-200",
                                        pathname === link.link ? "bg-orange-primary text-white" : "hover:bg-green-200"
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
                        ))
                    }
                </TooltipProvider>
            </ul>
            <div className="mt-auto">
                <UserButton />
            </div>
        </aside>
    )
}
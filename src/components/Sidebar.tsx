"use client"

import { link } from "fs";
import { Calculator, Clover, HomeIcon, Leaf, Newspaper, NewspaperIcon, Salad, SearchIcon, Users, UsersIcon, UtensilsCrossed, UtensilsIcon } from "lucide-react";
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
            title: 'Health Calculator',
            icon: <Calculator size={20}/>,
            link: '/health-calculator'
        },
        {
            title: 'Search',
            icon: <SearchIcon size={20}/>,
            link: '/search'
        },
        {
            title: 'Meal Planner',
            icon: <UtensilsIcon size={20}/>,
            link: '/meal-planner'
        },
        {
            title: 'Community',
            icon: <Users size={20}/>,
            link: '/community'
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
            title: 'Manage Meals',
            icon: <UtensilsIcon size={20}/>,
            link: '/admin/meal',
        },
        {
            title: 'Manage Articles',
            icon: <NewspaperIcon size={20}/>,
            link: '/admin/article'
        },
        {
            title: 'Manage Community',
            icon: <Users size={20}/>,
            link: '/admin/community'
        },
    ]

    if(pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up') || pathname === '/'){
        return null
    }

    return(
        <aside className="h-screen p-3 flex flex-col items-center justify-between fixed">
            <div className="w-[45px] h-[45px] shadow-lg flex justify-center items-center rounded-full bg-white"> 
                {/* <Image src="/BetterEats.png" alt="Logo" width={30} height={30} className="" priority/> */}
                <Clover size={24} color="#B2533E"/>
            </div>
            <ul className="space-y-5 flex flex-col justify-center items-center">
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
                                            "flex items-center justify-center p-3 rounded-full transition-colors duration-200 bg-orange-primary/10",
                                            pathname === link.link ? "bg-orange-primary text-white" : "hover:bg-orange-primary/20",
                                            `sidebar-${link.title}`
                                        )}
                                    >
                                        {link.icon}
                                    </a>
                                </TooltipTrigger>
                                <TooltipContent side="right" className="bg-[#fafafa] rounded-lg z-[1000]">
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
                                            "flex items-center justify-center p-3 rounded-full transition-colors duration-200 bg-orange-primary/10",
                                            pathname === link.link ? "bg-orange-primary text-white" : "hover:bg-orange-primary/20",
                                            `sidebar-${link.title}`
                                        )}
                                    >
                                        {link.icon}
                                    </a>
                                </TooltipTrigger>
                                <TooltipContent side="right" className="bg-[#fafafa] rounded-lg z-[1000]">
                                    <span>{link.title}</span>
                                </TooltipContent>
                            </Tooltip>
                            </li>
                        ))
                    }
                </TooltipProvider>
            </ul>
            <div className="">
                <UserButton />
            </div>
        </aside>
    )
}
"use client"

import { link } from "fs";
import { Calculator, HomeIcon, SearchIcon, UsersIcon, UtensilsIcon } from "lucide-react";
import { ReactNode } from "react";
import { Separator } from "./ui/separator";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

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

    return(
        <aside className="h-screen p-3 bg-[#fafafa] border-r">
            <ul className="space-y-10">
                <h1 className="text-2xl text-center font-bold">BE</h1>
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
        </aside>
    )
}
"use client"

import { useState } from "react"
import {
    Calculator,
    Clover,
    HomeIcon,
    Newspaper,
    SearchIcon,
    Users,
    UtensilsIcon,
    Menu,
    X,
} from "lucide-react"
import { ReactNode } from "react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { UserButton, useUser } from "@clerk/nextjs"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "./ui/tooltip"

interface NavigationProps {
    title: string
    icon: ReactNode
    link: string
}

export default function Sidebar() {
    const pathname = usePathname()
    const { user } = useUser()
    const [isOpen, setIsOpen] = useState(false)

    const links: NavigationProps[] = [
        {
            title: "Dashboard",
            icon: <HomeIcon size={20} />,
            link: "/dashboard",
        },
        {
            title: "Health Calculator",
            icon: <Calculator size={20} />,
            link: "/health-calculator",
        },
        {
            title: "Search",
            icon: <SearchIcon size={20} />,
            link: "/search",
        },
        {
            title: "Meal Planner",
            icon: <UtensilsIcon size={20} />,
            link: "/meal-planner",
        },
        {
            title: "Community",
            icon: <Users size={20} />,
            link: "/community",
        },
        {
            title: "Articles",
            icon: <Newspaper size={20} />,
            link: "/article",
        },
    ]

    const adminLinks: NavigationProps[] = [
        {
            title: "Dashboard",
            icon: <HomeIcon size={20} />,
            link: "/admin/dashboard",
        },
        {
            title: "Manage Meals",
            icon: <UtensilsIcon size={20} />,
            link: "/admin/meal",
        },
        {
            title: "Manage Articles",
            icon: <Newspaper size={20} />,
            link: "/admin/article",
        },
        {
            title: "Manage Community",
            icon: <Users size={20} />,
            link: "/admin/community",
        },
    ]

    if (
        pathname.startsWith("/sign-in") ||
        pathname.startsWith("/sign-up") ||
        pathname === "/"
    ) {
        return null
    }

    const navLinks =
        user?.publicMetadata?.role !== "admin" ? links : adminLinks

    return (
        <>
            <button
                className={cn("fixed top-4 left-4 z-50 bg-white p-2 rounded-lg shadow-md lg:hidden", isOpen && "hidden")}
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X className={isOpen && "hidden"} size={24} /> : <Menu size={24} />}
            </button>

            <aside className="hidden lg:flex h-screen p-3 flex-col items-center justify-between fixed">
                <div className="w-[45px] h-[45px] shadow-lg flex justify-center items-center rounded-full bg-white">
                    <Clover size={24} color="#B2533E" />
                </div>
                <ul className="space-y-5 flex flex-col justify-center items-center">
                    <TooltipProvider>
                        {navLinks.map((link) => (
                            <li key={link.title}>   
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <a
                                            href={link.link}
                                            className={cn(
                                                "flex items-center justify-center p-3 rounded-full transition-colors duration-200 bg-orange-primary/10",
                                                pathname === link.link
                                                    ? "bg-orange-primary text-white"
                                                    : "hover:bg-orange-primary/20",
                                                `sidebar-${link.title}`
                                            )}
                                        >
                                            {link.icon}
                                        </a>
                                    </TooltipTrigger>
                                    <TooltipContent
                                        side="right"
                                        className="bg-[#fafafa] rounded-lg z-[1000]"
                                    >
                                        <span>{link.title}</span>
                                    </TooltipContent>
                                </Tooltip>
                            </li>
                        ))}
                    </TooltipProvider>
                </ul>
                <div>
                    <UserButton />
                </div>
            </aside>

            <div
                className={cn(
                    "fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 lg:hidden z-40",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Clover size={24} color="#B2533E" />
                        <span className="text-xl font-bold">BetterEats</span>
                    </div>
                    <button
                        className="text-gray-600 hover:text-gray-900"
                        onClick={() => setIsOpen(false)}
                    >
                        <X size={24} />
                    </button>
                </div>
                <ul className="space-y-4 mt-8">
                    {navLinks.map((link) => (
                        <li key={link.title}>
                            <a
                                href={link.link}
                                className={cn(
                                    "block px-4 py-2 rounded-md transition-colors duration-200",
                                    pathname === link.link
                                        ? "bg-orange-primary text-white"
                                        : "hover:bg-orange-primary/20"
                                )}
                                onClick={() => setIsOpen(false)} // Close menu after navigation
                            >
                                <div className="flex items-center gap-4">
                                    {link.icon}
                                    <span>{link.title}</span>
                                </div>
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    )
}

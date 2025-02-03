"use client";

import { cn } from "@/lib/utils";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Clover } from "lucide-react";

interface NavbarProps {
    hideNavigation?: boolean;
    className?: string;
}

export default function Navbar(props: NavbarProps) {
    const router = useRouter();
    const { user } = useUser();
    const role = user?.publicMetadata?.role;

    const handleDashboardButton = () => {
        const path = role === "admin" ? "/admin/dashboard" : "/dashboard";
        router.push(path);
    };

    return (
        <nav
            className={cn(
                props.className,
                "py-4 px-6 md:px-20 flex justify-between items-center w-full bg-white shadow-sm"
            )}
        >
            {/* Logo */}
            <Link
                href="/"
                className="text-2xl font-medium flex items-center gap-2 text-green-primary"
            >
                BetterEats
                <Clover size={28} color="#B2533E" />
            </Link>

            {/* Navigation Links */}
            {!props.hideNavigation && (
                <ul className="hidden md:flex gap-8">
                    <li>
                        <Link
                            href="#home"
                            className="hover:text-green-primary transition"
                        >
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="#about"
                            className="hover:text-green-primary transition"
                        >
                            About Us
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="#features"
                            className="hover:text-green-primary transition"
                        >
                            Features
                        </Link>
                    </li>
                </ul>
            )}

            {/* Auth Buttons */}
            <div className="flex items-center">
                <SignedOut>
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            className="hidden sm:inline-block"
                            onClick={() => router.push(`/sign-up`)}
                        >
                            Register
                        </Button>
                        <Button onClick={() => router.push(`/sign-in`)}>
                            Login
                        </Button>
                    </div>
                </SignedOut>
                <SignedIn>
                    <div className="flex items-center gap-3">
                        <Button
                            className="md:block"
                            onClick={handleDashboardButton}
                        >
                            Dashboard
                        </Button>
                    </div>
                </SignedIn>
            </div>
        </nav>
    );
}

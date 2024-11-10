"use client";

import Loading from "@/components/Loading";
import Navbar from "@/components/Navbar";
import Image from "next/image"
import { Button } from "@/components/ui/button";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";// Replace this with the actual path to your image
import { UtensilsCrossed } from "lucide-react";

export default function LandingPage() {
    const router = useRouter();
    const { user } = useUser();
    const role = user?.publicMetadata?.role;

    return (
        <main className="w-full bg-paper-default">
            <Navbar />

            {/* Hero Section */}
            <div className="flex items-center bg-gray-100 rounded-lg px-20 py-10 mt-10">
                {/* Text Section */}
                <div className="w-1/2 pr-10">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Find your ideal weight and stay healthy with us
                    </h2>
                    <p className="text-gray-700 mb-6">
                        Join our community and stay updated with the latest discoveries and advancements in science.
                    </p>
                    <Button
                        className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold"
                        onClick={() => router.push("/signup")} // TODO: change route
                    >
                        Join for free
                    </Button>
                </div>

                {/* Image Section */}
                <div className="w-1/2">
                    <Image
                        src="/health.jpg"
                        alt="Food"
                        layout="responsive"
                        width={500}
                        height={400}
                        className="rounded-lg"
                    />
                </div>
            </div>

            {/* Information Section */}
            <div className="flex justify-between mt-16 gap-8 px-20">
                {/* Who We Are Card */}
                <div className="bg-white shadow-md p-8 rounded-lg flex-1 text-center">
                    <h1 className="text-2xl font-medium flex justify-center items-center gap-2 mb-4">
                        Better
                        <UtensilsCrossed size={32} color="green" />
                        Eats
                    </h1>
                    <h3 className="text-2xl font-semibold text-green-800 mb-2">Who We Are</h3>
                    <p className="text-gray-700">
                        The BetterEats application is aimed at individuals over 15 years of age who have an interest in adjusting their diet according to their individual goals, be it losing weight, maintaining a healthy lifestyle, or increasing muscle mass. This application is suitable for users who find it difficult to regulate their diet according to the nutrition they need. Apart from that, with fast and efficient features, this application is suitable for use by individuals who are busy or have a busy schedule who still want to maintain their diet.
                    </p>
                </div>
            </div>

            {/* Product Features */}
<section className="container mx-auto px-6 py-16 text-center">
  <h3 className="text-3xl font-bold text-gray-800">Product Features</h3>
  <p className="text-gray-600 mt-4 mb-10">Discover the standout features that make this smartwatch a top choice.</p>

  <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
    {/* Feature 1 */}
    <div className="flex flex-col items-center">
      <div className="bg-orange-100 p-4 rounded-full">
        <i className="fas fa-star text-orange-500 text-3xl"></i>
      </div>
      <h4 className="text-xl font-semibold text-gray-800 mt-4">High Quality</h4>
      <p className="text-gray-600 mt-2">Built with premium materials to ensure durability and excellence.</p>
    </div>

    {/* Feature 2 */}
    <div className="flex flex-col items-center">
      <div className="bg-orange-100 p-4 rounded-full">
        <i className="fas fa-paint-brush text-orange-500 text-3xl"></i>
      </div>
      <h4 className="text-xl font-semibold text-gray-800 mt-4">Awesome Design</h4>
      <p className="text-gray-600 mt-2">Sleek and modern design, perfect for any style or occasion.</p>
    </div>

    {/* Feature 3 */}
    <div className="flex flex-col items-center">
      <div className="bg-orange-100 p-4 rounded-full">
        <i className="fas fa-microchip text-orange-500 text-3xl"></i>
      </div>
      <h4 className="text-xl font-semibold text-gray-800 mt-4">Latest Technology</h4>
      <p className="text-gray-600 mt-2">Equipped with the latest technology for enhanced functionality.</p>
    </div>

    {/* Feature 4 */}
    <div className="flex flex-col items-center">
      <div className="bg-orange-100 p-4 rounded-full">
        <i className="fas fa-user-friends text-orange-500 text-3xl"></i>
      </div>
      <h4 className="text-xl font-semibold text-gray-800 mt-4">User Friendly</h4>
      <p className="text-gray-600 mt-2">Designed with simplicity and ease of use in mind.</p>
    </div>
  </div>
</section>

            {/* Footer Section */}
<footer className="bg-gray-900 text-gray-300 mt-10">
    {/* Main Footer Content */}
    <div className="container mx-auto py-10 px-6 grid grid-cols-1 md:grid-cols-3 gap-8 justify-evenly">
        {/* Features Column */}
        <div className="text-center">
            <h3 className="text-lg font-semibold text-white mb-4">Features</h3>
            <ul className="space-y-2">
                <li><a href="#" className="hover:underline">Calculator</a></li>
                <li><a href="#" className="hover:underline">Educational</a></li>
                <li><a href="#" className="hover:underline">Food</a></li>
            </ul>
        </div>

        {/* Resources Column */}
        <div className="text-center">
            <h3 className="text-lg font-semibold text-white mb-4">Resources</h3>
            <ul className="space-y-2">
                <li><a href="#" className="hover:underline">FAQ's</a></li>
                <li><a href="#" className="hover:underline">About us</a></li>
                <li><a href="#" className="hover:underline">Promotions</a></li>
                <li><a href="#" className="hover:underline">Financing</a></li>
            </ul>
        </div>

        {/* Contact Column */}
        <div className="text-center">
            <h3 className="text-lg font-semibold text-white mb-4">Contact</h3>
            <ul className="space-y-2">
                <li><a href="tel:+02112345678" className="hover:underline">(021) 12345678</a></li>
                <li><a href="#" className="hover:underline">Jakarta, Indonesia</a></li>
            </ul>
            <div className="flex justify-center space-x-4 mt-4">
                {/* Social Media Icons */}
                <a href="#" aria-label="Facebook" className="hover:text-white"><i className="fab fa-facebook"></i></a>
                <a href="#" aria-label="Instagram" className="hover:text-white"><i className="fab fa-instagram"></i></a>
            </div>
        </div>
    </div>

    {/* Bottom Footer Section */}
    <div className="bg-gray-800 py-4">
        <div className="container mx-auto flex justify-evenly items-center text-sm">
            <div className="space-x-4">
                <a href="#" className="hover:underline">Privacy Policy</a>
                <a href="#" className="hover:underline">Terms of Use</a>
            </div>
            <p className="text-gray-400">© 2024 BetterEats Jakarta, Indonesia</p>
        </div>
    </div>
</footer>

        </main>
    );
}


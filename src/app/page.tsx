"use client";

import Loading from "@/components/Loading";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    BookOpen,
    Calculator,
    Eye,
    HomeIcon,
    Newspaper,
    NewspaperIcon,
    SearchIcon,
    UsersIcon,
    UtensilsCrossed,
    UtensilsIcon,
} from "lucide-react";
import Footer from "@/components/Footer";

export default function LandingPage() {
    const router = useRouter();
    const { user } = useUser();
    const role = user?.publicMetadata?.role;

    const featureVariant = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    };

    const MotionWrapper = ({ children }: { children: React.ReactNode }) => (
        <motion.div
            className="flex flex-col items-center"
            variants={featureVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
        >
            {children}
        </motion.div>
    );

    return (
        <main className="w-full bg-white">
            <Navbar />
            <MotionWrapper>
                <div
                    id="home"
                    className="flex items-center rounded-lg px-20 py-10 mt-10"
                >
                    <div className="w-1/2 pr-10 flex flex-col items-end">
                        <h2 className="text-3xl font-bold text-green-primary mb-4 text-right">
                            Diet planning made easy.
                        </h2>
                        <p className="text-gray-700 mb-6 text-right">
                            Achieve your desired diet goal with our personalized
                            meal planner and explore trusted health articles to
                            learn more about your body and health.
                        </p>
                        <Button
                            className="ml-auto"
                            onClick={() => router.push("/sign-in")}
                        >
                            Join for free
                        </Button>
                    </div>

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
            </MotionWrapper>

            <MotionWrapper>
                <section className="bg-gray-50 ">
                    <h3 className="text-3xl font-bold text-center mt-6 text-green-primary">
                        About Us
                    </h3>
                    <div
                        id="about"
                        className="px-10 py-16 mx-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
                    >
                        <div>
                            <h1 className="text-2xl font-medium flex items-center gap-2">
                                Better
                                <UtensilsCrossed size={32} color="green" />
                                Eats
                            </h1>
                            <p className="text-gray-700 mt-4">
                                Our journey began as a simple idea for a college
                                thesis—a project that combined our passion for
                                health and technology. We wanted to create
                                something meaningful, not just for academic
                                purposes but for real-world impact.
                            </p>
                            <p className="text-gray-700 mt-2">
                                As students, we realized the challenges people
                                face in maintaining a healthy lifestyle amidst
                                busy schedules. So, we decided to build a
                                platform that simplifies meal planning and
                                provides trusted health information in one
                                place.
                            </p>
                            <p className="text-gray-700 mt-2">
                                What started as a thesis has now grown into a
                                platform dedicated to helping individuals take
                                control of their health. Whether it’s creating a
                                personalized meal plan or reading expert-backed
                                health articles, our mission is to empower you
                                to lead a healthier, happier life.
                            </p>
                            <p className="text-green-primary mt-2 font-bold">
                                Thank you for being part of our journey!
                                Together, we can make healthy living easier for
                                everyone.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            <div className="p-6 bg-white shadow-md rounded-lg">
                                <div className="flex items-center space-x-4">
                                    <Eye size={20} color="green"/>
                                    <h4 className="text-xl font-semibold text-gray-900">
                                        Our Vision
                                    </h4>
                                </div>
                                <h2 className="text-gray-700 mt-4">
                                    Building a healthier society through
                                    education and easy and practical diet
                                    planning.
                                </h2>
                            </div>

                            <div className="p-6 bg-white shadow-md rounded-lg">
                                <div className="flex items-center space-x-4">
                                    <BookOpen size={20} color="green"/>
                                    <h4 className="text-xl font-semibold text-gray-900">
                                        Our Mission
                                    </h4>
                                </div>
                                <ul className="text-gray-700 mt-4 list-disc list-inside">
                                    <li className="">
                                        To provide customizable meal planning
                                        solutions that cater to your daily
                                        nutritional needs.
                                    </li>
                                    <li>
                                        To deliver high-quality health articles
                                        backed by research and expert insights.
                                    </li>
                                    <li>
                                        To raise awareness about the importance
                                        of healthy eating in improving quality
                                        of life.
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>
            </MotionWrapper>

            <section
                id="features"
                className="container mx-auto px-6 py-16 text-center"
            >
                <h3 className="text-3xl font-bold text-green-primary">
                    Product Features
                </h3>
                <p className="text-gray-600 mt-4 mb-10">
                    Discover the standout features that make our application a
                    top choice.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                    <motion.div
                        className="flex flex-col items-center"
                        variants={featureVariant}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                    >
                        <div className="bg-orange-100 p-4 rounded-full">
                            <HomeIcon size={20} className="text-orange-500" />
                        </div>
                        <h4 className="text-xl font-semibold text-gray-800 mt-4">
                            Dashboard
                        </h4>
                        <p className="text-gray-600 mt-2">
                            View your overall progress and health values.
                        </p>
                    </motion.div>

                    <motion.div
                        className="flex flex-col items-center"
                        variants={featureVariant}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                    >
                        <div className="bg-orange-100 p-4 rounded-full">
                            <SearchIcon size={20} className="text-orange-500" />
                        </div>
                        <h4 className="text-xl font-semibold text-gray-800 mt-4">
                            Meal Search
                        </h4>
                        <p className="text-gray-600 mt-2">
                            Search for information on healthy foods that are
                            suitable for your diet.
                        </p>
                    </motion.div>
                    <motion.div
                        className="flex flex-col items-center"
                        variants={featureVariant}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                    >
                        <div className="bg-orange-100 p-4 rounded-full">
                            <Calculator size={20} className="text-orange-500" />
                        </div>
                        <h4 className="text-xl font-semibold text-gray-800 mt-4">
                            Health Calculator
                        </h4>
                        <p className="text-gray-600 mt-2">
                            Find out what you should do and calculate how many
                            calories and macronutrients you need to achieve your
                            goal using TDEE and BMI Calculator.
                        </p>
                    </motion.div>

                    <motion.div
                        className="flex flex-col items-center"
                        variants={featureVariant}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                    >
                        <div className="bg-orange-100 p-4 rounded-full">
                            <UtensilsIcon
                                size={20}
                                className="text-orange-500"
                            />
                        </div>
                        <h4 className="text-xl font-semibold text-gray-800 mt-4">
                            Meal Planner
                        </h4>
                        <p className="text-gray-600 mt-2">
                            Plan your meals according to your diet goal and
                            macronutrient needs.
                        </p>
                    </motion.div>

                    <motion.div
                        className="flex flex-col items-center"
                        variants={featureVariant}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                    >
                        <div className="bg-orange-100 p-4 rounded-full">
                            <Newspaper size={20} className="text-orange-500" />
                        </div>
                        <h4 className="text-xl font-semibold text-gray-800 mt-4">
                            Articles
                        </h4>
                        <p className="text-gray-600 mt-2">
                            Learn more about healthy lifestyle & diet tips and
                            tricks from our articles.
                        </p>
                    </motion.div>
                </div>
            </section>
            <motion.div
                className="items-center"
                variants={featureVariant}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
            >
                <Footer />
            </motion.div>
        </main>
    );
}

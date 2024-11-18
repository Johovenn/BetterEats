"use client";

import Loading from "@/components/Loading";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Footer from "@/components/landing/footer"
import { Button } from "@/components/ui/button";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion"; // Import framer-motion
import { Calculator, HomeIcon, Newspaper, NewspaperIcon, SearchIcon, UsersIcon, UtensilsCrossed, UtensilsIcon } from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const { user } = useUser();
  const role = user?.publicMetadata?.role;

  // Variants for animation
  const featureVariant = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <main className="w-full bg-white">
      <Navbar />

      {/* Banner Section */}
      <div id="home" className="flex items-center rounded-lg px-20 py-10 mt-10">
        {/* Text Section */}
        <div className="w-1/2 pr-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Find your ideal weight and stay healthy with us
          </h2>
          <p className="text-gray-700 mb-6">
            Stay on track with our personalized meal planner and explore trusted health articles to support your well-being.
          </p>
          <Button
            className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold"
            onClick={() => router.push("/sign-in")}
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

      {/* About Us Section */}
      <section id ="about" className="mx-auto px-6 py-16 mx-6 mt-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center bg-gray-50">
        {/* Left Text Content */}
        <div>
          <h2 className="text-3xl font-semibold text-green-500 uppercase">About Us</h2>
          <p className="text-gray-700 mt-4">
            Our journey began as a simple idea for a college thesis—a project that combined our passion for health and technology. We wanted to create something meaningful, not just for academic purposes but for real-world impact.
          </p>
          <p className="text-gray-700 mt-2">
            As students, we realized the challenges people face in maintaining a healthy lifestyle amidst busy schedules. So, we decided to build a platform that simplifies meal planning and provides trusted health information in one place.
          </p>
          <p className="text-gray-700 mt-2">
            What started as a thesis has now grown into a platform dedicated to helping individuals take control of their health. Whether it’s creating a personalized meal plan or reading expert-backed health articles, our mission is to empower you to lead a healthier, happier life.
          </p>
          <p className="text-gray-700 mt-2 font-bold">
            Thank you for being part of our journey! Together, we can make healthy living easier for everyone.
          </p>
        </div>

        {/* Right Mission & Vision Boxes */}
        <div className="grid grid-cols-1 gap-6">
          {/* Vision Box */}
          <div className="p-6 bg-white shadow-md rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-full">

              </div>
              <h4 className="text-xl font-semibold text-gray-900">Our Vision</h4>
            </div>
            <h2 className="text-gray-700 mt-4">
              Building a healthier society through education and easy and practical diet planning.
            </h2>
          </div>

          {/* Mission Box */}
          <div className="p-6 bg-white shadow-md rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-full">

              </div>
              <h4 className="text-xl font-semibold text-gray-900">Our Mission</h4>
            </div>
            <ul className="text-gray-700 mt-4">
              <li>To provide customizable meal planning solutions that cater to your daily nutritional needs.</li>
              <li>To deliver high-quality health articles backed by research and expert insights.</li>
              <li>To raise awareness about the importance of healthy eating in improving quality of life.</li>
            </ul>
          </div>
        </div>
      </section>


      {/* Product Features */}
      <section id="features" className="container mx-auto px-6 py-16 text-center">
        <h3 className="text-3xl font-bold text-gray-800">Product Features</h3>
        <p className="text-gray-600 mt-4 mb-10">
          Discover the standout features that make this smartwatch a top choice.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Feature 1 */}
          <motion.div
            className="flex flex-col items-center"
            variants={featureVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="bg-orange-100 p-4 rounded-full">
              {/* Replace the icon here */}
              <HomeIcon size={20} className="text-orange-500" />
            </div>
            <h4 className="text-xl font-semibold text-gray-800 mt-4">Dashboard</h4>
            <p className="text-gray-600 mt-2">
            A page that can be used to see our daily activities and the progress we have made so far
            </p>
          </motion.div>

          {/* Feature 2 */}
          <motion.div
            className="flex flex-col items-center"
            variants={featureVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="bg-orange-100 p-4 rounded-full">
              {/* Replace the icon here */}
              <SearchIcon size={20} className="text-orange-500" />
            </div>
            <h4 className="text-xl font-semibold text-gray-800 mt-4">Search Meal</h4>
            <p className="text-gray-600 mt-2">
              Page used to search for food and information about food
            </p>
          </motion.div>
          {/* Feature 3 */}
          <motion.div
            className="flex flex-col items-center"
            variants={featureVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="bg-orange-100 p-4 rounded-full">
              {/* Replace the icon here */}
              <Calculator size={20} className="text-orange-500" />
            </div>
            <h4 className="text-xl font-semibold text-gray-800 mt-4">BMI Calculator</h4>
            <p className="text-gray-600 mt-2">
            The page used to find out how many food sources we need for one day depends on the values ​​in our body
            </p>
          </motion.div>

          {/* Feature 4 */}
          <motion.div
            className="flex flex-col items-center"
            variants={featureVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="bg-orange-100 p-4 rounded-full">
              {/* Replace the icon here */}
              <UtensilsIcon size={20} className="text-orange-500" />
            </div>
            <h4 className="text-xl font-semibold text-gray-800 mt-4">Meal Planner</h4>
            <p className="text-gray-600 mt-2">
              This page is used to prepare plans for each day if we want to go on a diet and other things
            </p>
          </motion.div>

          {/* Feature 5 */}
          <motion.div
            className="flex flex-col items-center"
            variants={featureVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="bg-orange-100 p-4 rounded-full">
              {/* Replace the icon here */}
              <Newspaper size={20} className="text-orange-500" />
            </div>
            <h4 className="text-xl font-semibold text-gray-800 mt-4">Articles</h4>
            <p className="text-gray-600 mt-2">
            Page to search for articles related to health
            </p>
          </motion.div>
        </div>
      </section>
      <Footer/>
    </main>
  );
}  
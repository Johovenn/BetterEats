"use client"

import Loading from "@/components/Loading";
import MealCard from "@/components/meal-planner/MealCard.";
import SearchBar from "@/components/SearchBar";
import { useState } from "react";


export default function MealPlannerPage(){
    const [isLoading, setIsLoading] = useState(false)

    return (
        <>
            <Loading loading={isLoading} />

            <main className="px-20 py-10 w-full">
                <header className="flex justify-between items-start w-full mb-5">
                    <div>
                        <h1 className="text-3xl font-bold">Meal Planner</h1>
                    </div>
                    <SearchBar />
                </header>
                <section className="w-full">
                    <h2 className="text-2xl font-medium">Today&apos;s meal plan</h2>
                    <div className="flex justify-between p-5">
                        <MealCard 
                            title="Ayam Goreng"
                            calories={560}
                            mealType="Breakfast"
                        />
                        <MealCard 
                            title="Ayam Goreng"
                            calories={560}
                            mealType="Brunch"
                        />
                        <MealCard 
                            title="Ayam Goreng"
                            calories={560}
                            mealType="Lunch"
                        />
                        <MealCard 
                            title="Ayam Goreng"
                            calories={560}
                            mealType="Supper    "
                        />
                        <MealCard 
                            title="Ayam Goreng"
                            calories={560}
                            mealType="Dinner"
                        />
                    </div>
                </section>
            </main>
        </>
    )
}
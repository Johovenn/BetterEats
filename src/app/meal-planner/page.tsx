"use client"

import Loading from "@/components/Loading";
import MealCard from "@/components/meal-planner/MealCard.";
import SearchBar from "@/components/SearchBar";
import { useEffect, useState } from "react";
import { getMealPlan } from "./api/getMealPlan";


export default function MealPlannerPage(){
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const getData = async () => {
            setIsLoading(true)

            await getMealPlan(new Date)

            setIsLoading(false)
        }

        getData()
    }, [])

    return (
        <>
            <Loading loading={isLoading} />

            <header className="flex justify-between items-start w-full mb-5">
                <div>
                    <h1 className="text-3xl font-bold">Meal Planner</h1>
                </div>
                <SearchBar />
            </header>
            
            <section className="w-full">
                <h2 className="text-2xl font-medium">Today&apos;s meal plan</h2>
                    <div className="flex justify-between p-5">
                </div>
            </section>
        </>
    )
}
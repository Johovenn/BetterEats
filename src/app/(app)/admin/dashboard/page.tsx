"use client"

import TotalArticleCard from "@/components/dashboard/TotalArticleCard";
import TotalMealCard from "@/components/dashboard/TotalMealCard";
import TotalUserCard from "@/components/dashboard/TotalUserCard";
import PageHeader from "@/components/PageHeader";
import { useState } from "react";

export default function AdminDashboard(){
    const [totalMeals, setTotalMeals] = useState(0)
    const [totalArticles, setTotalArticles] = useState(0)
    const [totalUsers, setTotalUsers] = useState(0)

    return(
        <>
            <PageHeader 
                title="Welcome, Admin"
            />

            <section className="mt-2 grid grid-cols-4 grid-rows-2 gap-4">
                <TotalMealCard totalMeals={totalMeals}/>
                <TotalUserCard totalUsers={totalUsers}/>
                <TotalArticleCard totalArticles={totalArticles}/>
            </section>
        </>
    )
}
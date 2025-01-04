"use client"

import TotalArticleCard from "@/components/dashboard/TotalArticleCard";
import TotalMealCard from "@/components/dashboard/TotalMealCard";
import TotalUserCard from "@/components/dashboard/TotalUserCard";
import Loading from "@/components/Loading";
import PageHeader from "@/components/PageHeader";
import { useEffect, useState } from "react";
import { getAdminDashboardData } from "./api/getAdminDashboarData";
import TotalPostCard from "@/components/dashboard/TotalPostCard";

export default function AdminDashboard(){
    const [isLoading, setIsLoading] = useState(false)
    const [totalMeals, setTotalMeals] = useState(0)
    const [totalArticles, setTotalArticles] = useState(0)
    const [totalPosts, setTotalPosts] = useState(0)
    const [totalUsers, setTotalUsers] = useState(0)

    useEffect(() => {
        const getData = async () => {
            setIsLoading(true)

            await getAdminDashboardData().then((response) => {
                setTotalMeals(response.data.total_meals)
                setTotalArticles(response.data.total_articles)
                setTotalPosts(response.data.total_posts)
                setTotalUsers(response.data.total_users)
            })

            setIsLoading(false)
        }

        getData()
    }, [])

    return(
        <>
            <Loading loading={isLoading}/>

            <PageHeader 
                title="Welcome, Admin"
            />

            <section className="mt-2 grid grid-cols-4 grid-rows-2 gap-4">
                <TotalMealCard totalMeals={totalMeals}/>
                <TotalUserCard totalUsers={totalUsers}/>
                <TotalArticleCard totalArticles={totalArticles}/>
                <TotalPostCard totalPosts={totalPosts}/>
            </section>
        </>
    )
}
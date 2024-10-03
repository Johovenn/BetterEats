"use client"

import Loading from "@/components/Loading";
import SearchBar from "@/components/SearchBar";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { getAllMeals, MealProps } from "./api/getAllMeals";
import { toast } from "sonner";
import MealCard from "@/components/meal-planner/MealCard.";


export default function SearchPage(){
    const [isLoading, setIsLoading] = useState(false)
    const [page, setPage] = useState(0)
    const [limit, setLimit] = useState(10)
    const [mealName, setMealName] = useState('')
    const [searchResults, setSearchResults] = useState<MealProps[]>([])
    const searchParams = useSearchParams()
    const keyword = searchParams.get('keyword')

    const getMeals = useCallback(async () => {
        setIsLoading(true)

        await getAllMeals({
            page: page,
            limit: limit,
            meal_name: mealName,
        }).then((response) => {
            if(response.data){
                setSearchResults(response.data)
            }
        }).catch((error) => toast(error.response.data.message))

        setIsLoading(false)
    }, [limit, mealName, page])

    useEffect(() => {
        keyword ? setMealName(keyword) : setMealName('')
        getMeals()
    }, [getMeals, keyword])
    
    return(
        <>
            <Loading loading={isLoading} />

            <main className="px-20 py-10 w-full">
                <header className="flex justify-between items-start w-full">
                    <div>
                        <h1 className="text-2xl font-bold">Search for Food</h1>
                    </div>
                    <SearchBar />
                </header>

                <section className="mt-5 w-full">
                    <h2 className="text-xl font-medium">{mealName === '' ? 'Showing all search results' : `Showing search results for keyword \'${mealName}\'`}</h2>
                    <div className="flex gap-10 mt-3">
                        <div className="w-[70%] space-y-3">
                            {
                                searchResults.length > 0
                                    &&
                                searchResults.map((meal) => (
                                    <MealCard 
                                        key={meal.meal_id}
                                        mealName={meal.meal_name}
                                        calories={meal.meal_calories}
                                        carbs={meal.meal_carbohydrate}
                                        protein={meal.meal_protein}
                                        fat={meal.meal_fat}
                                    />
                                ))
                            }
                        </div>
                        <div className="w-[30%] px-4 py-2 bg-white shadow-xl rounded-xl">
                            <h3 className="text-lg">Filter</h3>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}
"use client"

import Loading from "@/components/Loading";
import MealCard from "@/components/meal-planner/MealCard.";
import SearchBar from "@/components/SearchBar";
import { useEffect, useState } from "react";
import { getMealPlan } from "./api/getMealPlan";
import { MealProps } from "../search/api/getAllMeals";
import MealPlanValueCard from "@/components/meal-planner/MealPlanValueCard";
import { useForm } from "react-hook-form";

interface FormProps {
    meal_plan_date: Date;
    meal_plan_total_calorie: number;
    meal_plan_total_protein: number;
    meal_plan_total_carbohydrate: number;
    meal_plan_total_fat: number;
    user_calorie_requirement: number;
    user_protein_requirement: number;
    user_carbohydrate_requirement: number;
    user_fat_requirement: number;
}

export default function MealPlannerPage(){
    const [isLoading, setIsLoading] = useState(false)
    const [breakfastData, setBreakfastData] = useState<MealProps[]>([])
    const [lunchData, setLunchData] = useState<MealProps[]>([])
    const [dinnerData, setDinnerData] = useState<MealProps[]>([])
    const [snackData, setSnackData] = useState<MealProps[]>([])
    
    const form = useForm<FormProps>({
        defaultValues: {
            meal_plan_date: new Date,
            meal_plan_total_calorie: 0,
            meal_plan_total_carbohydrate: 0,
            meal_plan_total_fat: 0,
            meal_plan_total_protein: 0,
            user_calorie_requirement: 0,
            user_carbohydrate_requirement: 0,
            user_fat_requirement: 0,
            user_protein_requirement: 0,
        }
    })

    useEffect(() => {
        const getData = async () => {
            setIsLoading(true)

            await getMealPlan(form.getValues('meal_plan_date')).then((response) => {
                if(response.data){
                    form.setValue('meal_plan_total_calorie', response.data.meal_plan_total_calorie)
                    form.setValue('meal_plan_total_protein', response.data.meal_plan_total_protein)
                    form.setValue('meal_plan_total_fat', response.data.meal_plan_total_fat)
                    form.setValue('meal_plan_total_carbohydrate', response.data.meal_plan_total_carbohydrate)
                    form.setValue('user_calorie_requirement', response.data.user_calorie_requirement)
                    form.setValue('user_carbohydrate_requirement', response.data.user_carbohydrate_requirement)
                    form.setValue('user_protein_requirement', response.data.user_protein_requirement)
                    form.setValue('user_fat_requirement', response.data.user_fat_requirement)
                }
            })

            setIsLoading(false)
        }

        getData()
    }, [form])

    return (
        <>
            <Loading loading={isLoading} />

            <header className="flex justify-between items-start w-full mb-5">
                <div>
                    <h1 className="text-2xl font-medium">Meal Planner</h1>
                </div>
                <SearchBar />
            </header>

            <div className="w-full flex justify-between">
                <div className="w-[65%] mb-5 px-4 py-2 bg-white shadow-lg rounded-lg">
                    <section className="w-full mb-5 p-2">
                        <h2 className="text-lg font-medium">Breakfast</h2>
                        <div className="flex justify-between p-5">

                        </div>
                    </section>

                    <section className="w-full mb-5 p-2 bg-white">
                        <h2 className="text-lg font-medium">Lunch</h2>
                        <div className="flex justify-between p-5">

                        </div>
                    </section>

                    <section className="w-full mb-5 p-2 bg-white">
                        <h2 className="text-lg font-medium">Dinner</h2>
                        <div className="flex justify-between p-5">

                        </div>
                    </section>
                </div>
                <div className="w-[30%]">
                    <MealPlanValueCard 
                        date={form.watch('meal_plan_date')}
                        calorieValue={form.watch('meal_plan_total_calorie')}
                        maxCalorie={form.watch('user_calorie_requirement')}
                        proteinValue={form.watch('meal_plan_total_protein')}
                        maxProtein={form.watch('user_protein_requirement')}
                        carbohydrateValue={form.watch('meal_plan_total_carbohydrate')}
                        maxCarbohydrate={form.watch('user_carbohydrate_requirement')}
                        fatValue={form.watch('meal_plan_total_fat')}
                        maxFat={form.watch('user_fat_requirement')}
                        handleChangeDate={() => {}}
                    />
                </div>
            </div>
        </>
    )
}
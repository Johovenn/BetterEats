"use client"

import Loading from "@/components/Loading";
import MealCard from "@/components/meal-planner/MealCard.";
import SearchBar from "@/components/SearchBar";
import { useCallback, useEffect, useState } from "react";
import { getMealPlan, MealPlanDetailProps } from "./api/getMealPlan";
import { MealProps } from "../search/api/getAllMeals";
import MealPlanValueCard from "@/components/meal-planner/MealPlanValueCard";
import { useForm } from "react-hook-form";
import PageHeader from "@/components/PageHeader";
import AlertModal from "@/components/AlertModal";
import { deleteMealPlan } from "./api/deleteMealPlan";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [mealPlanDetailId, setMealPlanDetailId] = useState<any>()
    const [alertDeleteModal, setAlertDeleteModal] = useState(false)
    const [breakfastData, setBreakfastData] = useState<MealPlanDetailProps[]>([])
    const [lunchData, setLunchData] = useState<MealPlanDetailProps[]>([])
    const [dinnerData, setDinnerData] = useState<MealPlanDetailProps[]>([])
    const [snackData, setSnackData] = useState<MealPlanDetailProps[]>([])
    
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

    const getMealPlanData = useCallback(async () => {
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
                response.data.meals.breakfast ? setBreakfastData(response.data.meals.breakfast) : null
                response.data.meals.lunch ? setLunchData(response.data.meals.lunch) : null
                response.data.meals.dinner ? setDinnerData(response.data.meals.dinner) : null
                response.data.meals.snack ? setSnackData(response.data.meals.snack) : null
            }
        })

        setIsLoading(false)
    }, [form])

    useEffect(() => {
        getMealPlanData()
    }, [getMealPlanData])

    const handleChangeDate = async (date: Date) => {
        form.setValue('meal_plan_date', date)
        
        getMealPlanData()
    }

    const handleDeleteButton = async (meal_plan_detail_id: number) => {
        setMealPlanDetailId(meal_plan_detail_id)
        setAlertDeleteModal(true)
    } 

    const onConfirmDelete = async () => {
        setIsLoading(true)

        await deleteMealPlan(mealPlanDetailId).then((response) => {
            toast("Meal successfully removed!")
            router.refresh()
        }).catch((error) => {
            toast("Error removing meal, please try again.")
        })

        getMealPlanData()
        setIsLoading(false)
    }

    return (
        <>
            <Loading loading={isLoading} />

            <PageHeader 
                title="Meal Planner"
            />

            <AlertModal 
                title="Remove meal plan?"
                description="Are you sure you want to remove this meal from the meal plan? You can always re-add the meal to the meal plan later."
                isOpen={alertDeleteModal}
                handleClose={() => setAlertDeleteModal(false)}
                onConfirm={onConfirmDelete}
                setIsOpen={setAlertDeleteModal}
            />

            <div className="w-full flex justify-between">
                <div className="w-[65%] mb-5 px-4 py-2 bg-[#fefefe] shadow-lg rounded-lg">
                    <section className="w-full mb-5 p-2">
                        <h2 className="text-lg font-medium">Breakfast</h2>
                        <div className="flex flex-col gap-3 justify-between">
                            {
                                breakfastData.length > 0
                                    ?
                                breakfastData.map((meal) => (
                                    <MealCard 
                                        key={meal.meal_plan_detail_id}
                                        meal={meal}
                                        mode="meal-plan"
                                        handleDeleteButton={handleDeleteButton}
                                    />
                                ))
                                    :
                                "No meal plan data found"
                            }
                        </div>
                    </section>

                    <section className="w-full mb-5 p-2 bg-white">
                        <h2 className="text-lg font-medium">Snack</h2>
                        <div className="flex flex-col gap-3 justify-between">
                            {
                                snackData.length > 0
                                    ?
                                snackData.map((meal) => (
                                    <MealCard 
                                        key={meal.meal_plan_detail_id}
                                        meal={meal}
                                        mode="meal-plan"
                                        handleDeleteButton={handleDeleteButton}
                                    />
                                ))
                                    :
                                "No meal plan data found"
                            }
                        </div>
                    </section>

                    <section className="w-full mb-5 p-2 bg-white">
                        <h2 className="text-lg font-medium">Lunch</h2>
                        <div className="flex flex-col gap-3 justify-between">
                            {
                                lunchData.length > 0
                                    ?
                                lunchData.map((meal) => (
                                    <MealCard 
                                        key={meal.meal_plan_detail_id}
                                        meal={meal}
                                        mode="meal-plan"
                                        handleDeleteButton={handleDeleteButton}
                                    />
                                ))
                                    :
                                "No meal plan data found"
                            }
                        </div>
                    </section>

                    <section className="w-full mb-5 p-2 bg-white">
                        <h2 className="text-lg font-medium">Dinner</h2>
                        <div className="flex flex-col gap-3 justify-between">
                            {
                                dinnerData.length > 0
                                    ?
                                dinnerData.map((meal) => (
                                    <MealCard 
                                        key={meal.meal_plan_detail_id}
                                        meal={meal}
                                        mode="meal-plan"
                                        handleDeleteButton={handleDeleteButton}
                                    />
                                ))
                                    :
                                "No meal plan data found"
                            }
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
                        handleChangeDate={handleChangeDate}
                    />
                </div>
            </div>
        </>
    )
}
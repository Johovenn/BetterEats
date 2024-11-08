"use client"
import Loading from "@/components/Loading"
import SearchBar from "@/components/SearchBar"
import { useUser } from "@clerk/nextjs"
import { Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import MealPlanValueCard from "@/components/meal-planner/MealPlanValueCard"
import { getMealPlanTotalNutrition } from "../meal-planner/api/getMealPlanTotalNutrition"
import { useForm } from "react-hook-form"
import PageHeader from "@/components/PageHeader"
import BMRCard from "@/components/dashboard/BMRCard"
import BMICard from "@/components/dashboard/BMICard"
import { getUserBMI } from "../health-calculator/api/getUserBMI"
import RecommendedMeals from "@/components/dashboard/RecommendedMeals"
import { getAllMeals } from "../search/api/getAllMeals"

interface FormProps {
    meal_plan_date: Date
    meal_plan_total_calorie: number
    meal_plan_total_protein: number
    meal_plan_total_carbohydrate: number
    meal_plan_total_fat: number
    user_calorie_requirement: number
    user_protein_requirement: number
    user_carbohydrate_requirement: number
    user_fat_requirement: number
    user_bmi_value: number
}

export default function DashboardPage(){
    const [isLoading, setIsLoading] = useState(false)
    const [bmrValue, setBmrValue] = useState(0)
    const [recommendedMeals, setRecommendedMeals] = useState<any>([])

    const {user} = useUser()

    const today = new Date()
    const options: Intl.DateTimeFormatOptions = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    }
    const formattedDate = today.toLocaleDateString('en-US', options)

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
            user_bmi_value: 0,
        }
    })

    const getTotalNutrition = useCallback(async () => {
        setIsLoading(true)

        await getMealPlanTotalNutrition(form.getValues('meal_plan_date')).then((response) => {
            if(response.data){
                form.setValue('meal_plan_total_calorie', response.data.meal_plan_total_calorie)
                form.setValue('meal_plan_total_carbohydrate', response.data.meal_plan_total_carbohydrate)
                form.setValue('meal_plan_total_fat', response.data.meal_plan_total_fat)
                form.setValue('meal_plan_total_protein', response.data.meal_plan_total_protein)
                form.setValue('user_calorie_requirement', response.data.user_calorie_requirement)
                form.setValue('user_protein_requirement', response.data.user_protein_requirement)
                form.setValue('user_fat_requirement', response.data.user_fat_requirement)
                form.setValue('user_carbohydrate_requirement', response.data.user_carbohydrate_requirement)
            }
        })

        setIsLoading(false)
    }, [form])

    const getBMI = useCallback(async () => {
        setIsLoading(true)

        await getUserBMI().then((response) => {
            if(response.data.user_bmi_value){
                form.setValue('user_bmi_value', response.data.user_bmi_value)
            }  
        })

        setIsLoading(false)
    }, [form])

    const getRecommendedMeals = useCallback(async () => {
        setIsLoading(true)

        await getAllMeals({
            page: 0,
            limit: 2,
        }).then((response) => {
            setRecommendedMeals(response.data)
        }).catch((error) => setRecommendedMeals([]))

        setIsLoading(false)
    }, [])

    const handleChangeDate = async (date: Date) => {
        form.setValue('meal_plan_date', date)
        
        getTotalNutrition()
    }

    useEffect(() => {
        getTotalNutrition()
        getBMI()
        getRecommendedMeals()
    }, [form, getBMI, getRecommendedMeals, getTotalNutrition])
    
    if(!user){
        return null
    }

    return(
        <>
            <Loading loading={isLoading} />

            <PageHeader 
                title={`Hi, ${user.fullName}`}
                subtitle={`It's ${formattedDate}`}
            />

            <section className="mt-2 grid grid-cols-3 grid-rows-2 gap-4">
                <BMRCard 
                    bmrValue={form.watch('user_calorie_requirement')}
                />
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
                <BMICard
                    bmiValue={form.watch('user_bmi_value')}
                />
                <RecommendedMeals 
                    meals={recommendedMeals}
                />
            </section>
        </>
    )
}
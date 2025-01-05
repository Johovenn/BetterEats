"use client"
import Loading from "@/components/Loading"
import SearchBar from "@/components/SearchBar"
import { useUser } from "@clerk/nextjs"
import { Router, Search } from "lucide-react"
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
import { getAllMeals, MealProps } from "../search/api/getAllMeals"
import { getRecommendedMeals } from "../search/api/getRecommendedMeals"
import AddMealPlanModal from "@/components/meal-planner/AddMealPlanModal"
import AlertModal from "@/components/AlertModal"
import { getUserBMR } from "../health-calculator/api/getUserBMR"
import MealDetailModal from "@/components/meal-planner/MealDetailModal"

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
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [bmrValue, setBmrValue] = useState(0)
    const [addMealModal, setAddMealModal] = useState(false)
    const [selectedMeal, setSelectedMeal] = useState<MealProps>()
    const [recommendedMeals, setRecommendedMeals] = useState<any>([])
    const [selectedMealId, setSelectedMealId] = useState<number>()
    const [detailModal, setDetailModal] = useState(false)
    const [alertModal, setAlertModal] = useState(false)

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
        }).catch((error) => {})

        setIsLoading(false)
    }, [form])

    const getBMI = useCallback(async () => {
        setIsLoading(true)

        await getUserBMI().then((response) => {
            if(response.data){
                response.data.user_bmi_value !== null ? form.setValue('user_bmi_value', response.data.user_bmi_value) : null
            }  
        }).catch((error) => {})

        setIsLoading(false)
    }, [form])

    const getTDEE = useCallback(async () => {
        setIsLoading(true)

        await getUserBMR().then((response) => {
            if(response.data === null){
                setAlertModal(true)
            }
        }).catch((error) => {
            setAlertModal(true)
        })

        setIsLoading(false)
    }, [])

    const getMeals = useCallback(async () => {
        setIsLoading(true)

        await getRecommendedMeals({
            page: 0,
            limit: 2,
            meal_plan_date: form.watch('meal_plan_date')
        }).then((response) => {
            setRecommendedMeals(response.data)
        }).catch((error) => setRecommendedMeals([]))

        setIsLoading(false)
    }, [form])

    const handleChangeDate = async (date: Date) => {
        form.setValue('meal_plan_date', date)
        
        getTotalNutrition()
        getMeals()
    }
    
    const handleAddMealButton = (meal: MealProps) => {
        setSelectedMeal(meal)
        setAddMealModal(true)
    } 

    const handleInfoButton = (meal_id: number) => {
        setSelectedMealId(meal_id)
        setDetailModal(true)
    }


    useEffect(() => {
        getTotalNutrition()
        getBMI()
        getMeals()
        getTDEE()
    }, [form, getBMI, getMeals, getTDEE, getTotalNutrition])
    
    if(!user){
        return null
    }

    return(
        <>
            <Loading loading={isLoading} />

            <AlertModal 
                title="Calculate your TDEE values"
                description="It is recommended for you to first calculate your TDEE values as it will be the base for our recommendations."
                isOpen={alertModal}
                setIsOpen={setAlertModal}
                handleClose={() => setAlertModal(false)}
                onConfirm={() => {
                    router.push(`/health-calculator`)
                }}
            />

            <MealDetailModal
                isOpen={detailModal}
                setIsOpen={setDetailModal}
                handleClose={() => setDetailModal(false)}
                mealId={selectedMealId}
            />

            <AddMealPlanModal
                isOpen={addMealModal}
                handleClose={() => setAddMealModal(false)}
                setIsOpen={setAddMealModal}
                meal={selectedMeal || {} as MealProps}
            />

            <PageHeader 
                title={`Hi, ${user.fullName}`}
                subtitle={`It's ${formattedDate}`}
            />

            <section className="mt-2 grid grid-cols-4 grid-rows-2 gap-4">
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
                    handleAddMealButton={handleAddMealButton}
                    handleInfoButton={handleInfoButton}
                />
            </section>
        </>
    )
}
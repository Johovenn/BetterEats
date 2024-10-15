import { MealProps } from "@/app/search/api/getAllMeals";
import { ResponseProps } from "@/lib/api";
import axios from "axios";

export interface MealPlanProps{
    meal_plan_id: number
    meal_plan_date: Date
    meals: {
        breakfast: MealProps[]
        lunch: MealProps[]
        dinner: MealProps[]
        snack: MealProps[]
    }
}

export async function getMealPlan(meal_plan_date: Date): Promise<ResponseProps<MealPlanProps>>{
    return (await axios.get(`/api/meal-plan?meal_plan_date=${meal_plan_date}`)).data
}   
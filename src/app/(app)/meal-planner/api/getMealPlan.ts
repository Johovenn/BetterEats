import { ResponseProps } from "@/lib/api";
import axios from "axios";
import { MealProps } from "../../search/api/getAllMeals";

export interface MealPlanProps{
    meal_plan_id: number
    meal_plan_date: Date
    meal_plan_total_calorie: number
    meal_plan_total_protein: number
    meal_plan_total_fat: number
    meal_plan_total_carbohydrate: number
    user_calorie_requirement: number
    user_protein_requirement: number
    user_carbohydrate_requirement: number
    user_fat_requirement: number
    meals: {
        breakfast: MealPlanDetailProps[]
        lunch: MealPlanDetailProps[]
        dinner: MealPlanDetailProps[]
        snack: MealPlanDetailProps[]
    }
}

export interface MealPlanDetailProps extends MealProps {
    meal_plan_detail_id: number
}

export async function getMealPlan(meal_plan_date: Date): Promise<ResponseProps<MealPlanProps>>{
    return (await axios.get(`/api/meal-plan?meal_plan_date=${meal_plan_date}`)).data
}   
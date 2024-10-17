import { ResponseProps } from "@/lib/api";
import axios from "axios";

export interface MealPlanTotalNutritionProps{
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

export async function getMealPlanTotalNutrition(meal_plan_date: Date): Promise<ResponseProps<MealPlanTotalNutritionProps>>{
    return (await axios.get(`/api/meal-plan/total-nutrition?meal_plan_date=${meal_plan_date}`)).data
}   
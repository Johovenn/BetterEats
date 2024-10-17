import { ResponseProps } from "@/lib/api";
import { MealPlanProps } from "./getMealPlan";
import axios from "axios";

interface CreateMealPlanProps{
    meal_plan_date: Date
    meal_type_id: number
    meal_id: number
}

export async function postMealPlan(request: CreateMealPlanProps): Promise<ResponseProps<MealPlanProps>>{
    return (await axios.post(`/api/meal-plan`, request)).data
}
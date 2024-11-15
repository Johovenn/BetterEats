import { ResponseProps } from "@/lib/api";
import { MealPlanProps } from "./getMealPlan";
import axios from "axios";

interface GenerateMealPlanProps{
    meal_plan_date: Date
}

export async function generateMealPlan(request: GenerateMealPlanProps): Promise<ResponseProps<MealPlanProps>>{
    return (await axios.post(`/api/meal-plan/generate`, {
        meal_plan_date: request.meal_plan_date
    })).data
}
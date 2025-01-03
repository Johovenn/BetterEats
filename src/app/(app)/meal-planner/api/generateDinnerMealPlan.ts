import { ResponseProps } from "@/lib/api";
import { MealPlanProps } from "./getMealPlan";
import axios from "axios";
import { formatDateTime } from "@/lib/dateUtils";

interface GenerateMealPlanProps{
    meal_plan_date: Date
}

export async function generateDinnerMealPlan(request: GenerateMealPlanProps): Promise<ResponseProps<MealPlanProps>>{
    return (await axios.post(`/api/meal-plan/generate/dinner?meal_plan_date=${request.meal_plan_date}`, {
        meal_plan_date: new Date(formatDateTime(request.meal_plan_date))
    })).data
}
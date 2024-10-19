import { ResponseProps } from "@/lib/api";
import { MealPlanProps } from "./getMealPlan";
import axios from "axios";

export async function deleteMealPlan(meal_plan_detail_id: number): Promise<ResponseProps<MealPlanProps>>{
    return (await axios.delete(`/api/meal-plan/${meal_plan_detail_id}`)).data
}
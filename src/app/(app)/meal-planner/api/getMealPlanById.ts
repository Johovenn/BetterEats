import { ResponseProps } from "@/lib/api";
import axios from "axios";
import { MealPlanData } from "../../community/api/getAllPosts";

export async function getMealPlanById(meal_plan_id: number): Promise<ResponseProps<MealPlanData>>{
    return (await axios.get(`/api/meal-plan/${meal_plan_id}`)).data
}
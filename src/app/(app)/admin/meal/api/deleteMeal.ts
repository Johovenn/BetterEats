import { MealProps } from "@/app/(app)/search/api/getAllMeals";
import { ResponseProps } from "@/lib/api";
import axios from "axios";

export async function deleteMeal(meal_id: number): Promise<ResponseProps<MealProps>>{
    return (await axios.delete(`/api/meal/${meal_id}`)).data
}
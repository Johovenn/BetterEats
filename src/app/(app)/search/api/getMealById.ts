import { ResponseProps } from "@/lib/api";
import axios from "axios";
import { MealProps } from "./getAllMeals";

export async function getMealById(meal_id: number): Promise<ResponseProps<MealProps>>{
    return (await axios.get(`/api/meal/${meal_id}`)).data
}
import { ResponseProps } from "@/lib/api";
import axios from "axios";

export interface MealTypeProps{
    meal_type_id: number
    meal_type_description: string
}

export async function getMealType(): Promise<ResponseProps<MealTypeProps[]>>{
    return (await axios.get(`/api/meal-type`)).data
}
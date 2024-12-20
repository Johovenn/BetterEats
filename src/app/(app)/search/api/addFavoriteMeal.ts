import { ResponseProps } from "@/lib/api";
import axios from "axios";

export interface FavoriteMealProps{
    favorite_meal_id: number
    meal_id: number
    user_id: string
}

export async function addFavoriteMeal(meal_id: number): Promise<ResponseProps<FavoriteMealProps>>{
    return (await axios.post(`/api/meal/favorite`, {
        meal_id: meal_id
    })).data
}
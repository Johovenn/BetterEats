import { ResponseProps } from "@/lib/api";
import axios from "axios";
import { FavoriteMealProps } from "./addFavoriteMeal";

export async function deleteFavoriteMeal(meal_id: number): Promise<ResponseProps<FavoriteMealProps>>{
    return (await axios.delete(`/api/meal/favorite/${meal_id}`)).data
}
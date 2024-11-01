import { MealProps } from "@/app/(app)/search/api/getAllMeals";
import { ResponseProps } from "@/lib/api";
import axios from "axios";

export interface PostMealRequestProps{
    meal_name: string
    meal_calories: number
    meal_protein: number
    meal_carbohydrate: number
    meal_fat: number
    meal_ingredients: string
    meal_recipe: string
    is_breakfast: boolean
    is_lunch: boolean
    is_dinner: boolean
    is_snack: boolean
    meal_image: string
}

export async function postMeal(request: PostMealRequestProps): Promise<ResponseProps<MealProps>>{
    return (await axios.post(`/api/meal`, request)).data
}
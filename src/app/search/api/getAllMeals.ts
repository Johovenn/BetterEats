import { ResponseProps } from "@/lib/api"
import axios from "axios"

export interface MealProps{
    meal_id: number
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
}

interface GetAllMealRequest{
    page: number
    limit: number
    meal_name: string
}

export async function getAllMeals(request: GetAllMealRequest): Promise<ResponseProps<MealProps[]>>{
    let url = `/api/meal?page=${request.page}&limit=${request.limit}`
    if(request.meal_name) url += `&meal_name=${request.meal_name}`
    return (await axios.get(url)).data
}
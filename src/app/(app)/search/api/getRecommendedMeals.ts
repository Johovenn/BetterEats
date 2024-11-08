import { ResponseProps } from "@/lib/api"
import axios from "axios"

export interface MealProps{
    meal_id: number
    meal_name: string
    meal_image: string
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
    meal_type_description: string
    meal_plan_detail_id: number
}

interface GetAllMealRequest{
    page: number
    limit: number
    meal_plan_date: Date
}

export async function getRecommendedMeals(request: GetAllMealRequest): Promise<ResponseProps<MealProps[]>>{
    let url = `/api/meal/recommended?page=${request.page}&limit=${request.limit}`
    if(request.meal_plan_date) url += `&meal_plan_date=${request.meal_plan_date}`
    return (await axios.get(url)).data
}
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
    meal_name?: string
    is_breakfast?: boolean
    is_lunch?: boolean
    is_dinner?: boolean
    is_snack?: boolean
    calorie_range_from?: number
    calorie_range_to?: number
}

export async function getAllMeals(request: GetAllMealRequest): Promise<ResponseProps<MealProps[]>>{
    let url = `/api/meal?page=${request.page}&limit=${request.limit}`
    if(request.meal_name) url += `&meal_name=${request.meal_name}`
    if(request.is_breakfast) url += `&is_breakfast=${request.is_breakfast}`
    if(request.is_lunch) url += `&is_lunch=${request.is_lunch}`
    if(request.is_dinner) url += `&is_dinner=${request.is_dinner}`
    if(request.is_snack) url += `&is_snack=${request.is_snack}`
    if(request.calorie_range_from) url += `&calorie_range_from=${request.calorie_range_from}`
    if(request.calorie_range_to) url += `&calorie_range_to=${request.calorie_range_to}`
    return (await axios.get(url)).data
}
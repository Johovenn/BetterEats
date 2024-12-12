import { ResponseProps } from "@/lib/api"
import axios from "axios"
import { MealProps } from "./getAllMeals"

interface GetAllMostPopularMealRequest{
    page: number
    limit: number
    meal_name?: string
    is_breakfast?: boolean
    is_lunch?: boolean
    is_dinner?: boolean
    is_snack?: boolean
    calorie_range_from?: number
    calorie_range_to?: number
    fat_range_from?: number
    fat_range_to?: number
    protein_range_from?: number
    protein_range_to?: number
    carbohydrate_range_from?: number
    carbohydrate_range_to?: number
}

export async function getAllMostPopularMeals(request: GetAllMostPopularMealRequest): Promise<ResponseProps<MealProps[]>>{
    let url = `/api/meal/popular?page=${request.page}&limit=${request.limit}`
    if(request.meal_name) url += `&meal_name=${request.meal_name}`
    if(request.is_breakfast) url += `&is_breakfast=${request.is_breakfast}`
    if(request.is_lunch) url += `&is_lunch=${request.is_lunch}`
    if(request.is_dinner) url += `&is_dinner=${request.is_dinner}`
    if(request.is_snack) url += `&is_snack=${request.is_snack}`
    if(request.calorie_range_from) url += `&calorie_range_from=${request.calorie_range_from}`
    if(request.calorie_range_to) url += `&calorie_range_to=${request.calorie_range_to}`
    if(request.protein_range_from) url += `&protein_range_from=${request.protein_range_from}`
    if(request.protein_range_to) url += `&protein_range_to=${request.protein_range_to}`
    if(request.fat_range_from) url += `&fat_range_from=${request.fat_range_from}`
    if(request.fat_range_to) url += `&fat_range_to=${request.fat_range_to}`
    if(request.carbohydrate_range_from) url += `&carbohydrate_range_from=${request.carbohydrate_range_from}`
    if(request.carbohydrate_range_to) url += `&carbohydrate_range_to=${request.carbohydrate_range_to}`
    return (await axios.get(url)).data
}
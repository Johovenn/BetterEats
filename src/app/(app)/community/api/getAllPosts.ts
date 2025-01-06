import { ResponseProps } from "@/lib/api"
import axios from "axios"
import { MealPlanDetailProps } from "../../meal-planner/api/getMealPlan"

interface MealPlanDetail {
    meal_plan_detail_id: number
    meal_id: number
    meal_image: string
    meal_name: string
    meal_calories: number
    meal_protein: number
    meal_carbohydrate: number
    meal_fat: number
}

export interface MealPlanQuoteProps {
    meal_plan_detail_id: number
    meal_id: number
    meal_image: string
    meal_name: string
    meal_calories: number
    meal_protein: number
    meal_carbohydrate: number
    meal_fat: number
}

interface MealPlanDetails {
    breakfast: MealPlanQuoteProps[]
    lunch: MealPlanQuoteProps[]
    dinner: MealPlanQuoteProps[]
    snack: MealPlanQuoteProps[]
}

export interface MealPlanData {
    meal_plan_id: number
    meal_plan_date: Date
    meal_plan_total_calorie: number
    meal_plan_total_carbohydrate: number
    meal_plan_total_protein: number
    meal_plan_total_fat: number
    meal_plan_details: MealPlanDetails
}

export interface PostProps {
    post_id: number
    user_id: string
    user_name: string
    username: string
    user_profile_picture: string
    post_body: string
    post_date: string
    meal_plan_id: number
    is_liked: boolean
    like_count: number
    reply_count: number
    replies: PostProps[]
    meal_plan_data: MealPlanData
}

interface GetAllMealRequest{
    page: number
    limit: number
    post_body?: string
}

export async function getAllPosts(request: GetAllMealRequest): Promise<ResponseProps<PostProps[]>>{
    let url = `/api/post?page=${request.page}&limit=${request.limit}`
    if(request.post_body) url += `&post_body=${request.post_body}`
    return (await axios.get(url)).data
}
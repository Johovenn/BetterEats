import { ResponseProps } from "@/lib/api";
import axios from "axios";

export interface UserTDEEProps{
    user_tdee_id: number
    user_id: string
    user_tdee_date: Date
    user_weight: number
    user_height: number
    user_age: number
    user_tdee_value: number
    user_gender: string
    activity_level_id: number
    activity_level_code: "AL1" | "AL2" | "AL3" | "AL4" | "AL5"
    goal_id: number
    goal_code: "GM" | "LW" | "MW"
    protein: number
    fat: number
    carbohydrate: number
}

export async function getUserTDEE(): Promise<ResponseProps<UserTDEEProps>>{
    return (await axios.get(`/api/tdee`)).data
}
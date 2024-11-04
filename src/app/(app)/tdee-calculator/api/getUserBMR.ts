import { ResponseProps } from "@/lib/api";
import axios from "axios";

export interface UserBMRProps{
    user_bmr_id: number
    user_id: string
    user_bmr_date: Date
    user_weight: number
    user_height: number
    user_age: number
    user_bmr_value: number
    user_gender: string
    activity_level_id: number
    activity_level_code: "AL1" | "AL2" | "AL3" | "AL4" | "AL5"
    goal_id: number
    goal_code: "GM" | "LW" | "MW"
    protein: number
    fat: number
    carbohydrate: number
}

export async function getUserBMR(): Promise<ResponseProps<UserBMRProps>>{
    return (await axios.get(`/api/bmr`)).data
}
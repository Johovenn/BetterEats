import { ResponseProps } from "@/lib/api";
import axios from "axios";
import { UserTDEEProps } from "./getUserTDEE";

export interface CalculateTDEEProps{
    user_height: number
    user_weight: number
    user_age: number
    user_gender: string
    activity_level_code: any
    goal_code: any
}

export interface TDEECalculationProps{
    tdee_value: number
    protein: number
    fat: number
    carbohydrate: number
}

export async function getTDEEValue(request: CalculateTDEEProps): Promise<ResponseProps<TDEECalculationProps>>{
    return (await axios.post(`/api/tdee/calculate`, request)).data
}
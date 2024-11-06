import { ResponseProps } from "@/lib/api";
import axios from "axios";
import { UserBMRProps } from "./getUserBMR";

export interface CalculateBMRProps{
    user_height: number
    user_weight: number
    user_age: number
    user_gender: string
    activity_level_code: any
    goal_code: any
}

export interface BMRCalculationProps{
    bmr_value: number
    protein: number
    fat: number
    carbohydrate: number
}

export async function getBMRValue(request: CalculateBMRProps): Promise<ResponseProps<BMRCalculationProps>>{
    return (await axios.post(`/api/bmr/calculate`, request)).data
}
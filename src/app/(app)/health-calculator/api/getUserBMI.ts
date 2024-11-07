import { ResponseProps } from "@/lib/api";
import axios from "axios";

export interface UserBMIProps{
    user_bmi_id: number
    user_id: string
    user_bmi_date: Date
    user_weight: number
    user_height: number
    user_age: number
    user_gender: string
    user_bmi_value: number
}

export async function getUserBMI(): Promise<ResponseProps<UserBMIProps>>{
    return (await axios.get(`/api/bmi`)).data
}
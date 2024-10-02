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
}

export async function getUserBMR(): Promise<ResponseProps<UserBMRProps>>{
    return (await axios.get(`/api/bmr`)).data
}
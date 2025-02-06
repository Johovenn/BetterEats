import { ResponseProps } from "@/lib/api";
import axios from "axios";
import { UserTDEEProps } from "./getUserTDEE";

export interface PostUserTDEERequestProps{
    user_height: number
    user_weight: number
    user_age: number
    user_gender: string
    user_tdee_date: Date | null
}

export async function postUserTDEE(request: PostUserTDEERequestProps): Promise<ResponseProps<UserTDEEProps>>{
    return (await axios.post(`/api/tdee`, request)).data
}
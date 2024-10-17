import { ResponseProps } from "@/lib/api";
import axios from "axios";
import { UserBMRProps } from "./getUserBMR";

export interface PostUserBMRRequestProps{
    user_height: number
    user_weight: number
    user_age: number
    user_gender: string
    user_bmr_date: Date | null
}

export async function postUserBMR(request: PostUserBMRRequestProps): Promise<ResponseProps<UserBMRProps>>{
    return (await axios.post(`/api/bmr`, request)).data
}
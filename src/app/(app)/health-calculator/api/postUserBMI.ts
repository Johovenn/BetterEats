import { ResponseProps } from "@/lib/api";
import axios from "axios";
import { UserBMIProps } from "./getUserBMI";

interface PostUserBMIRequestProps{
    user_weight: number
    user_height: number
    user_age: number
    user_gender: string
    user_bmi_value: number
}

export async function postUserBMI(request: PostUserBMIRequestProps): Promise<ResponseProps<UserBMIProps>>{
    return (await axios.post(`/api/bmi`, request)).data
}
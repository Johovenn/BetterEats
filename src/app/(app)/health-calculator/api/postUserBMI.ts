import { ResponseProps } from "@/lib/api";
import axios from "axios";
import { UserBMRProps } from "./getUserBMR";

interface PostUserBMIRequestProps{
    user_weight: number
    user_height: number
    user_age: number
    user_gender: string
}

export async function postUserBMI(request: PostUserBMIRequestProps): Promise<ResponseProps<UserBMRProps>>{
    return (await axios.post(`/api/bmi`, request)).data
}
import { ResponseProps } from "@/lib/api";
import axios from "axios";

interface CalculateBMIRequestProps{
    user_height: number
    user_weight: number
    user_age: number
    user_gender: string
}

export interface BMICalculationProps{
    bmi_value: number
}

export async function getBMIValue(request: CalculateBMIRequestProps): Promise<ResponseProps<BMICalculationProps>>{
    return (await axios.post(`/api/bmi/calculate`, request)).data
}
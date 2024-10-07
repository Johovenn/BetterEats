import { ResponseProps } from "@/lib/api";
import axios from "axios";

export interface GoalProps{
    goal_id: number
    goal_description: string
    goal_calorie_multiplier: number
    goal_protein_multiplier: number
    goal_carbohydrate_multiplier: number
    goal_fat_multiplier: number
}

export async function getGoal(): Promise<ResponseProps<GoalProps[]>>{
    return (await axios.get(`/api/goal`)).data
}
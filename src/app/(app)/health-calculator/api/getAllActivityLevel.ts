import { ResponseProps } from "@/lib/api";
import axios from "axios";

export interface ActivityLevelProps{
    activity_level_id: number
    activity_level_description: string
    activity_level_multiplier: number
}

export async function getActivityLevel(): Promise<ResponseProps<ActivityLevelProps[]>>{
    return (await axios.get(`/api/activity-level`)).data
}
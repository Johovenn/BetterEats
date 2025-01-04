import { PostProps } from "@/app/(app)/community/api/getAllPosts"
import { ResponseProps } from "@/lib/api"
import axios from "axios"

interface AdminDashboardDataProps{
    total_meals: number
    total_posts: number
    total_articles: number
    total_users: number
}

export async function getAdminDashboardData(): Promise<ResponseProps<AdminDashboardDataProps>>{
    return (await axios.get(`/api/admin/dashboard`)).data
}
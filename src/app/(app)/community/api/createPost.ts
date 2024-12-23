import { ResponseProps } from "@/lib/api";
import axios from "axios";
import { PostProps } from "./getAllPosts";

interface CreatePostRequestProps{
    post_body: string
    meal_plan_id?: number
    reply_to_id?: number
}

export async function createPost(request: CreatePostRequestProps): Promise<ResponseProps<PostProps>>{
    return (await axios.post(`/api/post`, {
        post_body: request.post_body,
        meal_plan_id: request.meal_plan_id,
        reply_to_id: request.reply_to_id,
    })).data
}
import { ResponseProps } from "@/lib/api";
import axios from "axios";
import { PostProps } from "./getAllPosts";

interface LikePostRequestProps{
    post_id: number
}

export async function likePost(post_id: number): Promise<ResponseProps<PostProps>>{
    return (await axios.post(`/api/post/like`, {
        post_id: post_id,
    })).data
}
import { ResponseProps } from "@/lib/api";
import axios from "axios";
import { PostProps } from "./getAllPosts";

export async function unlikePost(post_id: number): Promise<ResponseProps<PostProps>>{
    return (await axios.delete(`/api/post/like/${post_id}`, )).data
}
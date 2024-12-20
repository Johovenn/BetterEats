import { ResponseProps } from "@/lib/api";
import axios from "axios";
import { PostProps } from "./getAllPosts";

export async function getPostById(post_id: number): Promise<ResponseProps<PostProps>>{
    return (await axios.get(`/api/post/${post_id}`)).data
}
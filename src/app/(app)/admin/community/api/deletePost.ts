import { PostProps } from "@/app/(app)/community/api/getAllPosts"
import { ResponseProps } from "@/lib/api"
import axios from "axios"

export async function deletePost(post_id: number): Promise<ResponseProps<PostProps>>{
    return (await axios.delete(`/api/post/${post_id}`)).data
}
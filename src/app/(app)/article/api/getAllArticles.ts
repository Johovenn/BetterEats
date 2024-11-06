import { ResponseProps } from "@/lib/api"
import axios from "axios"

export interface ArticleProps{
    article_id: number
    article_image: string
    article_title: string
    article_description: string
    article_body: string
    article_creation_date: Date
}

interface GetAllArticleRequest{
    page: number
    limit: number
    article_title: string
}

export async function getAllArticles(request: GetAllArticleRequest): Promise<ResponseProps<ArticleProps[]>>{
    let url = `/api/article?page=${request.page}&limit=${request.limit}`
    if(request.limit) url += `&limit=${request.limit}`
    return (await axios.get(url)).data
}
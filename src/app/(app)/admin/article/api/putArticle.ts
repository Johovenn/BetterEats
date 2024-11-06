import { ArticleProps } from "@/app/(app)/article/api/getAllArticles";
import { ResponseProps } from "@/lib/api";
import axios from "axios";

interface PutArticleRequestProps{
    article_id: number
    article_image: string | null
    article_title: string
    article_description: string
    article_body: string
}

export async function putArticle(request: PutArticleRequestProps): Promise<ResponseProps<ArticleProps>>{
    return (await axios.put(`/api/article/${request.article_id}`, request)).data
}
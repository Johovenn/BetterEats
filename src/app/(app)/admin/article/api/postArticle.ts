import { ArticleProps } from "@/app/(app)/article/api/getAllArticles";
import { ResponseProps } from "@/lib/api";
import axios from "axios";

interface PostArticleRequestProps{
    article_image: string
    article_title: string
    article_description: string
    article_body: string
}

export async function postArticle(request: PostArticleRequestProps): Promise<ResponseProps<ArticleProps>>{
    return (await axios.post(`/api/article`, request)).data
}
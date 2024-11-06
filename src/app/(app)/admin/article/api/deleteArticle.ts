import { ArticleProps } from "@/app/(app)/article/api/getAllArticles";
import { ResponseProps } from "@/lib/api";
import axios from "axios";

export async function deleteArticle(article_id: number): Promise<ResponseProps<ArticleProps>>{
    return (await axios.delete(`/api/article/${article_id}`)).data
}
import { ResponseProps } from "@/lib/api";
import axios from "axios";
import { ArticleProps } from "./getAllArticles";

export async function getArticleById(article_id: number): Promise<ResponseProps<ArticleProps>>{
    return (await axios.get(`/api/article/${article_id}`)).data
}
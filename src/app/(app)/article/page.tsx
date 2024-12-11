"use client"

import Loading from "@/components/Loading"
import PageHeader from "@/components/PageHeader"
import { useEffect, useState } from "react"
import { ArticleProps, getAllArticles }  from "./api/getAllArticles"
import ArticleCard from "@/components/article/ArticleCard";

export default function ArticlePage(){
    const [isLoading, setIsLoading] = useState(false)
    const [articles, setArticles] = useState<ArticleProps[]>([])

    useEffect(() => {
        const getArticles = async () => {
            setIsLoading(true)
    
            await getAllArticles({
                page: 0,
                limit: 10,
                article_title: ''
            }).then((response) => {
                if(response.data){
                    setArticles(response.data)
                }
            })
    
            setIsLoading(false)
        }

        getArticles()
    }, [])

    return(
        <>
            <Loading loading={isLoading}></Loading>

            <PageHeader 
                title="Articles"
                subtitle={`Learn more about your body and health`}
            />

            <main>
                {
                    articles.length > 0
                        ?
                        <div className="space-y-3">
                            {
                                articles.map((article) => (
                                    <ArticleCard 
                                        key={article.article_id}
                                        article={article}
                                        mode="search"
                                    />
                                ))
                            }
                        </div>
                        :
                    <h3>Article not found.</h3>
                }
            </main>
        </>
    )

            
            
            
}
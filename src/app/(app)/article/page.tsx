"use client"

import Loading from "@/components/Loading"
import PageHeader from "@/components/PageHeader"
import { useEffect, useState } from "react"
import { ArticleProps, getAllArticles }  from "./api/getAllArticles"
import ArticleCard from "@/components/article/ArticleCard"
import { useSearchParams } from "next/navigation"
import { CldImage } from "next-cloudinary"

export default function ArticlePage(){
    const [isLoading, setIsLoading] = useState(false)
    const [articleTitle, setArticleTitle] = useState('')
    const [articles, setArticles] = useState<ArticleProps[]>([])
    const searchParams = useSearchParams()
    const keyword = searchParams.get('keyword')

    useEffect(() => {
        const getArticles = async () => {
            setIsLoading(true)
    
            await getAllArticles({
                page: 0,
                limit: 10,
                article_title: articleTitle
            }).then((response) => {
                if(response.data){
                    setArticles(response.data)
                }
                else{
                    setArticles([])
                }
            })
    
            setIsLoading(false)
        }

        if(keyword){
            setArticleTitle(keyword)
        }
        else{
            setArticleTitle('')
        }

        getArticles()
    }, [articleTitle, keyword])

    return(
        <>
            <Loading loading={isLoading}></Loading>

            <PageHeader 
                title="Articles"
                subtitle={`Learn more about your body and health`}
                searchMode="article"
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
                        <div className="mt-6 w-full flex flex-col items-center justify-center">
                            <CldImage
                                src="file_hvg7of"
                                alt="Not Found Image"
                                width={250}
                                height={250}
                            />
                            <p className="mt-3 text-lg font-semibold text-green-primary">Article not found.</p>
                        </div>
                }
            </main>
        </>
    )

            
            
            
}
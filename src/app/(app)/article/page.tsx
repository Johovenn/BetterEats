"use client"

import Loading from "@/components/Loading"
import PageHeader from "@/components/PageHeader"
import { useEffect, useState } from "react"
import { getAllArticles } from "./api/getAllArticles"

export default function ArticlePage(){
    const [isLoading, setIsLoading] = useState(false)
    const [articles, setArticles] = useState<any>([])

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
            />
        </>
    )
}
"use client"

import Loading from "@/components/Loading"
import PageHeader from "@/components/PageHeader"
import { useEffect, useState } from "react"
import { ArticleProps } from "../article/api/getAllArticles"

export default function CommunityPage(){
    const [isLoading, setIsLoading] = useState(false)
    const [articles, setArticles] = useState<ArticleProps[]>([])

    useEffect(() => {
        const getArticles = async () => {
            // setIsLoading(true)
    
            // await getAllArticles({
            //     page: 0,
            //     limit: 10,
            //     article_title: ''
            // }).then((response) => {
            //     if(response.data){
            //         setArticles(response.data)
            //     }
            // })
    
            // setIsLoading(false)
        }

        getArticles()
    }, [])

    return(
        <>
            <Loading loading={isLoading}></Loading>

            <PageHeader 
                title="Community Page"
                subtitle={`Share your experience and see what others are up to.`}
                hideSearchBar
            />

            <main>

            </main>
        </>
    )
}
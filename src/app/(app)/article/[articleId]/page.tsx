"use client"

import Loading from "@/components/Loading";
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { ArticleProps }  from "../api/getAllArticles"
import { getArticleById } from "../api/getArticleById.api";
import { CldImage } from "next-cloudinary";
import React from 'react';

export default function MealPlannerPage(){
    const [isLoading, setIsLoading] = useState(false)
    const [article, setArticle] = useState<ArticleProps>()
    const { articleId } = useParams()
    const [formattedDate, setformattedDate] = useState<string>()
    const [formattedBody, setformattedBody] = useState<string>()

    useEffect(() => {
        const getArticle = async () => {
            setIsLoading(true)
    
            await getArticleById(Number(articleId)).then((response) => {
                if(response.data){
                    setArticle(response.data) 
                    setformattedDate(new Date(response.data.article_creation_date).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                    }))
                    const test = "test \n\nsatu \n dua tiga"
                    const temp = response.data.article_body.replace('/\n/g', '<br />')
                    setformattedBody(temp)
                    
                    console.log("test")
                    console.log(temp)
                    // console.log(typeof temp)
                    // console.log(temp)
                    // console.log(typeof response.data.article_body)
                    // console.log(String(test).replace(/\n/g, '<br />'))
                    console.log(String(response.data.article_body).replace(/\n/g, '<br />'))
                    console.log('ini')
                }
            })
    
            setIsLoading(false)
        }

        if(!isNaN(Number(articleId))){
            getArticle()
        }
    }, [])

   

    return (
        <>
            <Loading loading={isLoading} />
            <div>

            {
                article
                    ?
                    <main className="flex flex-col items-center px-20 py-10 w-full">
                        <div className="w-2/3">
                            <header className="flex justify-between items-start w-full mb-5">
                                <div>
                                    <h1 className="text-3xl font-bold">{article.article_title}</h1>
                                </div>
                            </header>
                            <section className="flex justify-center w-full">
                                <div className="flex flex-col w-full">
                                    <h2 className="text-xl ">{article.article_description}</h2>
                                    <div className="flex flex-col">
                                            <div className="flex justify-between w-full">
                                                <div className="flex flex-col">
                                                    <div className="flex items-center">
                                                        
                                                        <div className="w-full h-[70px] border border-x-0 border-y flex items-center px-3 rounded-sm my-5">
                                                            <div className="flex justify-center items-center relative w-9 max-w-9 h-full max-h-9 bg-white overflow-hidden rounded-full">
                                                                <img src="/BetterEats.png" alt="Gambar" className=""/>
                                                            </div>
                                                            <div className="ml-3 flex items-center justify-between w-full truncate">
                                                                <div className="flex flex-col space-y-1">
                                                                    <div className="flex items-center">
                                                                        <p className="text-sm font-medium">Better Eats</p>
                                                                    </div>
                                                                    <div className="flex items-center">
                                                                        <p className="text-sm text-gray-600 w-full">
                                                                        {`${formattedDate}`}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                    </div>

                                                    <div className="flex justify-center items-center relative">
                                                        <CldImage
                                                            src={article.article_image}
                                                            alt="Not Found Image"
                                                            width={250}
                                                            height={250}
                                                        />
                                                    </div>

                                                    <div className="flex flex-col gap-y-2 items-center my-5">
                                                        <p className="text-sm text-gray-600 w-full whitespace-pre-wrap hyphens-manual indent-5">
                                                            <div dangerouslySetInnerHTML={{ __html: formattedBody }} />
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                    </div>


                                </div>
                            </section>

                        </div>
                    </main>
                    :
                <h3>Article not found.</h3>
            }
            </div>
        </>
    )
}
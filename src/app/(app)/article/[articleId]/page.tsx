"use client"

import Loading from "@/components/Loading";
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { ArticleProps }  from "../api/getAllArticles"
import { getArticleById } from "../api/getArticleById.api";
import { CldImage } from "next-cloudinary";

export default function MealPlannerPage(){
    const [isLoading, setIsLoading] = useState(false)
    const [article, setArticle] = useState<ArticleProps>()
    const { articleId } = useParams()

    useEffect(() => {
        const getArticle = async () => {
            setIsLoading(true)
    
            await getArticleById(Number(articleId)).then((response) => {
                if(response.data){
                    setArticle(response.data)
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
                        <header className="flex justify-between items-start w-1/2 mb-5">
                            <div>
                                <h1 className="text-3xl font-bold">{article.article_title}</h1>
                            </div>
                        </header>
                        <section className="w-1/2 flex justify-center">
                            <div className="flex flex-col w-full">
                                <h2 className="text-xl ">{article.article_description}</h2>
                                <div className="flex flex-col">
                                        <div className="flex justify-between w-full">
                                            <div className="flex flex-col space-y-3">
                                                <div className="flex items-center">
                                                    
                                                    <div className="w-full h-[70px] border border-x-0 border-y flex items-center px-3 rounded-sm">
                                                        <div className="flex justify-center items-center relative w-9 max-w-9 h-full max-h-9 bg-black overflow-hidden rounded-full">
                                                            <img src="/BetterEats.png" alt="Gambar" className=""/>
                                                        </div>
                                                        <div className="ml-3 flex items-center justify-between w-full truncate">
                                                            <div className="flex flex-col space-y-1">
                                                                <div className="flex items-center">
                                                                    <p className="text-sm font-medium">Paul G. Oliver</p>
                                                                </div>
                                                                <div className="flex items-center">
                                                                    <p className="text-sm text-gray-600 w-full">
                                                                    2 Oktober 2024
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

                                                <div className="flex flex-col gap-y-2 items-center">
                                                    <p className="text-sm text-gray-600 w-full whitespace-pre-wrap hyphens-manual indent-5">
                                                        {article.article_body}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                </div>


                            </div>
                        </section>
                    </main>
                    :
                <h3>Article not found.</h3>
            }
            </div>
        </>
    )
}
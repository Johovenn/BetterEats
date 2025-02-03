"use client"

import Loading from "@/components/Loading"
import { CldImage } from "next-cloudinary"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { ArticleProps } from "../api/getAllArticles"
import { getArticleById } from "../api/getArticleById.api"
import { Skeleton } from "@/components/ui/skeleton"
import Image from "next/image"
import { formatDate } from "@/lib/dateUtils"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function ArticleDetailPage() {
    const router = useRouter()
    const { articleId } = useParams()
    const [isLoading, setIsLoading] = useState(false)
    const [article, setArticle] = useState<ArticleProps>()

    useEffect(() => {
        const getArticle = async () => {
            setIsLoading(true)

            await getArticleById(Number(articleId))
                .then((response) => {
                    if (response.data) {
                        setArticle(response.data)
                    }
                })
                .catch((error) => {
                    router.push('/article')
                    toast('Error loading article data, please try again.')
                })

            setIsLoading(false)
        }

        if (!isNaN(Number(articleId))) {
            getArticle()
        }
    }, [articleId, router])

    const handleBackButton = () => {
        window.history.back()
    }

    return (
        <>
            <Loading loading={isLoading} />
            <section className="flex flex-col py-3 sm:py-5 px-4 sm:px-[5%] w-full max-w-screen-xl mx-auto">
                <header className="w-full mb-3 sm:mb-5 flex flex-col justify-center">
                    <div className="flex justify-between items-center max-sm: mt-7">
                        <Button 
                            variant={'link'} 
                            className="self-start space-x-2 px-0 sm:px-2"
                            onClick={handleBackButton}
                        >
                            <ArrowLeft size={16} color="black" /> 
                            <span>Back</span>
                        </Button>
                        <h6 className="text-xs text-gray-600">
                            {article && formatDate(new Date(article.article_creation_date))}
                        </h6>
                    </div>
                    <div className="flex flex-col justify-center items-center mt-4">
                        {article ? (
                            <h1 className="text-xl sm:text-2xl md:text-3xl text-green-primary font-bold text-center px-2">
                                {article.article_title}
                            </h1>
                        ) : (
                            <Skeleton className="w-full max-w-2xl" />
                        )}
                        {article ? (
                            <h3 className="indent-4 sm:indent-8 text-justify text-sm w-full sm:w-[90%] md:w-[600px] mt-3 sm:mt-5 px-2">
                                {article.article_description}
                            </h3>
                        ) : (
                            <Skeleton className="w-full max-w-2xl" />
                        )}
                    </div>
                </header>
                <div className="w-full flex flex-col justify-center items-center">
                    <div className="flex justify-center items-center relative w-full h-[150px] sm:h-[200px] my-2 sm:my-4">
                        {article ? (
                            <CldImage
                                src={article.article_image}
                                alt="Article Image"
                                className="max-w-full h-auto max-h-full object-contain"
                                width={400}
                                height={200}
                            />
                        ) : (
                            <Skeleton className="w-[200px] sm:w-[250px] h-[150px] sm:h-[250px]" />
                        )}
                    </div>
                    <div className="flex flex-col gap-y-2 items-center my-3 sm:my-5 w-full sm:w-[90%] md:w-[600px] px-2">
                        {article && 
                            article.article_body
                                .replace(/\\n/g, '\n')
                                .split('\n\n')
                                .map((paragraph, index) => (
                                    <p 
                                        key={index} 
                                        className="text-sm w-full whitespace-pre-wrap hyphens-manual indent-4 sm:indent-8 text-justify"
                                    >
                                        {paragraph}
                                    </p>
                                ))
                        }
                    </div>
                </div>
            </section>
        </>
    )
}
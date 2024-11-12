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
import { Button } from "@/components/ui/button";
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
            <section className="flex flex-col py-5 px-[5%] w-full">
                <Button 
                    variant={'link'} 
                    className="self-start space-x-2"
                    onClick={handleBackButton}
                >
                    <ArrowLeft size={16} color="black" className=""></ArrowLeft> <span>Back</span>
                </Button>
                <header className="w-full mb-5 flex items-start justify-between">
                    <div>
                        {
                            article
                                ?
                            <h1 className="text-3xl text-green-primary font-bold">
                                {article.article_title}
                            </h1>
                                :
                            <Skeleton 
                                className="w-full"
                            />
                        }
                        {
                            article
                                ?
                            <h3 className="text-xl text-green-primary">
                                {article.article_description}
                            </h3>
                                :
                            <Skeleton 
                                className="w-full"
                            />
                        }
                    </div>
                    <div className="flex items-center justify-end bg-white rounded-lg shadow px-3 py-2 gap-3">
                        <div className="text-right">
                            <h5 className="text-sm text-green-primary">
                                BetterEats Admin
                            </h5>
                            <h6 className="text-xs text-gray-600">
                                {
                                    article
                                        &&
                                    formatDate(new Date(article.article_creation_date))
                                }
                            </h6>
                        </div>
                        <div className="">
                            <Image 
                                src={'/BetterEats.png'}
                                width={35}
                                height={35}
                                alt="Logo"
                            />
                        </div>
                    </div>
                </header>
                <div className="">
                    <div className="flex justify-center items-center relative w-full h-[200px]">
                        {
                            article
                                ?
                            <CldImage
                                src={
                                    article.article_image
                                }
                                alt="Not Found Image"
                                className="max-w-full h-auto max-h-full"
                                width={400}
                                height={200}
                            />
                                :
                            <Skeleton 
                                className="w-[250px] h-[250px]"
                            />
                        }
                    </div>
                    <div className="flex flex-col gap-y-2 items-center my-5">
                        {
                            article
                                && 
                            article.article_body
                                .replace(/\\n/g, '\n')
                                .split('\n\n')
                                .map((paragraph, index) => (
                                    <p key={index} className="text-sm w-full whitespace-pre-wrap hyphens-manual indent-8 text-justify">
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

"use client"

import Loading from "@/components/Loading";
import PageHeader from "@/components/PageHeader";
import { useCallback, useEffect, useState } from "react";
import { ArticleProps, getAllArticles } from "../../article/api/getAllArticles";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import ArticleCard from "@/components/article/ArticleCard";
import { CldImage } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import { Plus, Router } from "lucide-react";

interface FormProps{
    page: number
    limit: number
    total_rows: number
    article_title: string
}

export default function AdminArticlePage(){
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [searchResults, setSearchResults] = useState<ArticleProps[]>([])
    const searchParams = useSearchParams()
    const keyword = searchParams.get('keyword')

    const form = useForm<FormProps>({
        mode: 'onBlur',
        defaultValues: {
            page: 0,
            limit: 10,
            total_rows: 0,
            article_title: '',
        }
    })

    const getArticles = useCallback(async () => {
        setIsLoading(true)

        await getAllArticles({
            page: form.getValues('page'),
            limit: form.getValues('limit'),
            article_title: form.getValues('article_title')
        }).then((response) => {
            if(response.data){
                setSearchResults(response.data)
                form.setValue('total_rows', Number(response.total_rows))
            }
        }).catch((error) => {
            setSearchResults([])
            form.setValue('total_rows', 0)
        }).finally(() => {
            setIsLoading(false)
        })
    }, [form])
    
    useEffect(() => {
        getArticles()
    }, [getArticles])

    const handleLoadMoreButton = async () => {
        setIsLoading(true)

        form.setValue('page', 0)
        await getAllArticles({
            page: form.getValues('page'),
            limit: form.getValues('limit'),
            article_title: form.getValues('article_title')
        }).then((response) => {
            if(response.data){
                setSearchResults(prev => [...prev, ...response.data])
                form.setValue('total_rows', Number(response.total_rows))
            }
        }).catch((error) => {
            setSearchResults([])
            form.setValue('total_rows', 0)
        }).finally(() => {
            setIsLoading(false)
        })

        setIsLoading(false)
    }

    return(
        <>
            <Loading loading={isLoading}/>

            <PageHeader title="Manage articles" searchMode="article"/>

            <section className="mt-5 min-w-full">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-medium text-green-primary">
                        {form.watch('article_title') === '' ? 'Showing all existing articles' : `Showing search results for keyword \'${form.watch('article_title')}\'`}
                    </h2>
                    <Button 
                        className="flex items-center gap-1"
                        onClick={() => router.push('/admin/article/new')}
                    >
                        <Plus size={18}/>
                        Add Article
                    </Button>
                </div>
                <div className="mt-4">
                    <div className="w-full space-y-3">
                        {
                            searchResults.length > 0
                                ?
                            searchResults.map((article) => (
                                <ArticleCard 
                                    key={article.article_id}
                                    article={article}
                                    mode="admin"
                                />
                            ))
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
                    </div>
                    {
                        (form.watch('page') + 1) * form.watch('limit') < form.watch('total_rows')
                            &&
                        <div className="w-full mt-3">
                            <Button
                                variant={'outline'} 
                                className="w-full hover:bg-slate-100"
                                onClick={handleLoadMoreButton}
                            >
                                Load More
                            </Button>
                        </div>
                    }
                </div>
            </section>
        </>
    )
}
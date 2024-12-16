"use client"

import Loading from "@/components/Loading"
import PageHeader from "@/components/PageHeader"
import { useEffect, useState } from "react"
import { ArticleProps } from "../article/api/getAllArticles"
import Post from "@/components/community/Post"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"
import { getAllPosts, PostProps } from "./api/getAllPosts"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

interface FormProps{
    page: number
    limit: number
    total_rows: number
}

export default function CommunityPage(){
    const [isLoading, setIsLoading] = useState(false)
    const [posts, setPosts] = useState<PostProps[]>([])

    const form = useForm<FormProps>({
        mode: 'onChange',
        defaultValues: {
            page: 0,
            limit: 10,
            total_rows: 0,
        }
    })

    useEffect(() => {
        const getData = async () => {
            setIsLoading(true)

            await getAllPosts(form.getValues()).then((response) => {
                if(response.data){
                    form.setValue('total_rows', Number(response.total_rows))
                    setPosts(response.data) 
                }
                else{
                    form.setValue
                }
            }).catch((error) => {
                toast(error.response.data.message)
            })

            setIsLoading(false)
        }

        getData()
    }, [form])

    return(
        <>
            <Loading loading={isLoading}></Loading>

            <PageHeader 
                title="Community Page"
                subtitle={`Share your experience and see what others are up to.`}
                hideSearchBar
            />

            <main className="w-full flex flex-col items-center ">
                {
                    posts.length > 0 
                        &&
                    posts.map((post) => (
                        <Post key={post.post_id} post={post}/>
                    ))
                }

                <Button className="fixed bottom-0 right-0 gap-2 mb-8 mr-8">
                    <PlusIcon size={16}/> 
                    Create Post
                </Button>
            </main>
        </>
    )
}
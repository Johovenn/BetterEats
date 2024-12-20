"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { getPostById } from "../api/getPostById"
import { toast } from "sonner"
import Loading from "@/components/Loading"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/dateUtils"
import Post from "@/components/community/Post"
import { likePost } from "../api/likePost"
import { unlikePost } from "../api/unlikePost"
import { PostProps } from "../api/getAllPosts"

export default function PostDetailPage() {
    const router = useRouter()
    const { PostId } = useParams()
    const [isLoading, setIsLoading] = useState(false)
    const [post, setPost] = useState<PostProps>()

    useEffect(() => {
        const getArticle = async () => {
            setIsLoading(true)

            await getPostById(Number(PostId))
                .then((response) => {
                    if (response.data) {
                        setPost(response.data)
                    }
                })
                .catch((error) => {
                    router.push('/article')
                    toast('Error loading article data, please try again.')
                })

            setIsLoading(false)
        }

        if (!isNaN(Number(PostId))) {
            getArticle()
        }
    }, [PostId, router])
    
    const handleLikePost = async (post_id: number) => {
        likePost(post_id).catch((error) => {})
        
        setPost((prevPost) =>
            prevPost ? { ...prevPost, is_liked: true, like_count: prevPost.like_count + 1 } : prevPost
        );
    }

    const handleUnlikePost = async (post_id: number) => {
        unlikePost(post_id).catch((error) => {})

        setPost((prevPost) =>
            prevPost ? { ...prevPost, is_liked: false, like_count: prevPost.like_count - 1 } : prevPost
        );
    }

    const handleAddReply = async (post_id: number) => {
        setPost((prevPost) => prevPost ? {...prevPost, reply_count: prevPost.reply_count + 1} : prevPost)
    }

    const handleBackButton = () => {
        router.push(`/community`)
    }

    return (
        <>
            <Loading loading={isLoading} />

            <section className="flex flex-col py-5 px-[5%] w-full items-center">
                <div className="flex justify-between items-center w-full">
                    <Button
                        variant={'link'} 
                        className="self-start space-x-2"
                        onClick={handleBackButton}
                    >
                        <ArrowLeft size={16} color="black" className="" /><span>See other posts</span>
                    </Button>
                    <h6 className="text-xs text-gray-600">
                        {
                            post
                                &&
                            formatDate(new Date(post.post_date))
                        }
                    </h6>
                </div>
                <div className="mt-5">
                {
                    post
                        &&
                    <Post
                        post={post}
                        handleLike={handleLikePost}
                        handleUnlike={handleUnlikePost}
                        handleAddReply={handleAddReply}
                        showReplies
                    />
                }
                </div>
            </section>
        </>
    )
}
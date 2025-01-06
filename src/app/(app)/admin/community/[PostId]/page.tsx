"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import Loading from "@/components/Loading"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/dateUtils"
import Post from "@/components/community/Post"
import { PostProps } from "@/app/(app)/community/api/getAllPosts"
import { getPostById } from "@/app/(app)/community/api/getPostById"
import { likePost } from "@/app/(app)/community/api/likePost"
import { unlikePost } from "@/app/(app)/community/api/unlikePost"
import AlertModal from "@/components/AlertModal"
import { deletePost } from "../api/deletePost"

export default function PostDetailPage() {
    const router = useRouter()
    const { PostId } = useParams()
    const [isLoading, setIsLoading] = useState(false)
    const [post, setPost] = useState<PostProps>()
    const [alertModal, setAlertModal] = useState(false)
    const [selectedPostId, setSelectedPostId] = useState<any>(null) 

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
                    router.push('/community')
                    toast('Post not found.')
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

    const handleDeletePost = async (post_id: number) => {
        setSelectedPostId(post_id)
        setAlertModal(true)
    }
    
    const confirmDeletePost = async () => {
        setIsLoading(true)

        await deletePost(selectedPostId).then((response) => {
            toast('Delete post successful!')
        }).catch((error) => {
            toast('Delete post Failed')
        }).finally(() => {
            setIsLoading(false)
        })

        router.push(`/admin/community`)

        setIsLoading(false)
    }
    
    const handleBackButton = () => {
        router.push(`/admin/community`)
    }

    return (
        <>
            <Loading loading={isLoading} />
            
            <AlertModal
                isOpen={alertModal}
                setIsOpen={setAlertModal}
                handleClose={() => setAlertModal(false)}
                title="Delete Post"
                description="Are you sure you want to delete this post? You should only delete a post if this post doesn't follow the community guidelines."
                onConfirm={confirmDeletePost}
            />

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
                        handleLike={(post_id: number) => {}}
                        handleUnlike={(post_id: number) => {}}
                        handleAddReply={(post_id: number) => {}}
                        handleDeletePost={handleDeletePost}
                        showReplies
                    />
                }
                </div>
            </section>
        </>
    )
}
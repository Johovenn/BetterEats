"use client"

import Loading from "@/components/Loading"
import PageHeader from "@/components/PageHeader"
import { useCallback, useEffect, useState } from "react"
import Post from "@/components/community/Post"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import PostModal from "@/components/community/PostModal"
import { useAuth } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { getAllPosts, PostProps } from "../../community/api/getAllPosts"
import { likePost } from "../../community/api/likePost"
import { unlikePost } from "../../community/api/unlikePost"

interface FormProps{
    page: number
    limit: number
    total_rows: number
}

export default function CommunityPage(){
    const user = useAuth()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [posts, setPosts] = useState<PostProps[]>([])
    const [postModal, setPostModal] = useState(false)

    const form = useForm<FormProps>({
        mode: 'onBlur',
        defaultValues: {
            page: 0,
            limit: 10,
            total_rows: 0,
        }
    })

    const refreshPosts = useCallback(async () => {
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
    }, [form])

    const loadMorePosts = useCallback(async () => {
        setIsLoading(true)

        await getAllPosts(form.getValues()).then((response) => {
            if(response.data){
                setPosts(prev => [...prev, ...response.data])
                form.setValue("total_rows", (Number(response.total_rows)))
            }
            else{
                setPosts([])
                form.setValue("total_rows", 0)
            }
        }).catch((error) => {
            toast(error.response.data.message)
        })

        setIsLoading(false)

    }, [form])

    const handleLoadMoreButton = () => {
        form.setValue('page', form.getValues('page') + 1)
        loadMorePosts()
    }

    const handleLikePost = async (post_id: number) => {
        likePost(post_id).catch((error) => {})
        
        setPosts((prevResults) =>
            prevResults.map((post) =>
                post.post_id === post_id ? { ...post, is_liked: true, like_count: post.like_count + 1 } : post
            )
        )
    }

    const handleUnlikePost = async (post_id: number) => {
        unlikePost(post_id).catch((error) => {})
        
        setPosts((prevResults) =>
            prevResults.map((post) =>
                post.post_id === post_id ? { ...post, is_liked: false, like_count: post.like_count - 1 } : post
            )
        )
    }

    const handleAddReply = async (post_id: number) => {
        setPosts((prevResults) =>
            prevResults.map((post) =>
                post.post_id === post_id ? { ...post, reply_count: post.reply_count + 1 } : post
            )
        )
    }

    useEffect(() => {
        refreshPosts()
    }, [refreshPosts])

    return(
        <>
            <Loading loading={isLoading}></Loading>

            <PostModal
                isOpen={postModal}
                handleClose={() => setPostModal(false)}
                setIsOpen={setPostModal}
                refreshPosts={refreshPosts}
            />

            <PageHeader 
                title="Community Page"
                subtitle={`Share your experience and see what others are up to.`}
                hideSearchBar
            />

            <main className="w-full flex flex-col items-center">
                {/* <div className=""> */}
                    {
                        posts.length > 0 
                            &&
                        posts.map((post) => (
                            <Post
                                key={post.post_id} 
                                post={post}
                                handleLike={handleLikePost}
                                handleUnlike={handleUnlikePost}
                                handleAddReply={handleAddReply}
                            />
                        ))
                    }
                {/* </div> */}
                {
                    ((form.watch('page') + 1) * form.watch('limit') < form.watch('total_rows') && form.getValues('total_rows') !== 0)
                        &&
                    <div className="w-full mt-3">
                        <Button 
                            variant={'outline'} 
                            className="w-full hover:bg-green-primary/10"
                            onClick={handleLoadMoreButton}
                        >
                            Load More
                        </Button>
                    </div>
                }

                <Button 
                    className="fixed bottom-0 right-0 gap-2 mb-8 mr-8"
                    onClick={() => {user.isSignedIn ? setPostModal(true) : router.push(`/sign-up`)}}
                >
                    <PlusIcon size={16}/>
                    Create Post
                </Button>
            </main>
        </>
    )
}
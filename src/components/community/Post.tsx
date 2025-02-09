import { PostProps } from "@/app/(app)/community/api/getAllPosts"
import { Skeleton } from "../ui/skeleton"
import QuotedMealPlan from "./QuotedMealPlan"
import { useEffect, useState } from "react"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { Heart, MessageCircle, Share, Trash2 } from "lucide-react"
import { useUser } from "@clerk/nextjs"
import TextInput from "../form/TextInput"
import { FormProvider, useForm } from "react-hook-form"
import * as yup from 'yup'
import { yupResolver } from "@hookform/resolvers/yup"
import { Button } from "../ui/button"
import { createPost } from "@/app/(app)/community/api/createPost"
import { likePost } from "@/app/(app)/community/api/likePost"
import { unlikePost } from "@/app/(app)/community/api/unlikePost"
import { toast } from "sonner"

interface PostProperties{
    post: PostProps
    handleLike: (post_id: number) => void
    handleUnlike: (post_id: number) => void
    handleAddReply: (post_id: number) => void
    handleDeletePost?: (post_id: number) => void 
    showReplies?: boolean
}

interface FormProps{
    post_body: string
    reply_to_id: number
}

const validationSchema = yup.object().shape({
    post_body: yup.string().required('Body is required!'),
    reply_to_id: yup.number().nullable().required()
})

export default function Post(props: PostProperties){
    const router = useRouter()
    const pathname = usePathname()
    const [replies, setReplies] = useState<PostProps[]>([])
    const {user} = useUser()

    const form = useForm<FormProps>({
        mode: 'onChange',
        defaultValues: {
            post_body: '',
            reply_to_id: undefined,
        },
        resolver: yupResolver(validationSchema)
    })

    useEffect(() => {
        if(props.post.replies){
            setReplies(props.post.replies)
        }
    }, [props.post.replies])

    const handleReplyButton = async () => {
        if(!form.getValues('post_body')){
            return
        }

        await createPost(form.getValues()).then((response) => {
            if(response.data){
                setReplies((prev) => [...prev, response.data])
            }
        }).catch((error) => {})

        form.reset()
        props.handleAddReply
    }

    const handleLikeReply = async (post_id: number) => {
        likePost(post_id).catch((error) => {})
        
        setReplies((prevResults) =>
            prevResults.map((post) =>
                post.post_id === post_id ? { ...post, is_liked: true, like_count: post.like_count + 1 } : post
            )
        )
    }

    const handleUnlikeReply = async (post_id: number) => {
        unlikePost(post_id).catch((error) => {})
        
        setReplies((prevResults) =>
            prevResults.map((post) =>
                post.post_id === post_id ? { ...post, is_liked: false, like_count: post.like_count - 1 } : post
            )
        )
    }

    return(
        <div className="w-full max-w-md mx-auto">
            <div className="border border-b-1 border-gray-300 hover:bg-gray-100 hover:cursor-pointer transition-all">
                <div 
                    className="flex gap-3 w-full p-3"
                    onClick={() => {
                        pathname === `/community/${props.post.post_id}` ? {} : (user?.publicMetadata.role === 'admin' ? router.push(`/admin/community/${props.post.post_id}`) : router.push(`/community/${props.post.post_id}`))
                    }}
                >
                    <div className="flex-shrink-0">
                        {
                            props.post.user_profile_picture
                                ?
                            <Image 
                                alt="Profile Picture"
                                src={props.post.user_profile_picture}
                                className="rounded-full object-cover"
                                width={50}
                                height={50}
                            />
                                :    
                            <Skeleton className="w-10 h-10 rounded-full border border-black"/>
                        }
                    </div>
                    <div className="w-full min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold truncate max-w-full">
                                {props.post.user_name}
                            </span>
                            <span className="text-gray-500 text-sm truncate max-w-full">
                                @{props.post.username}
                            </span>
                        </div>
                        <p className="mb-2 break-words">
                            {props.post.post_body}
                        </p>
                        {
                            props.post.meal_plan_data?.meal_plan_id
                                &&
                            <QuotedMealPlan 
                                mealPlanDetail={props.post.meal_plan_data.meal_plan_details}
                                mealPlanDate={props.post.meal_plan_data.meal_plan_date.toString()}
                                totalCalories={props.post.meal_plan_data.meal_plan_total_calorie}
                                totalProtein={props.post.meal_plan_data.meal_plan_total_protein}
                                totalCarbs={props.post.meal_plan_data.meal_plan_total_carbohydrate}
                                totalFat={props.post.meal_plan_data.meal_plan_total_fat}
                            />
                        }
                    </div>
                </div>
                <div className="w-full px-3 py-1 mb-1 flex items-center justify-around">
                    <div className="flex gap-1 items-center text-xs hover:bg-gray-200 rounded-full p-2 transition-all cursor-pointer">
                        <MessageCircle size={16} color="gray"/>
                        <span className="hidden sm:inline">{props.post.reply_count}</span>
                    </div>
                    <div className="flex gap-1 items-center text-xs hover:bg-gray-200 rounded-full p-2 transition-all cursor-pointer">
                        <Heart 
                            size={16} 
                            color={props.post.is_liked ? "transparent" : "gray"}
                            fill={props.post.is_liked ? "#cf1f39" : "transparent"}
                            onClick={() => {
                                props.post.is_liked ? props.handleUnlike(props.post.post_id) : props.handleLike(props.post.post_id)
                            }}
                        />
                        <span className="hidden sm:inline">{props.post.like_count}</span>
                    </div>
                    <div className="flex gap-1 items-center text-xs hover:bg-gray-200 rounded-full p-2 transition-all cursor-pointer">
                        <Share 
                            size={16}
                            color={"gray"}
                            onClick={() => {
                                navigator.clipboard.writeText(`${window.location.origin}/community/${props.post.post_id}`).then(() => {
                                    toast('Link copied to clipboard')
                                })
                            }} 
                        />
                    </div>
                    {
                        user?.publicMetadata.role === 'admin'
                            &&
                        (
                            <div className="flex gap-1 items-center text-xs hover:bg-red-200 rounded-full p-2 transition-all cursor-pointer">
                                <Trash2
                                    size={16}
                                    color={"gray"}
                                    onClick={() => props.handleDeletePost ?  props.handleDeletePost(props.post.post_id) : () => {}} 
                                />
                            </div>
                        )
                    }
                </div>
            </div>
            {
                props.showReplies
                    &&
                <div className="w-full">
                    {
                        user?.id
                            &&
                        <div className="border-x border-b border-gray-300 p-3 flex items-center space-x-3">
                            <Image 
                                src={user ? user.imageUrl : ""}
                                alt="User Profile Picture"
                                width={40}
                                height={40}
                                className="rounded-full object-cover flex-shrink-0"
                            />
                            <div className="w-full flex items-center space-x-2">
                                <FormProvider {...form}>
                                    <TextInput 
                                        control={form.control}
                                        id="post_body"
                                        label=""
                                        placeholder="Reply to the above post"
                                        className="flex-grow border-none outline-none focus:border-none focus:outline-none" 
                                        hideError
                                    />
                                    <Button className="ml-auto" onClick={() => {
                                        form.setValue('reply_to_id', props.post.post_id)
                                        handleReplyButton()
                                    }}>Reply</Button>
                                </FormProvider>
                            </div>
                        </div>
                    }
                    <div>
                        {
                            replies
                                &&
                            replies.map((reply) => (
                                <Post 
                                    post={reply}
                                    handleLike={handleLikeReply}
                                    handleUnlike={handleUnlikeReply}
                                    handleAddReply={() => {}}
                                    key={reply.post_id}
                                />
                            ))
                        }
                    </div>
                </div>
            }
        </div>
    )
}
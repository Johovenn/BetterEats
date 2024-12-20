import { PostProps } from "@/app/(app)/community/api/getAllPosts";
import { Skeleton } from "../ui/skeleton";
import QuotedMealPlan from "./QuotedMealPlan";
import { useEffect } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Heart, MessageCircle, Share } from "lucide-react";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';

interface PostProperties{
    post: PostProps
    handleLike: (post_id: number) => void
    handleUnlike: (post_id: number) => void
}

export default function Post(props: PostProperties){
    const router = useRouter()
    const pathname = usePathname()

    return(
        <div className="w-[500px] border-b border-b-1 border-gray-300 hover:bg-gray-100 hover:cursor-pointer transition-all">
            <div 
                className="flex gap-3 w-[500px] p-3"
                onClick={() => {
                    pathname.startsWith('/community/') ? {} : router.push(`/community/${props.post.post_id}`)
                }}
            >
                <div>
                    {
                        props.post.user_profile_picture
                            ?
                        <Image 
                            alt="Profile Picture"
                            src={props.post.user_profile_picture}
                            className="rounded-full"
                            width={50}
                            height={50}
                        />
                            :    
                        <Skeleton className="w-10 h-10 rounded-full border border-black"/>
                    }
                </div>
                <div className="w-full">
                    <div className="flex items-center gap-2">
                        <span className="font-semibold">
                            {props.post.user_name}
                        </span>
                        <span className="text-gray-500">
                            @{props.post.username}
                        </span>
                    </div>
                    <p className="mb-2">
                        {props.post.post_body}
                    </p>
                    {
                        props.post.meal_plan_data.meal_plan_id
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
                <div className="flex gap-1 items-center text-xs">
                    <MessageCircle size={16} color="gray"/>
                    {props.post.reply_count}
                </div>
                <div className="flex gap-1 items-center text-xs">
                    <Heart 
                        size={16} 
                        color={props.post.is_liked ? "transparent" : "gray"}
                        fill={props.post.is_liked ? "#cf1f39" : "transparent"}
                        onClick={() => {
                            props.post.is_liked ? props.handleUnlike(props.post.post_id) : props.handleLike(props.post.post_id)
                        }}
                    />
                    {props.post.like_count}
                </div>
                <div className="flex gap-1 items-center text-xs">
                    <Share size={16} color="gray"/>
                </div>
            </div>
        </div>
    )
}
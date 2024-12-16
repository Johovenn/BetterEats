import { PostProps } from "@/app/(app)/community/api/getAllPosts";
import { Skeleton } from "../ui/skeleton";
import QuotedMealPlan from "./QuotedMealPlan";
import { useEffect } from "react";
import Image from "next/image";

interface PostProperties{
    post: PostProps
}

export default function Post(props: PostProperties){

    return(
        <div className="flex gap-3 w-[500px] p-3 border-b-2 border-b-gray-300 hover:bg-gray-100 hover:cursor-pointer transition-all">
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
                <QuotedMealPlan 
                    mealPlanDetail={props.post.meal_plan_data.meal_plan_details}
                    mealPlanDate={props.post.meal_plan_data.meal_plan_date}
                    totalCalories={props.post.meal_plan_data.meal_plan_total_calorie}
                    totalProtein={props.post.meal_plan_data.meal_plan_total_protein}
                    totalCarbs={props.post.meal_plan_data.meal_plan_total_carbohydrate}
                    totalFat={props.post.meal_plan_data.meal_plan_total_fat}
                />
            </div>
        </div>
    )
}
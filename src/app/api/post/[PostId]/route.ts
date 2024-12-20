import { createResponse } from "@/lib/api"
import db from "@/lib/db"
import { auth, clerkClient } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function GET(req: Request, { params }: { params: { PostId: string } }) {
    try {
        const { userId } = auth()

        const postId = parseInt(params.PostId)
        if (isNaN(postId)) {
            return NextResponse.json(createResponse(400, "Invalid Post ID", null), { status: 400 })
        }

        const post = await db.post.findFirst({
            where: { post_id: postId },
            include: {
                MealPlan: {
                    select: {
                        user_id: true,
                        meal_plan_id: true,
                        meal_plan_date: true,
                        meal_plan_total_calorie: true,
                        meal_plan_total_carbohydrate: true,
                        meal_plan_total_protein: true,
                        meal_plan_total_fat: true,
                        mealDetails: {
                            include: {
                                meal: {
                                    select: {
                                        meal_id: true,
                                        meal_image: true,
                                        meal_name: true,
                                        meal_calories: true,
                                        meal_protein: true,
                                        meal_carbohydrate: true,
                                        meal_fat: true,
                                    },
                                },
                                mealType: {
                                    select: {
                                        meal_type_description: true,
                                    },
                                },
                            },
                        },
                    },
                },
            }
        })

        if (!post) {
            return NextResponse.json(createResponse(404, "Post not found", null), { status: 404 })
        }
        
        const userData = await clerkClient.users.getUser(post.user_id)

        const mealPlan = post.MealPlan
        type MealPlanDetails = Record<string, Array<{
            meal_plan_detail_id: number
            meal_id: number
            meal_image: string | null
            meal_name: string | null
            meal_calories: number | null
            meal_protein: number | null
            meal_carbohydrate: number | null
            meal_fat: number | null
        }>>
        
        const mealPlanDetails: MealPlanDetails =mealPlan?.mealDetails?.reduce(
            (acc, detail) => {
                const mealType = detail.mealType.meal_type_description
                    .trim()
                    .toLowerCase()

                if (!acc[mealType]) acc[mealType] = []
                acc[mealType].push({
                    meal_plan_detail_id: detail.meal_plan_detail_id,
                    meal_id: detail.meal_id,
                    meal_image: detail.meal?.meal_image,
                    meal_name: detail.meal?.meal_name,
                    meal_calories: detail.meal?.meal_calories,
                    meal_protein: detail.meal?.meal_protein,
                    meal_carbohydrate: detail.meal?.meal_carbohydrate,
                    meal_fat: detail.meal?.meal_fat,
                })

                return acc
            },
            { breakfast: [], lunch: [], dinner: [], snack: [] } as MealPlanDetails
        ) || {}

        const likeCount = await db.postLikes.count({
            where: {
                post_id: post.post_id
            }
        })

        let is_liked = false

        if(userId){
            const isLiked = await db.postLikes.findFirst({
                where: {
                    post_id: post.post_id,
                    user_id: userId,
                }
            })

            if(isLiked){
                is_liked = true
            }
        }

        const replyCount = await db.post.count({
            where: {
                reply_to_id: post.post_id,
            }
        })

        const replies = await db.post.findMany({
            where: {
                reply_to_id: post.post_id
            },
        })

        const transformedReplies = await Promise.all(
            replies.map(async (reply) => {
                const userData = await clerkClient.users.getUser(reply.user_id)
                
                let reply_is_liked = false

                if(userId){
                    const likeData = await db.postLikes.findFirst({
                        where: {
                            user_id: userId,
                            post_id: reply.post_id
                        }
                    })

                    if(likeData){
                        reply_is_liked = true
                    }
                }

                const replyLikeCount = await db.postLikes.count({
                    where: {
                        post_id: reply.post_id,
                    }
                })

                const replyToReplyCount = await db.post.count({
                    where: {
                        reply_to_id: reply.post_id,
                    }
                })

                return {
                    user_id: reply.user_id,
                    user_name: userData.fullName,
                    username: userData.username,
                    user_profile_picture: userData.imageUrl,
                    post_id: reply.post_id,
                    post_body: reply.post_body,
                    post_date: reply.post_date,
                    is_liked: reply_is_liked,
                    like_count: replyLikeCount,
                    reply_count: replyToReplyCount,
                }
            })
        )

        const response = {
            user_id: post.user_id,
            user_name: userData.fullName,
            username: userData.username,
            user_profile_picture: userData.imageUrl,
            post_id: post.post_id,
            post_body: post.post_body,
            post_date: post.post_date,
            meal_plan_id: mealPlan?.meal_plan_id,
            is_liked: is_liked,
            like_count: likeCount,
            reply_count: replyCount,
            replies: transformedReplies,
            meal_plan_data: {
                meal_plan_id: mealPlan?.meal_plan_id,
                meal_plan_date: mealPlan?.meal_plan_date,
                meal_plan_total_calorie: mealPlan?.meal_plan_total_calorie,
                meal_plan_total_carbohydrate: mealPlan?.meal_plan_total_carbohydrate,
                meal_plan_total_protein: mealPlan?.meal_plan_total_protein,
                meal_plan_total_fat: mealPlan?.meal_plan_total_fat,
                meal_plan_details: mealPlanDetails,
            },
        }

        return NextResponse.json(createResponse(200, "Fetch data successful", response), { status: 200 })
    } catch (error) {
        
    }
    
}
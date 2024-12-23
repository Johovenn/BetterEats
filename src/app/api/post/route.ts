import { createPaginationResponse, createResponse } from "@/lib/api"
import db from "@/lib/db"
import { auth, clerkClient } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
    try {
        const {userId} = auth()

        const { searchParams } = new URL(req.url)
        const page = parseInt(searchParams.get("page") || "1")
        const limit = parseInt(searchParams.get("limit") || "10")

        const posts = await db.post.findMany({
            take: limit,
            skip: page * limit,
            orderBy: { post_date: "desc" },
            where: {
                reply_to_id: null,
            },
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
            },
        })

        const transformedPosts = await Promise.all(
            posts.map(async (post) => {
                const mealPlan = post.MealPlan
    
                const userData = await clerkClient.users.getUser(post.user_id)
    
                type MealPlanDetails = Record<
                    string, 
                    Array<{
                        meal_plan_detail_id: number
                        meal_id: number
                        meal_image: string | null
                        meal_name: string | null
                        meal_calories: number | null
                        meal_protein: number | null
                        meal_carbohydrate: number | null
                        meal_fat: number | null
                    }>
                >
    
                const mealPlanDetails: MealPlanDetails =
                    mealPlan?.mealDetails?.reduce(
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

                let is_liked = false
                if(userId){
                    const likeData = await db.postLikes.findFirst({
                        where: {
                            user_id: userId,
                            post_id: post.post_id
                        }
                    })

                    if(likeData){
                        is_liked = true
                    }
                }

                const likeCount = await db.postLikes.count({
                    where: {
                        post_id: post.post_id,
                    }
                })

                const replyCount = await db.post.count({
                    where: {
                        reply_to_id: post.post_id,
                    }
                })
    
                return {
                    user_id: post.user_id,
                    user_name: userData.fullName,
                    username: userData.username,
                    user_profile_picture: userData.imageUrl,
                    post_id: post.post_id,
                    post_body: post.post_body,
                    post_date: post.post_date,
                    is_liked: is_liked,
                    like_count: likeCount,
                    reply_count: replyCount,
                    meal_plan_id: mealPlan?.meal_plan_id,
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
            })
        )

        const totalRows = await db.post.count({
            where: {
                reply_to_id: null,
            }
        })

        return NextResponse.json(
            createPaginationResponse(
                200,
                "Fetch data successful!",
                transformedPosts,
                page,
                limit,
                totalRows
            ),
            { status: 200 }
        )
    } catch (error) {
        console.error(error)
        return NextResponse.json(
            createPaginationResponse(500, "Internal server error", [], 0, 0, 0),
            { status: 500 }
        )
    }
}

export async function POST(req: Request) {
    try {
        const {userId} = auth()
        if (!userId) {
            return NextResponse.json(createResponse(401, "Unauthorized", null), { status: 401 })
        }

        const body = await req.json()
        const {
            post_body = "",
            meal_plan_id = null,
            reply_to_id = null,
        } = body

        if (!post_body) {
            return NextResponse.json(createResponse(400, "Bad Request: Missing required fields", null), { status: 400 })
        }

        const post = await db.post.create({
            data: {
                post_body: post_body,
                post_date: new Date,
                meal_plan_id: meal_plan_id,
                reply_to_id: reply_to_id,
                user_id: userId
            },
        })

        const userData = await clerkClient.users.getUser(post.user_id)

        let is_liked = false

        const likeCount = await db.postLikes.count({
            where: {
                post_id: post.post_id
            }
        })

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

        const response = {
            user_id: post.user_id,
            user_name: userData.fullName,
            username: userData.username,
            user_profile_picture: userData.imageUrl,
            post_id: post.post_id,
            post_body: post.post_body,
            post_date: post.post_date,
            is_liked: is_liked,
            like_count: likeCount,
            reply_count: replyCount,
        }

        return NextResponse.json(createResponse(201, "Post created successfully", response), { status: 201 })

    } catch (error) {
        return NextResponse.json(createResponse(500, "Internal server error", []), { status: 500 })
    }
}
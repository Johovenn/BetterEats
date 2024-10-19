import { createPaginationResponse, createResponse } from "@/lib/api";
import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(req: Request){
    const {userId} = auth()
    if(!userId){
        return NextResponse.json(createResponse(401, "Unauthorized", null), {status: 401})
    }

    const {searchParams} = new URL(req.url)
    const mealPlanDate = searchParams.get('meal_plan_date')
    if(!mealPlanDate){
        return NextResponse.json(createResponse(400, "Bad Request", null), {status: 400})
    }

    const startOfDay = new Date(mealPlanDate)
    startOfDay.setUTCHours(0, 0, 0, 0)

    const endOfDay = new Date(mealPlanDate)
    endOfDay.setUTCHours(23, 59, 59, 999)

    const mealPlanData = await db.mealPlan.findFirst({
        where: {
            user_id: userId,
            meal_plan_date: {
                gte: startOfDay,
                lte: endOfDay
            }
        }
    })

    const userData=  await db.userBMR.findFirst({
        where: {
            user_id: userId,
        },
        orderBy: {
            user_bmr_date: 'desc'
        },
    })

    if(mealPlanData){
        const mealPlanDetailData = await db.mealPlanDetail.findMany({
            where: {
                meal_plan_id: mealPlanData?.meal_plan_id,
            },
            include: {
                meal: true,
                mealType: true
            },
        })

        const response = {
            meal_plan_id: mealPlanData.meal_plan_id,
            meal_plan_date: mealPlanDate,
            meal_plan_total_calorie: mealPlanData.meal_plan_total_calorie,
            meal_plan_total_protein: mealPlanData.meal_plan_total_protein,
            meal_plan_total_fat: mealPlanData.meal_plan_total_fat,
            meal_plan_total_carbohydrate: mealPlanData.meal_plan_total_carbohydrate,
            user_calorie_requirement: userData?.user_bmr_value,
            user_protein_requirement: userData?.protein,
            user_carbohydrate_requirement: userData?.carbohydrate,
            user_fat_requirement: userData?.fat,
            meals: {
                breakfast: mealPlanDetailData
                    .filter(detail => detail.mealType.meal_type_description === "Breakfast")
                    .map(detail => ({
                        meal_plan_detail_id: detail.meal_plan_detail_id,
                        meal_id: detail.meal.meal_id,
                        meal_image: detail.meal.meal_image,
                        meal_name: detail.meal.meal_name,
                        meal_calories: detail.meal.meal_calories,
                        meal_protein: detail.meal.meal_protein,
                        meal_carbohydrate: detail.meal.meal_carbohydrate,
                        meal_fat: detail.meal.meal_fat,
                    })),
                lunch: mealPlanDetailData
                    .filter(detail => detail.meal_type_id === 3)
                    .map(detail => ({
                        meal_plan_detail_id: detail.meal_plan_detail_id,
                        meal_id: detail.meal.meal_id,
                        meal_image: detail.meal.meal_image,
                        meal_name: detail.meal.meal_name,
                        meal_calories: detail.meal.meal_calories,
                        meal_protein: detail.meal.meal_protein,
                        meal_carbohydrate: detail.meal.meal_carbohydrate,
                        meal_fat: detail.meal.meal_fat,
                    })),
                dinner: mealPlanDetailData
                    .filter(detail => detail.meal_type_id === 4)
                    .map(detail => ({
                        meal_plan_detail_id: detail.meal_plan_detail_id,
                        meal_id: detail.meal.meal_id,
                        meal_image: detail.meal.meal_image,
                        meal_name: detail.meal.meal_name,
                        meal_calories: detail.meal.meal_calories,
                        meal_protein: detail.meal.meal_protein,
                        meal_carbohydrate: detail.meal.meal_carbohydrate,
                        meal_fat: detail.meal.meal_fat,
                    })),
                snack: mealPlanDetailData
                    .filter(detail => detail.meal_type_id === 2)
                    .map(detail => ({
                        meal_plan_detail_id: detail.meal_plan_detail_id,
                        meal_id: detail.meal.meal_id,
                        meal_image: detail.meal.meal_image,
                        meal_name: detail.meal.meal_name,
                        meal_calories: detail.meal.meal_calories,
                        meal_protein: detail.meal.meal_protein,
                        meal_carbohydrate: detail.meal.meal_carbohydrate,
                        meal_fat: detail.meal.meal_fat,
                    })),
                }
        };
        
        return NextResponse.json(createResponse(200, "Get Meal Plan successful!", response), {status: 200})
    }
    else {
        const response = {
            meal_plan_id: null,
            meal_plan_date: mealPlanDate,
            meal_plan_total_calorie: 0,
            meal_plan_total_protein: 0,
            meal_plan_total_fat: 0,
            meal_plan_total_carbohydrate: 0,
            user_calorie_requirement: userData?.user_bmr_value,
            user_protein_requirement: userData?.protein,
            user_carbohydrate_requirement: userData?.carbohydrate,
            user_fat_requirement: userData?.fat,
            meals: {
                breakfast: null,
                lunch: null,
                dinner: null,
                snack: null,
            }
        }

        return NextResponse.json(createResponse(200, "Get Meal Plan successful!", response), {status: 200})
    }
}

export async function POST(req: Request){
    try {
        const {userId} = auth()
        if(!userId){
            return NextResponse.json(createResponse(401, "Unauthorized", null), {status: 401})
        }

        const { meal_plan_date, meal_type_id, meal_id } = await req.json()

        const meal = await db.meal.findFirst({
            where: {
                meal_id: meal_id,
            }
        })

        if(!meal){
            return NextResponse.json(createResponse(400, "Invalid meal", null), {status: 400})
        }
        
        const startOfDay = new Date(meal_plan_date)
        startOfDay.setUTCHours(0, 0, 0, 0)

        const endOfDay = new Date(meal_plan_date)
        endOfDay.setUTCHours(23, 59, 59, 999)

        let mealPlanDate = new Date(meal_plan_date).toISOString()
    
        let mealPlan = await db.mealPlan.findFirst({
            where: {
                user_id: userId,
                meal_plan_date: {
                    gte: startOfDay,
                    lte: endOfDay,
                },
            }
        })
    
        if (!mealPlan) {
            mealPlan = await db.mealPlan.create({
                data: {
                    user_id: userId,
                    meal_plan_date: mealPlanDate,
                    meal_plan_total_calorie: meal.meal_calories,
                    meal_plan_total_carbohydrate: meal.meal_carbohydrate,
                    meal_plan_total_protein: meal.meal_protein,
                    meal_plan_total_fat: meal.meal_fat,
                }
            })
        } else {
            mealPlan = await db.mealPlan.update({
                where: { meal_plan_id: mealPlan.meal_plan_id },
                data: {
                    meal_plan_total_calorie: mealPlan.meal_plan_total_calorie + meal.meal_calories,
                    meal_plan_total_carbohydrate: mealPlan.meal_plan_total_carbohydrate + meal.meal_carbohydrate,
                    meal_plan_total_protein: mealPlan.meal_plan_total_protein + meal.meal_protein,
                    meal_plan_total_fat: mealPlan.meal_plan_total_fat + meal.meal_fat,
                }
            })
        }
    
        const mealPlanDetail = await db.mealPlanDetail.create({
            data: {
                meal_plan_id: mealPlan.meal_plan_id,
                meal_type_id: meal_type_id,
                meal_id: meal_id,
            }
        })
    
        return NextResponse.json(createResponse(200, "Create Meal Plan successful!", mealPlanDetail), {status: 200})
    } catch (error) {
        return NextResponse.json(createResponse(500, "Error creating meal plan", null), {status: 500})
    }
}
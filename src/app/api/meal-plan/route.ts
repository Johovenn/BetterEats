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

    const utcMealPlanDate = new Date(mealPlanDate)

    const startOfDay = new Date(utcMealPlanDate)
    startOfDay.setUTCHours(0, 0, 0, 0)

    const endOfDay = new Date(utcMealPlanDate)
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

    if(mealPlanData?.meal_plan_id){
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
            meal_plan_date: mealPlanData.meal_plan_date,
            meals: {
                breakfast: mealPlanDetailData
                    .filter(detail => detail.mealType.meal_type_description === "Breakfast")
                    .map(detail => ({
                        meal_id: detail.meal.meal_id,
                        meal_image: detail.meal.meal_image,
                        meal_name: detail.meal.meal_name,
                        calories: detail.meal.meal_calories,
                        protein: detail.meal.meal_protein,
                        carbohydrate: detail.meal.meal_carbohydrate,
                        fat: detail.meal.meal_fat,
                    })),
                lunch: mealPlanDetailData
                    .filter(detail => detail.meal_type_id === 2)
                    .map(detail => ({
                        meal_id: detail.meal.meal_id,
                        meal_image: detail.meal.meal_image,
                        meal_name: detail.meal.meal_name,
                        calories: detail.meal.meal_calories,
                        protein: detail.meal.meal_protein,
                        carbohydrate: detail.meal.meal_carbohydrate,
                        fat: detail.meal.meal_fat,
                    })),
                dinner: mealPlanDetailData
                    .filter(detail => detail.meal_type_id === 3)
                    .map(detail => ({
                        meal_id: detail.meal.meal_id,
                        meal_image: detail.meal.meal_image,
                        meal_name: detail.meal.meal_name,
                        calories: detail.meal.meal_calories,
                        protein: detail.meal.meal_protein,
                        carbohydrate: detail.meal.meal_carbohydrate,
                        fat: detail.meal.meal_fat,
                    })),
                snack: mealPlanDetailData
                    .filter(detail => detail.meal_type_id === 4)
                    .map(detail => ({
                        meal_id: detail.meal.meal_id,
                        meal_image: detail.meal.meal_image,
                        meal_name: detail.meal.meal_name,
                        calories: detail.meal.meal_calories,
                        protein: detail.meal.meal_protein,
                        carbohydrate: detail.meal.meal_carbohydrate,
                        fat: detail.meal.meal_fat,
                    })),
                }
        };
        
        return NextResponse.json(createResponse(200, "Get Meal Plan successful!", response), {status: 200})
    }
    else {
        return NextResponse.json(createResponse(200, "Get Meal Plan successful!", null), {status: 200})
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
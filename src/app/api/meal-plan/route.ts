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

    const mealPlanData = await db.mealPlan.findFirst({
        where: {
            user_id: userId,
            meal_plan_date: new Date(mealPlanDate)
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
            
        }
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
    
        let mealPlan = await db.mealPlan.findFirst({
            where: {
                user_id: userId,
                meal_plan_date: new Date(meal_plan_date),
            }
        })
    
        if (!mealPlan) {
            mealPlan = await db.mealPlan.create({
                data: {
                    user_id: userId,
                    meal_plan_date: new Date(meal_plan_date),
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
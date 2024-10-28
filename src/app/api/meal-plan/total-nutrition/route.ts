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

    const response = {
        meal_plan_date: mealPlanData ? mealPlanData.meal_plan_date : mealPlanDate,
        meal_plan_total_calorie: mealPlanData ? mealPlanData.meal_plan_total_calorie : 0,
        meal_plan_total_protein: mealPlanData ? mealPlanData.meal_plan_total_protein : 0,
        meal_plan_total_carbohydrate: mealPlanData ? mealPlanData.meal_plan_total_carbohydrate : 0,
        meal_plan_total_fat: mealPlanData ? mealPlanData.meal_plan_total_fat : 0,   
        user_calorie_requirement: userData ? userData.user_bmr_value : 0,
        user_protein_requirement: userData ? userData.protein : 0,
        user_carbohydrate_requirement: userData ? userData.carbohydrate : 0,
        user_fat_requirement: userData ? userData.fat : 0,
    }

    return NextResponse.json(createResponse(200, "Fetch data successful!", response), {status: 200})
}
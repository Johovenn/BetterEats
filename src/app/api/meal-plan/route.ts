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
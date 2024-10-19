import { createResponse } from '@/lib/api';
import db from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function DELETE(req: Request, { params }: { params: { mealPlanDetailId: string } }) {
    try {
        const {userId} = auth()
        if(!userId){
            return NextResponse.json(createResponse(401, "Unauthorized", null), {status: 401})
        }
    
        const mealPlanDetailId = params.mealPlanDetailId;

        const mealPlanDetail = await db.mealPlanDetail.findFirst({
            where: { 
                meal_plan_detail_id: Number(mealPlanDetailId) 
            },
            include: {
                meal: true
            }
        });

        console.log(mealPlanDetail)

        if (!mealPlanDetail) {
            return NextResponse.json(createResponse(404, "Meal Plan Detail not found", null), { status: 404 });
        }

        const mealPlan = await db.mealPlan.findFirst({
            where: {
                meal_plan_id: mealPlanDetail.meal_plan_id
            }
        })
        if(!mealPlan){
            return NextResponse.json(createResponse(404, "Meal Plan not found", null), { status: 404 });
        }
    
        await db.mealPlanDetail.delete({
            where: { 
                meal_plan_detail_id: Number(mealPlanDetailId) 
            }
        });

        await db.mealPlan.update({
            where: { 
                meal_plan_id: mealPlanDetail.meal_plan_id 
            },
            data: {
                meal_plan_total_calorie: mealPlan.meal_plan_total_calorie - mealPlanDetail.meal.meal_calories,
                meal_plan_total_protein: mealPlan.meal_plan_total_protein - mealPlanDetail.meal.meal_protein,
                meal_plan_total_carbohydrate: mealPlan.meal_plan_total_carbohydrate - mealPlanDetail.meal.meal_carbohydrate,
                meal_plan_total_fat: mealPlan.meal_plan_total_fat - mealPlanDetail.meal.meal_fat,
            },
        });

        return NextResponse.json({ status: 200, message: 'Meal removed successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json(createResponse(500, "Error deleting meal plan", null), {status: 500})
    }
}
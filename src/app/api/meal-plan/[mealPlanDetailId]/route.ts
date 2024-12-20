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

export async function GET(req: Request, { params }: { params: { mealPlanDetailId: string } }) {
    try {
        const { userId } = auth()
        if (!userId) {
            return NextResponse.json(createResponse(401, "Unauthorized", null), { status: 401 })
        }

        const mealPlanDetailId = parseInt(params.mealPlanDetailId)

        if (isNaN(mealPlanDetailId)) {
            return NextResponse.json(createResponse(400, "Invalid meal plan ID", null), { status: 400 })
        }

        const mealPlan = await db.mealPlan.findUnique({
            where: { meal_plan_id: mealPlanDetailId },
            include: {
                mealDetails: {
                    include: {
                        meal: true,
                        mealType: true,
                    },
                },
            },
        })

        if (!mealPlan) {
            return NextResponse.json(createResponse(404, "Meal plan not found", null), { status: 404 })
        }

        const mealPlanDetails = mealPlan.mealDetails.reduce(
            (acc, detail) => {
                const mealType = detail.mealType?.meal_type_description
                    .trim()
                    .toLowerCase()

                if (!mealType) return acc

                if (!acc[mealType]) acc[mealType] = []

                acc[mealType].push({
                    meal_plan_detail_id: detail.meal_plan_detail_id,
                    meal_id: detail.meal_id,
                    meal_image: detail.meal.meal_image,
                    meal_name: detail.meal.meal_name,
                    meal_calories: detail.meal.meal_calories,
                    meal_protein: detail.meal.meal_protein,
                    meal_carbohydrate: detail.meal.meal_carbohydrate,
                    meal_fat: detail.meal.meal_fat,
                })

                return acc
            },
            { breakfast: [], lunch: [], dinner: [], snack: [] } as Record<
                string,
                Array<{
                    meal_plan_detail_id: number
                    meal_id: number
                    meal_image: string
                    meal_name: string
                    meal_calories: number
                    meal_protein: number
                    meal_carbohydrate: number
                    meal_fat: number
                }>
            >
        )

        const response = {
            meal_plan_id: mealPlan.meal_plan_id,
            meal_plan_date: mealPlan.meal_plan_date,
            meal_plan_total_calorie: mealPlan.meal_plan_total_calorie,
            meal_plan_total_carbohydrate: mealPlan.meal_plan_total_carbohydrate,
            meal_plan_total_protein: mealPlan.meal_plan_total_protein,
            meal_plan_total_fat: mealPlan.meal_plan_total_fat,
            meal_plan_details: mealPlanDetails,
        }

        return NextResponse.json(createResponse(200, "Meal plan fetched successfully", response), { status: 200 })
    } catch (error) {
        console.error("Error fetching meal plan:", error)
        return NextResponse.json(createResponse(500, "Internal server error", null), { status: 500 })
    }
}

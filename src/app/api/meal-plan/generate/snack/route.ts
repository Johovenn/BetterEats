import { MealProps } from "@/app/(app)/search/api/getAllMeals"
import { createResponse } from "@/lib/api"
import db from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { Dna } from "lucide-react"
import { NextResponse } from "next/server"


export async function POST(req: Request){
    try {
        const { userId } = auth()
        if(!userId){
            return NextResponse.json(createResponse(401, 'Unauthorized', null), {status: 401})
        }

        const {searchParams} = new URL(req.url)
        const mealPlanDate = searchParams.get('meal_plan_date')
        if(!mealPlanDate){
            return NextResponse.json(createResponse(400, "Bad Request, Date is required!", null), {status: 400})
        }
    
        const startOfDay = new Date(mealPlanDate)
        startOfDay.setUTCHours(0, 0, 0, 0)
    
        const endOfDay = new Date(mealPlanDate)
        endOfDay.setUTCHours(23, 59, 59, 999)

        const userBmr = await db.userBMR.findFirst({
        where: {
                user_id: userId,
            },
            orderBy: {
                user_bmr_date: 'desc'
            }
        })

        if(!userBmr){
            return NextResponse.json(createResponse(400, 'TDEE data not recorded, please calculate your TDEE first.', null), {status: 400})
        }

        const snackMeals = await db.meal.findMany({
            where: {
                is_snack: true,
            }
        })

        const snackCount = await db.meal.count({
            where: {
                is_snack:true
            }
        })

        const mealPlanData = await db.mealPlan.findFirst({
            where: {
                user_id: userId,
                meal_plan_date: {
                    gte: startOfDay,
                    lte: endOfDay
                }
            }
        })

        if(!mealPlanData){
            const newMealPlan = await db.mealPlan.create({
                data: {
                    user_id: userId,
                    meal_plan_date: new Date(mealPlanDate),
                    meal_plan_total_calorie: 0,
                    meal_plan_total_carbohydrate: 0,
                    meal_plan_total_fat: 0,
                    meal_plan_total_protein: 0,
                }
            })

            let calorieNeeds = userBmr.user_bmr_value
            let proteinNeeds = userBmr.protein
            let carbsNeeds = userBmr.carbohydrate
            let fatNeeds = userBmr.fat

            let mealIds: number[] = []
            let snackCreated = false

            while(!snackCreated){
                const randomIndex = Math.floor(Math.random() * snackCount)
                if(snackMeals[randomIndex].meal_calories < calorieNeeds && snackMeals[randomIndex].meal_protein < proteinNeeds && snackMeals[randomIndex].meal_carbohydrate < carbsNeeds && snackMeals[randomIndex].meal_fat < fatNeeds && mealIds.indexOf(snackMeals[randomIndex].meal_id) === -1){
                    const createBreakfast = await db.mealPlanDetail.create({
                        data: {
                            meal_plan_id: newMealPlan.meal_plan_id,
                            meal_id: snackMeals[randomIndex].meal_id,
                            meal_type_id: 2,
                        }
                    })

                    mealIds.push(snackMeals[randomIndex].meal_id)
                    calorieNeeds -= snackMeals[randomIndex].meal_calories
                    proteinNeeds -= snackMeals[randomIndex].meal_protein
                    carbsNeeds -= snackMeals[randomIndex].meal_carbohydrate
                    fatNeeds -= snackMeals[randomIndex].meal_fat
                    
                    snackCreated = true
                }
            }

            const updateMealPlan = await db.mealPlan.update({
                data: {
                    meal_plan_total_calorie: userBmr.user_bmr_value - calorieNeeds,
                    meal_plan_total_fat: userBmr.fat - fatNeeds,
                    meal_plan_total_carbohydrate: userBmr.carbohydrate - carbsNeeds,
                    meal_plan_total_protein: userBmr.protein - proteinNeeds,
                },
                where: {
                    meal_plan_id: newMealPlan.meal_plan_id
                }
            })
        }
        else{
            const mealPlanDetailData = await db.mealPlanDetail.findMany({
                where: {
                    meal_plan_id: mealPlanData.meal_plan_id,
                }
            })

            let calorieNeeds = userBmr.user_bmr_value - mealPlanData.meal_plan_total_calorie
            let proteinNeeds = userBmr.protein - mealPlanData.meal_plan_total_protein
            let carbsNeeds = userBmr.carbohydrate - mealPlanData.meal_plan_total_carbohydrate
            let fatNeeds = userBmr.fat - mealPlanData.meal_plan_total_fat
            let snackAvailable = false

            let mealIds: number[] = []
            let snackCreated = false

            for (const mealPlanDetail of mealPlanDetailData){
                mealIds.push(mealPlanDetail.meal_id)
                if (mealPlanDetail.meal_type_id === 2){
                    snackAvailable = true
                }
            }
        
            if(!snackCreated){
                while(!snackCreated){
                    const randomIndex = Math.floor(Math.random() * snackCount)
                    if(snackMeals[randomIndex].meal_calories < calorieNeeds && snackMeals[randomIndex].meal_protein < proteinNeeds && snackMeals[randomIndex].meal_carbohydrate < carbsNeeds && snackMeals[randomIndex].meal_fat < fatNeeds && mealIds.indexOf(snackMeals[randomIndex].meal_id) === -1){
                        const createBreakfast = await db.mealPlanDetail.create({
                            data: {
                                meal_plan_id: mealPlanData.meal_plan_id,
                                meal_id: snackMeals[randomIndex].meal_id,
                                meal_type_id: 2,
                            }
                        })
    
                        mealIds.push(snackMeals[randomIndex].meal_id)
                        calorieNeeds -= snackMeals[randomIndex].meal_calories
                        proteinNeeds -= snackMeals[randomIndex].meal_protein
                        carbsNeeds -= snackMeals[randomIndex].meal_carbohydrate
                        fatNeeds -= snackMeals[randomIndex].meal_fat
                        
                        snackCreated = true
                    }
                }
            }

            const updateMealPlan = await db.mealPlan.update({
                data: {
                    meal_plan_total_calorie: userBmr.user_bmr_value - calorieNeeds,
                    meal_plan_total_fat: userBmr.fat - fatNeeds,
                    meal_plan_total_carbohydrate: userBmr.carbohydrate - carbsNeeds,
                    meal_plan_total_protein: userBmr.protein - proteinNeeds,
                },
                where: {
                    meal_plan_id: mealPlanData.meal_plan_id
                }
            })
        }
        return NextResponse.json(createResponse(200, 'Generate meal plan successful!', null), {status: 200})
    } catch (error) {
            return NextResponse.json(createResponse(500, 'Oops, something went wrong.', null), {status: 500})
    }
}
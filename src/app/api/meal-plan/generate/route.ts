import { MealProps } from "@/app/(app)/search/api/getAllMeals"
import { createResponse } from "@/lib/api"
import db from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"


export async function POST(req: Request){
    try {
        const { userId } = auth()
        if(!userId){
            return NextResponse.json(createResponse(401, 'Unauthorized', null), {status: 401})
        }

        const request = await req.json()
        const mealPlanDate = request.meal_plan_date
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

        const breakfastMeals = await db.meal.findMany({
            where: {
                is_breakfast: true,
            }
        })
        const snackMeals = await db.meal.findMany({
            where: {
                is_snack: true,
            }
        })
        const lunchMeals = await db.meal.findMany({
            where: {
                is_lunch: true,
            }
        })
        const dinnerMeals = await db.meal.findMany({
            where: {
                is_dinner: true,
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

            for(const meal of breakfastMeals){
                if(meal.meal_calories < calorieNeeds && meal.meal_protein < proteinNeeds && meal.meal_carbohydrate < carbsNeeds && meal.meal_fat < fatNeeds && mealIds.indexOf(meal.meal_id) === -1){
                    const createBreakfast = await db.mealPlanDetail.create({
                        data: {
                            meal_plan_id: newMealPlan.meal_plan_id,
                            meal_id: meal.meal_id,
                            meal_type_id: 1,
                        }
                    })

                    mealIds.push(meal.meal_id)
                    calorieNeeds -= meal.meal_calories
                    proteinNeeds -= meal.meal_protein
                    carbsNeeds -= meal.meal_carbohydrate
                    fatNeeds -= meal.meal_fat
                    
                    break
                }
            }

            for(const meal of snackMeals){
                if(meal.meal_calories < calorieNeeds && meal.meal_protein < proteinNeeds && meal.meal_carbohydrate < carbsNeeds && meal.meal_fat < fatNeeds && mealIds.indexOf(meal.meal_id) === -1){
                    const createSnack = await db.mealPlanDetail.create({
                        data: {
                            meal_plan_id: newMealPlan.meal_plan_id,
                            meal_id: meal.meal_id,
                            meal_type_id: 2,
                        }
                    })

                    mealIds.push(meal.meal_id)
                    calorieNeeds -= meal.meal_calories
                    proteinNeeds -= meal.meal_protein
                    carbsNeeds -= meal.meal_carbohydrate
                    fatNeeds -= meal.meal_fat
                    
                    break
                }
            }
            
            for(const meal of lunchMeals){
                if(meal.meal_calories < calorieNeeds && meal.meal_protein < proteinNeeds && meal.meal_carbohydrate < carbsNeeds && meal.meal_fat < fatNeeds && mealIds.indexOf(meal.meal_id) === -1){
                    const createLunch = await db.mealPlanDetail.create({
                        data: {
                            meal_plan_id: newMealPlan.meal_plan_id,
                            meal_id: meal.meal_id,
                            meal_type_id: 3,
                        }
                    })

                    mealIds.push(meal.meal_id)
                    calorieNeeds -= meal.meal_calories
                    proteinNeeds -= meal.meal_protein
                    carbsNeeds -= meal.meal_carbohydrate
                    fatNeeds -= meal.meal_fat
                    
                    break
                }
            }
            
            for(const meal of dinnerMeals){
                if(meal.meal_calories < calorieNeeds && meal.meal_protein < proteinNeeds && meal.meal_carbohydrate < carbsNeeds && meal.meal_fat < fatNeeds && mealIds.indexOf(meal.meal_id) === -1){
                    const createDinner = await db.mealPlanDetail.create({
                        data: {
                            meal_plan_id: newMealPlan.meal_plan_id,
                            meal_id: meal.meal_id,
                            meal_type_id: 4,
                        }
                    })

                    mealIds.push(meal.meal_id)
                    calorieNeeds -= meal.meal_calories
                    proteinNeeds -= meal.meal_protein
                    carbsNeeds -= meal.meal_carbohydrate
                    fatNeeds -= meal.meal_fat
                    
                    break
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
            let breakfastAvailable = false
            let snackAvailable = false
            let lunchAvailable = false
            let dinnerAvailable = false

            let mealIds: number[] = []

            for (const mealPlanDetail of mealPlanDetailData){
                mealIds.push(mealPlanDetail.meal_id)
                if(mealPlanDetail.meal_type_id === 1){
                    breakfastAvailable = true
                } else if (mealPlanDetail.meal_type_id === 2){
                    snackAvailable = true
                } else if (mealPlanDetail.meal_type_id === 3){
                    lunchAvailable = true
                } else if (mealPlanDetail.meal_type_id === 4){
                    dinnerAvailable = true
                }
            }

            if(breakfastAvailable === false) {
                for(const meal of breakfastMeals){
                    if(meal.meal_calories < calorieNeeds && meal.meal_protein < proteinNeeds && meal.meal_carbohydrate < carbsNeeds && meal.meal_fat < fatNeeds && mealIds.indexOf(meal.meal_id) === -1){
                        const createBreakfast = await db.mealPlanDetail.create({
                            data: {
                                meal_plan_id: mealPlanData.meal_plan_id,
                                meal_id: meal.meal_id,
                                meal_type_id: 1,
                            }
                        })
                        mealIds.push(meal.meal_id)
                        calorieNeeds -= meal.meal_calories
                        proteinNeeds -= meal.meal_protein
                        carbsNeeds -= meal.meal_carbohydrate
                        fatNeeds -= meal.meal_fat
                        
                        break
                    }
                }
            }
            
            if(snackAvailable === false){
                for(const meal of snackMeals){
                    if(meal.meal_calories < calorieNeeds && meal.meal_protein < proteinNeeds && meal.meal_carbohydrate < carbsNeeds && meal.meal_fat < fatNeeds && mealIds.indexOf(meal.meal_id) === -1){
                        const createSnack = await db.mealPlanDetail.create({
                            data: {
                                meal_plan_id: mealPlanData.meal_plan_id,
                                meal_id: meal.meal_id,
                                meal_type_id: 2,
                            }
                        })

                        mealIds.push(meal.meal_id)
                        calorieNeeds -= meal.meal_calories
                        proteinNeeds -= meal.meal_protein
                        carbsNeeds -= meal.meal_carbohydrate
                        fatNeeds -= meal.meal_fat
                        
                        break
                    }
                }
            }
            
            if(lunchAvailable === false){
                for(const meal of lunchMeals){
                    if(meal.meal_calories < calorieNeeds && meal.meal_protein < proteinNeeds && meal.meal_carbohydrate < carbsNeeds && meal.meal_fat < fatNeeds && mealIds.indexOf(meal.meal_id) === -1){
                        const createLunch = await db.mealPlanDetail.create({
                            data: {
                                meal_plan_id: mealPlanData.meal_plan_id,
                                meal_id: meal.meal_id,
                                meal_type_id: 3,
                            }
                        })

                        mealIds.push(meal.meal_id)
                        calorieNeeds -= meal.meal_calories
                        proteinNeeds -= meal.meal_protein
                        carbsNeeds -= meal.meal_carbohydrate
                        fatNeeds -= meal.meal_fat
                        
                        break
                    }
                }
            }
            
            if(dinnerAvailable === false){
                for(const meal of dinnerMeals){
                    if(meal.meal_calories < calorieNeeds && meal.meal_protein < proteinNeeds && meal.meal_carbohydrate < carbsNeeds && meal.meal_fat < fatNeeds && mealIds.indexOf(meal.meal_id) === -1){
                        const createDinner = await db.mealPlanDetail.create({
                            data: {
                                meal_plan_id: mealPlanData.meal_plan_id,
                                meal_id: meal.meal_id,
                                meal_type_id: 4,
                            }
                        })

                        mealIds.push(meal.meal_id)
                        calorieNeeds -= meal.meal_calories
                        proteinNeeds -= meal.meal_protein
                        carbsNeeds -= meal.meal_carbohydrate
                        fatNeeds -= meal.meal_fat
                        
                        break
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
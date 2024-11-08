import { createPaginationResponse, createResponse } from "@/lib/api"
import db from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
    try {
        const { userId } = auth()
        if (!userId) {
            return NextResponse.json(createPaginationResponse(401, 'Unauthorized', null, 0, 0, 0), { status: 401 })
        }

        const url = new URL(req.url)
        const meal_plan_date = url.searchParams.get("meal_plan_date")
        const page = parseInt(url.searchParams.get("page") || "1")
        const limit = parseInt(url.searchParams.get("limit") || "10")

        if (!meal_plan_date) {
            return NextResponse.json(createPaginationResponse(400, 'meal_plan_date is required', null, 0, 0, 0), { status: 400 })
        }

        const mealPlanDate = new Date(meal_plan_date)

        const userBmr = await db.userBMR.findFirst({
            where: { 
                user_id: userId 
            },
            orderBy: { 
                user_bmr_date: 'desc' 
            },
        })

        if (!userBmr) {
            return NextResponse.json(createPaginationResponse(404, 'No BMR record found for the user', null, 0, 0, 0), { status: 404 })
        }

        const { user_bmr_value, protein, carbohydrate, fat } = userBmr

        const mealPlan = await db.mealPlan.findFirst({
            where: {
                user_id: userId,
                meal_plan_date: mealPlanDate
            },
            include: {
                mealDetails: {
                    include: {
                        meal: true
                    }
                }
            }
        })

        const consumedCalories = mealPlan ? mealPlan.meal_plan_total_calorie : 0 
        const consumedProtein = mealPlan ? mealPlan.meal_plan_total_protein : 0
        const consumedCarbs = mealPlan ? mealPlan.meal_plan_total_carbohydrate : 0
        const consumedFat = mealPlan ? mealPlan.meal_plan_total_fat : 0

        const remainingCalories = user_bmr_value - consumedCalories
        const remainingProtein = protein - consumedProtein
        const remainingCarbs = carbohydrate - consumedCarbs
        const remainingFat = fat - consumedFat

        const meals = await db.meal.findMany({
            where: {
                meal_calories: { 
                    lte: remainingCalories 
                },
                meal_protein: { 
                    lte: remainingProtein 
                },
                meal_carbohydrate: { 
                    lte: remainingCarbs 
                },
                meal_fat: { 
                    lte: remainingFat 
                }
            },
            skip: page * limit,
            take: limit
        })

        const totalMeals = await db.meal.count({
            where: {
                meal_calories: { 
                    lte: remainingCalories 
                },
                meal_protein: { 
                    lte: remainingProtein 
                },
                meal_carbohydrate: { 
                    lte: remainingCarbs 
                },
                meal_fat: { 
                    lte: remainingFat 
                }
            }
        })

        return NextResponse.json(createPaginationResponse(200, 'Success', meals, page, limit, totalMeals), { status: 200 })

    } catch (error) {
        console.error("Error fetching recommended meals:", error)
        return NextResponse.json(createPaginationResponse(500, 'Internal Server Error', null, 0, 0, 0), { status: 500 })
    }
}

import { createResponse } from "@/lib/api"
import db from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function GET(req: Request, { params }: { params: { MealId: string } }) {
    const { userId } = auth()
    if (!userId) {
        return NextResponse.json(createResponse(401, "Unauthorized", null), { status: 401 })
    }

    const mealId = parseInt(params.MealId)
    if (isNaN(mealId)) {
        return NextResponse.json(createResponse(400, "Invalid Meal ID", null), { status: 400 })
    }

    const meal = await db.meal.findFirst({
        where: { meal_id: mealId },
    })

    if (!meal) {
        return NextResponse.json(createResponse(404, "Meal not found", null), { status: 404 })
    }

    return NextResponse.json(createResponse(200, "Fetch data successful", meal), { status: 200 })
}

export async function PUT(req: Request, { params }: { params: { MealId: string } }) {
    try {
        const { userId } = auth()
        if (!userId) {
            return NextResponse.json(createResponse(401, "Unauthorized", null), { status: 401 })
        }

        const mealId = parseInt(params.MealId)
        if (isNaN(mealId)) {
            return NextResponse.json(createResponse(404, "Meal not found", null), { status: 400 })
        }

        const body = await req.json()
        const {
            meal_image, 
            meal_name, 
            meal_calories, 
            meal_protein, 
            meal_carbohydrate, 
            meal_fat, 
            meal_ingredients, 
            meal_recipe, 
            is_breakfast, 
            is_lunch, 
            is_dinner, 
            is_snack
        } = body

        const existingMeal = await db.meal.findFirst({
            where: { 
                meal_id: mealId 
            },
        })

        if (!existingMeal) {
            return NextResponse.json(createResponse(404, "Meal not found", null), { status: 404 })
        }

        const updatedMeal = await db.meal.update({
            where: { 
                meal_id: mealId 
            },
            data: {
                meal_image: meal_image ?? existingMeal.meal_image,
                meal_name: meal_name ?? existingMeal.meal_name,
                meal_calories: meal_calories ?? existingMeal.meal_calories,
                meal_protein: meal_protein ?? existingMeal.meal_protein,
                meal_carbohydrate: meal_carbohydrate ?? existingMeal.meal_carbohydrate,
                meal_fat: meal_fat ?? existingMeal.meal_fat,
                meal_ingredients: meal_ingredients ?? existingMeal.meal_ingredients,
                meal_recipe: meal_recipe ?? existingMeal.meal_recipe,
                is_breakfast: is_breakfast ?? existingMeal.is_breakfast,
                is_lunch: is_lunch ?? existingMeal.is_lunch,
                is_dinner: is_dinner ?? existingMeal.is_dinner,
                is_snack: is_snack ?? existingMeal.is_snack,
            },
        })

        return NextResponse.json(createResponse(200, "Update meal success!", updatedMeal), { status: 200 })
    } catch (error) {
        return NextResponse.json(createResponse(500, "Internal Server Error", null), { status: 500 })
    }
}

export async function DELETE(req: Request, { params }: { params: { MealId: string } }) {
    try {
        const { userId } = auth()
        if (!userId) {
            return NextResponse.json(createResponse(401, "Unauthorized", null), { status: 401 })
        }

        const mealId = parseInt(params.MealId)
        if (isNaN(mealId)) {
            return NextResponse.json(createResponse(400, "Invalid Meal ID", null), { status: 400 })
        }

        const mealData = await db.meal.findFirst({
            where: {
                meal_id: mealId
            }
        })
        if(!mealData){
            return NextResponse.json(createResponse(404, "Meal not found", null), { status: 400 })
        }

        const mealPlanData = await db.mealPlanDetail.findFirst({
            where: {
                meal_id: mealData.meal_id
            }
        })

        if(mealPlanData){
            return NextResponse.json(createResponse(400, "Meal is already used in a meal plan.", null), { status: 400 })
        }
        
        const data = await db.meal.delete({
            where: {
                meal_id: mealData.meal_id
            }
        })

        return NextResponse.json(createResponse(200, "Delete meal success!", null), { status: 200 })
    } catch (error) {
        return NextResponse.json(createResponse(500, "Internal Server Error", null), { status: 500 })
    }
}
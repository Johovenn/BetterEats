import { createPaginationResponse } from "@/lib/api"
import db from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
    try {
        const {userId} = auth()
        if(!userId){
            return NextResponse.json(createPaginationResponse(401, "Unauthorized", null, 0, 10, 0), {status: 401})
        }
    
        const {searchParams} = new URL(req.url)
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '10')
        const is_breakfast = searchParams.get('is_breakfast') === 'true' ? true : undefined
        const is_lunch = searchParams.get('is_lunch') === 'true' ? true : undefined
        const is_dinner = searchParams.get('is_dinner') === 'true' ? true : undefined
        const is_snack = searchParams.get('is_snack') === 'true' ? true : undefined
        const calorie_range_from = searchParams.get('calorie_range_from') ?  parseInt(String(searchParams.get('calorie_range_from'))) : undefined
        const calorie_range_to = searchParams.get('calorie_range_to') ? parseInt(String(searchParams.get('calorie_range_to'))) : undefined
        const protein_range_from = searchParams.get('protein_range_from') ?  parseInt(String(searchParams.get('protein_range_from'))) : undefined
        const protein_range_to = searchParams.get('protein_range_to') ? parseInt(String(searchParams.get('protein_range_to'))) : undefined
        const fat_range_from = searchParams.get('fat_range_from') ?  parseInt(String(searchParams.get('fat_range_from'))) : undefined
        const fat_range_to = searchParams.get('fat_range_to') ? parseInt(String(searchParams.get('fat_range_to'))) : undefined
        const carbohydrate_range_from = searchParams.get('carbohydrate_range_from') ?  parseInt(String(searchParams.get('carbohydrate_range_from'))) : undefined
        const carbohydrate_range_to = searchParams.get('carbohydrate_range_to') ? parseInt(String(searchParams.get('carbohydrate_range_to'))) : undefined
        const meal_name = searchParams.get('meal_name') || undefined

        const totalRows = await db.meal.count({
            where: {
                meal_name: meal_name ? { contains: meal_name, mode: 'insensitive' } : undefined,
                ...(is_breakfast !== undefined && { is_breakfast }),
                ...(is_lunch !== undefined && { is_lunch }),
                ...(is_dinner !== undefined && { is_dinner }),
                ...(is_snack !== undefined && { is_snack }),
                ...(calorie_range_from !== undefined && {
                    meal_calories: {
                        gte: calorie_range_from,
                    },
                }),
                ...(calorie_range_to !== undefined && {
                    meal_calories: {
                        lte: calorie_range_to,
                    },
                }),
                ...(protein_range_from !== undefined && {
                    meal_protein: {
                        gte: protein_range_from,
                    },
                }),
                ...(protein_range_to !== undefined && {
                    meal_protein: {
                        lte: protein_range_to,
                    },
                }),
                ...(fat_range_from !== undefined && {
                    meal_fat: {
                        gte: fat_range_from,
                    },
                }),
                ...(fat_range_to !== undefined && {
                    meal_fat: {
                        lte: fat_range_to,
                    },
                }),
                ...(carbohydrate_range_from !== undefined && {
                    meal_carbohydrate: {
                        gte: carbohydrate_range_from,
                    },
                }),
                ...(carbohydrate_range_to !== undefined && {
                    meal_carbohydrate: {
                        lte: carbohydrate_range_to,
                    },
                }),
            },
        })
    
        const mealData = await db.meal.findMany({
            where: {
                meal_name: meal_name ? { contains: meal_name, mode: 'insensitive' } : undefined,
                ...(is_breakfast !== undefined && { is_breakfast }),
                ...(is_lunch !== undefined && { is_lunch }),
                ...(is_dinner !== undefined && { is_dinner }),
                ...(is_snack !== undefined && { is_snack }),
                ...(calorie_range_from !== undefined && {
                    meal_calories: {
                        gte: calorie_range_from,
                    },
                }),
                ...(calorie_range_to !== undefined && {
                    meal_calories: {
                        lte: calorie_range_to,
                    },
                }),
                ...(protein_range_from !== undefined && {
                    meal_protein: {
                        gte: protein_range_from,
                    },
                }),
                ...(protein_range_to !== undefined && {
                    meal_protein: {
                        lte: protein_range_to,
                    },
                }),
                ...(fat_range_from !== undefined && {
                    meal_fat: {
                        gte: fat_range_from,
                    },
                }),
                ...(fat_range_to !== undefined && {
                    meal_fat: {
                        lte: fat_range_to,
                    },
                }),
                ...(carbohydrate_range_from !== undefined && {
                    meal_carbohydrate: {
                        gte: carbohydrate_range_from,
                    },
                }),
                ...(carbohydrate_range_to !== undefined && {
                    meal_carbohydrate: {
                        lte: carbohydrate_range_to,
                    },
                }),
            },
            take: limit,
            skip: page * limit,
            include: {
                favoriteMeals: {
                    where: { user_id: userId },
                    select: { favorite_meal_id: true },
                },
            },
        })

        const responseData = mealData.map((meal) => ({
            ...meal,
            is_favorite: meal.favoriteMeals.length > 0,
        }));
    
        if(responseData.length === 0){
            return NextResponse.json(createPaginationResponse(200, "Fetch data success, no data found.", [], page, limit, 0), {status: 200})
        }
        
        return NextResponse.json(createPaginationResponse(200, "Fetch data successful!", responseData, page, limit, totalRows), {status: 200})
    } catch (error) {
        return NextResponse.json(createPaginationResponse(500, "Internal server error", [], 0, 0, 0 ), {status: 500})
    }
}
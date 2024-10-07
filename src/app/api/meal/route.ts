import { createPaginationResponse, createResponse } from "@/lib/api";
import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const {userId} = auth()
    if(!userId){
        return NextResponse.json(createPaginationResponse(401, "Unauthorized", null, 0, 10), {status: 401})
    }

    const {searchParams} = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '1')
    const is_breakfast = searchParams.get('is_breakfast') === 'true' ? true : undefined;
    const is_lunch = searchParams.get('is_lunch') === 'true' ? true : undefined;
    const is_dinner = searchParams.get('is_dinner') === 'true' ? true : undefined;
    const is_snack = searchParams.get('is_snack') === 'true' ? true : undefined;
    const calorie_range_from = searchParams.get('calorie_range_from') ?  parseInt(String(searchParams.get('calorie_range_from'))) : undefined;
    const calorie_range_to = searchParams.get('calorie_range_to') ? parseInt(String(searchParams.get('calorie_range_to'))) : undefined;
    const meal_name = searchParams.get('meal_name') || undefined; 

    const mealData = await db.meal.findMany({
        where: {
            meal_name: meal_name ? { contains: meal_name, mode: 'insensitive' } : undefined,
            ...(is_breakfast !== undefined && { is_breakfast }),
            ...(is_lunch !== undefined && { is_lunch }),
            ...(is_dinner !== undefined && { is_dinner }),
            ...(is_snack !== undefined && { is_snack }),
            ...(calorie_range_from !== undefined && calorie_range_to !== undefined && {
                meal_calories: {
                    gte: calorie_range_from,
                    lte: calorie_range_to,
                },
            }),
        },
        take: limit,
        skip: page * limit,
    })

    if(!mealData){
        return NextResponse.json(createPaginationResponse(500, "Error fetching meal data.", [], page, limit), {status: 500})
    }

    if(mealData.length === 0){
        return NextResponse.json(createPaginationResponse(204, "Fetch data success, no data found.", [], page, limit), {status: 204})
    }
    
    return NextResponse.json(createPaginationResponse(200, "Fetch data successful!", mealData, page, limit), {status: 200})
}
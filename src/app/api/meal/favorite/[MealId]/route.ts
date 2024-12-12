import { createResponse } from "@/lib/api";
import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


export async function DELETE(req: Request, { params }: { params: { MealId: string } }){
    try {
        const { userId } = auth();
        if (!userId) {
            return NextResponse.json(createResponse(401, "Unauthorized", null), { status: 401 });
        }

        const mealId = parseInt(params.MealId)
        if (isNaN(mealId)) {
            return NextResponse.json(createResponse(400, "Invalid Meal ID", null), { status: 400 })
        }

        const deletedMeal = await db.userFavoriteMeals.findFirst({
            where: {
                user_id: userId,
                meal_id: mealId
            }
        })

        if(!deletedMeal){
            return NextResponse.json(createResponse(400, "Meal does not exist in favorite list", null), { status: 400 })
        }

        await db.userFavoriteMeals.delete({
            where: {
                favorite_meal_id: deletedMeal.favorite_meal_id
            }
        })

        return NextResponse.json(createResponse(200, "Meal successfully removed from favorite list", null), { status: 200 })
    } catch (error) {
        return NextResponse.json(createResponse(500, "Error removing meal from favorites", null), { status: 500 });
    }
}
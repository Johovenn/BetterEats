import { createResponse } from "@/lib/api";
import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


export async function GET(req: Request, { params }: { params: { MealId: string } }) {
    const { userId } = auth();
    if (!userId) {
        return NextResponse.json(createResponse(401, "Unauthorized", null), { status: 401 });
    }

    const mealId = parseInt(params.MealId);
    if (isNaN(mealId)) {
        return NextResponse.json(createResponse(400, "Invalid Meal ID", null), { status: 400 });
    }

    const meal = await db.meal.findUnique({
        where: { meal_id: mealId },
    });

    if (!meal) {
        return NextResponse.json(createResponse(404, "Meal not found", null), { status: 404 });
    }

    return NextResponse.json(createResponse(200, "Meal retrieved successfully", meal), { status: 200 });
}
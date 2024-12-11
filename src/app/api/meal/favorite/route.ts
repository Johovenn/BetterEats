import { createPaginationResponse } from "@/lib/api"
import db from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"


export async function GET(req: Request) {
    try {
        const { userId } = auth();
        if (!userId) {
            return NextResponse.json(createPaginationResponse(401, "Unauthorized", null, 0, 10, 0), { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '12');

        const totalRows = await db.userFavoriteMeals.count({
            where: { user_id: userId },
        });

        const mealData = await db.userFavoriteMeals.findMany({
            where: { user_id: userId },
            take: limit,
            skip: (page - 1) * limit,
            include: {
                meal: true,
            },
        });

        const responseData = mealData.map((favorite) => ({
            ...favorite.meal,
            is_favorite: true,
        }));

        if (responseData.length === 0) {
            return NextResponse.json(createPaginationResponse(200, "Fetch data success, no data found.", [], page, limit, 0), { status: 200 });
        }

        return NextResponse.json(createPaginationResponse(200, "Fetch data successful!", responseData, page, limit, totalRows), { status: 200 });
    } catch (error) {
        return NextResponse.json(createPaginationResponse(500, "Internal server error", [], 0, 0, 0), { status: 500 });
    }
}

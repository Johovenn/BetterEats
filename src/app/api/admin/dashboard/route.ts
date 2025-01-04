import { createResponse } from "@/lib/api"
import db from "@/lib/db"
import { auth, clerkClient } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
    try {
        const {userId} = auth()
        if (!userId) {
            return NextResponse.json(createResponse(401, "Unauthorized", null), { status: 401 })
        }

        const totalMeals = await db.meal.count()
        const totalPosts = await db.post.count()
        const totalArticles = await db.article.count()
        const totalUsers = await clerkClient.users.getCount()

        const response = {
            total_meals: totalMeals,
            total_posts: totalPosts,
            total_users: totalUsers,
            total_articles: totalArticles,
        }

        return NextResponse.json(createResponse(201, "Data fetched successfully!", response), { status: 201 })
        
    } catch (error) {
        return NextResponse.json(createResponse(500, "Internal server error", []), { status: 500 })
    }
}

import { createResponse } from "@/lib/api"
import db from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function POST(req: Request){
    try {
        const { userId } = auth()
        if (!userId) {
            return NextResponse.json(createResponse(401, "Unauthorized", null), { status: 401 })
        }
        
        const body = await req.json()
        const {post_id} = body

        const create = await db.postLikes.create({
            data: {
                user_id: userId,
                post_id: post_id
            }
        })

        if(!create){
            return NextResponse.json(createResponse(500, "Error liking post", null), { status: 500 })
        }

        return NextResponse.json(createResponse(200, "Fetch data successful!", create), { status: 200 })
    } catch (error) {
        return NextResponse.json(createResponse(500, "Error adding post to likes", null), { status: 500 })
    }
}
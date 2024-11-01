import { createPaginationResponse, createResponse } from "@/lib/api"
import db from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function GET(req: Request){
    try {
        const {userId} = auth()
        if(!userId){
            return NextResponse.json(createPaginationResponse(401, "Unauthorized", null, 0, 10, 0), {status: 401})
        }
    
        const {searchParams} = new URL(req.url)
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '10')
        const article_title = searchParams.get('article_title') || undefined 

        const totalRows = await db.article.count({
            where: {
                article_title: article_title ? { contains: article_title, mode: 'insensitive' } : undefined,
            },
        })
    
        const articleData = await db.article.findMany({
            where: {
                article_title: article_title ? { contains: article_title, mode: 'insensitive' } : undefined,
            },
            take: limit,
            skip: page * limit,
        })
    
        if(articleData.length === 0){
            return NextResponse.json(createPaginationResponse(200, "Fetch data success, no data found.", [], page, limit, 0), {status: 200})
        }
        
        return NextResponse.json(createPaginationResponse(200, "Fetch data successful!", articleData, page, limit, totalRows), {status: 200})
    } catch (error) {
        return NextResponse.json(createPaginationResponse(500, "Internal server error", [], 0, 0, 0 ), {status: 500})
    }
}

export async function POST(req: Request) {
    try {
        const {userId} = auth()
        if (!userId) {
            return NextResponse.json(createResponse(401, "Unauthorized", null), { status: 401 })
        }

        const body = await req.json()
        const {
            article_title = "", 
            article_description = "", 
            article_body = ""
        } = body

        if (!article_title || !article_description || !article_body) {
            return NextResponse.json(createResponse(400, "Bad Request: Missing required fields", null), { status: 400 })
        }

        const meal = await db.article.create({
            data: {
                article_title,
                article_description,
                article_body,
            },
        })

        return NextResponse.json(createResponse(201, "Article created successfully", meal), { status: 201 })

    } catch (error) {
        return NextResponse.json(createResponse(500, "Internal server error", []), { status: 500 })
    }
}
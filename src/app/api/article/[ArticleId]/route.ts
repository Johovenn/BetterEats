import { createResponse } from "@/lib/api"
import db from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function GET(req: Request, { params }: { params: { ArticleId: string } }) {
    const { userId } = auth()
    if (!userId) {
        return NextResponse.json(createResponse(401, "Unauthorized", null), { status: 401 })
    }

    const articleId = parseInt(params.ArticleId)
    if (isNaN(articleId)) {
        return NextResponse.json(createResponse(400, "Invalid Article ID", null), { status: 400 })
    }

    const article = await db.article.findFirst({
        where: { article_id: articleId },
    })

    if (!article) {
        return NextResponse.json(createResponse(404, "Article not found", null), { status: 404 })
    }

    return NextResponse.json(createResponse(200, "Fetch data successful", article), { status: 200 })
}

export async function PUT(req: Request, { params }: { params: { ArticleId: string } }) {
    try {
        const { userId } = auth()
        if (!userId) {
            return NextResponse.json(createResponse(401, "Unauthorized", null), { status: 401 })
        }

        const articleId = parseInt(params.ArticleId)
        if (isNaN(articleId)) {
            return NextResponse.json(createResponse(404, "Article not found", null), { status: 400 })
        }

        const body = await req.json()
        const {
            article_title,
            article_description,
            article_body,
            article_image
        } = body

        const existingArticle = await db.article.findFirst({
            where: { 
                article_id: articleId 
            },
        })

        if (!existingArticle) {
            return NextResponse.json(createResponse(404, "Article not found", null), { status: 404 })
        }

        const updatedArticle = await db.article.update({
            where: { 
                article_id: articleId 
            },
            data: {
                article_title: article_title ?? existingArticle.article_title,
                article_description: article_description ?? existingArticle.article_description,
                article_body: article_body ?? existingArticle.article_body,
                article_image: article_image ?? existingArticle.article_image,
            },
        })

        return NextResponse.json(createResponse(200, "Update article success!", updatedArticle), { status: 200 })
    } catch (error) {
        return NextResponse.json(createResponse(500, "Internal Server Error", null), { status: 500 })
    }
}

export async function DELETE(req: Request, { params }: { params: { ArticleId: string } }) {
    try {
        const { userId } = auth()
        if (!userId) {
            return NextResponse.json(createResponse(401, "Unauthorized", null), { status: 401 })
        }

        const articleId = parseInt(params.ArticleId)
        if (isNaN(articleId)) {
            return NextResponse.json(createResponse(400, "Invalid Article ID", null), { status: 400 })
        }

        const articleData = await db.article.findFirst({
            where: {
                article_id: articleId
            }
        })
        if(!articleData){
            return NextResponse.json(createResponse(404, "Article not found", null), { status: 400 })
        }
        
        const data = await db.article.delete({
            where: {
                article_id: articleData.article_id
            }
        })

        return NextResponse.json(createResponse(200, "Delete article success!", null), { status: 200 })
    } catch (error) {
        return NextResponse.json(createResponse(500, "Internal Server Error", null), { status: 500 })
    }
}
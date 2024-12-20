import { createResponse } from "@/lib/api";
import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, { params }: { params: { PostId: string } }){
    try {
        const { userId } = auth();
        if (!userId) {
            return NextResponse.json(createResponse(401, "Unauthorized", null), { status: 401 });
        }

        const post_id = parseInt(params.PostId)
        if (isNaN(post_id)) {
            return NextResponse.json(createResponse(400, "Invalid Post ID", null), { status: 400 })
        }

        const postData = await db.postLikes.findFirst({
            where: {
                user_id: userId,
                post_id: post_id
            }
        })

        if(!postData){
            return NextResponse.json(createResponse(400, "Post does not exist in like list", null), { status: 400 })
        }

        await db.postLikes.delete({
            where: {
                post_like_id: postData.post_like_id
            }
        })

        return NextResponse.json(createResponse(200, "Post successfully removed from the liked list", null), { status: 200 })
    } catch (error) {
        return NextResponse.json(createResponse(500, "Error removing post from likes", null), { status: 500 });
    }
}
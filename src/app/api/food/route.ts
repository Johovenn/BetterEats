import { createResponse } from "@/lib/api";
import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


export async function GET(req: Request){
    const {userId} = auth()
    if(!userId){
        return NextResponse.json(createResponse(401, "Unauthorized", null), {status: 401})
    }

    const data = db.food.findMany()
    if(!data){
        return NextResponse.json(createResponse(500, "Internal Server Error", null), {status: 500})
    }

    return NextResponse.json(createResponse(200, "Fetch data successful!", data), {status: 200})
}
import { createPaginationResponse, createResponse } from "@/lib/api";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


export async function GET(req: Request){
    const {userId} = auth()
    if(!userId){
        return NextResponse.json(createPaginationResponse(401, 'Unauthorized', null, 0, 0, 0), {status: 401})
    } 

    
}
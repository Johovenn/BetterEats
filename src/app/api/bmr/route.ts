import { createResponse } from "@/lib/api";
import { calculateBMR, calculateCarbs, calculateFat, calculateProtein } from "@/lib/bmrUtils";
import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request){ //create new bmr record
    try {
        const {userId} = auth()
        if(!userId){
            return NextResponse.json(createResponse(401, "Unauthorized", null), {status: 401})
        }

        const request = await req.json()

        const data = await db.userBMR.create({
            data: {
                user_id: userId,
                user_height: parseInt(request.user_height),
                user_weight: parseInt(request.user_weight),
                user_age: parseInt(request.user_age),
                user_bmr_date: request.user_bmr_date,
                user_bmr_value: request.user_bmr_value,
                protein: request.protein,
                carbohydrate: request.carbohydrate,
                fat: request.fat
            }
        })

        if(!data){
            return NextResponse.json(createResponse(500, "Error creating BMR data", null), {status: 500})
        }
        else{
            return NextResponse.json(createResponse(201, "Create data succesful!", data), {status: 201})
        }
    } catch (error) {
        return NextResponse.json(createResponse(500, "Internal Server Error", null), {status: 500})
    }
}

export async function GET(req: Request){//get user latest bmr record
    try {
        const {userId} = auth()
        if(!userId){
            return NextResponse.json(createResponse(401, "Unauthorized", null), {status: 401})
        }

        const bmrData = await db.userBMR.findFirst({
            where: {
                user_id: userId,
            },
            orderBy:{
                user_bmr_date: 'desc'
            }
        })

        if(!bmrData){
            return NextResponse.json(createResponse(204, "No existing data", null), {status: 204}) //belum ada data user
        }
        else{
            return NextResponse.json(createResponse(200, "Fetch data succesful!", bmrData), {status: 200})
        }
    } catch (error) {
        return NextResponse.json(createResponse(500, "Internal Server Error", null), {status: 500})
    }
}
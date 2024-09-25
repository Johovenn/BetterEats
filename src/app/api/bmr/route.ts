import { createResponse } from "@/lib/api";
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

        let bmrValue = 0
        if(request.user_gender){
            if(request.user_gender === 'M'){
                bmrValue = 88.362 + (13.397 * request.user_weight) + (4.799 * request.user_height) - (5.677 * request.user_age)
            }
            else if(request.user_gender === 'F'){
                bmrValue = 447.593 + (9.247 * request.user_weight) + (3.098 * request.user_height) - (4.330 * request.user_age)
            }
            else{
                return NextResponse.json(createResponse(400, "Bad Request", null), {status: 400})
            }
        }

        const data = await db.userBMR.create({
            data: {
                user_id: userId,
                user_height: request.user_height,
                user_weight: request.user_weight,
                user_age: request.user_age,
                user_bmr_date: request.user_bmr_date,
                user_bmr_value: bmrValue,
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

        const bmrData = db.userBMR.findFirst({
            where: {
                user_id: userId,
            },
            orderBy:{
                user_bmr_date: 'desc'
            }
        })
        if(!bmrData){
            return NextResponse.json(createResponse(204, "Internal Server Error", null), {status: 204}) //belum ada data user
        }
        else{
            return NextResponse.json(createResponse(200, "Create data succesful!", bmrData), {status: 200})
        }
    } catch (error) {
        return NextResponse.json(createResponse(500, "Internal Server Error", null), {status: 500})
    }
}
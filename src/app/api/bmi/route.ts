import { createResponse } from "@/lib/api";
import { calculateBMR, calculateCarbs, calculateFat, calculateProtein } from "@/lib/bmrUtils";
import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request){
    try {
        const {userId} = auth()
        if(!userId){
            return NextResponse.json(createResponse(401, "Unauthorized", null), {status: 401})
        }

        const request = await req.json()

        const data = await db.userBMI.create({
            data: {
                user_id: userId,
                user_height: parseInt(request.user_height),
                user_weight: parseInt(request.user_weight),
                user_age: parseInt(request.user_age),
                user_bmi_date: request.user_bmi_date,
                user_bmi_value: request.user_bmi_value,
                user_gender: request.user_gender,
            }
        })

        if(!data){
            return NextResponse.json(createResponse(500, "Error creating BMI data", null), {status: 500})
        }
        else{
            return NextResponse.json(createResponse(201, "Create data succesful!", data), {status: 201})
        }
    } catch (error) {
        return NextResponse.json(createResponse(500, "Internal Server Error", null), {status: 500})
    }
}

export async function GET(req: Request){
    try {
        const {userId} = auth()
        if(!userId){
            return NextResponse.json(createResponse(401, "Unauthorized", null), {status: 401})
        }

        const bmiData = await db.userBMI.findFirst({
            where: {
                user_id: userId,
            },
            orderBy:{
                user_bmi_date: 'desc'
            }
        })

        if(!bmiData){
            return NextResponse.json(createResponse(200, "No existing data", null), {status: 200}) //belum ada data user
        }
        else{
            return NextResponse.json(createResponse(200, "Fetch data succesful!", bmiData), {status: 200})
        }
    } catch (error) {
        return NextResponse.json(createResponse(500, "Internal Server Error", null), {status: 500})
    }
}
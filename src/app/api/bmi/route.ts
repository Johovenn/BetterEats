import { createResponse } from "@/lib/api";
import { calculateTDEE, calculateCarbs, calculateFat, calculateProtein } from "@/lib/tdeeUtils";
import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request){
    try {
        const {userId} = auth()
        if(!userId){
            return NextResponse.json(createResponse(401, "Unauthorized", null), {status: 401})
        }

        const {
            user_height,
            user_weight,
            user_age,
            user_bmi_value,
            user_gender = 'M'
        } = await req.json()

        const data = await db.userBMI.create({
            data: {
                user_id: userId,
                user_height: parseInt(user_height),
                user_weight: parseInt(user_weight),
                user_age: parseInt(user_age),
                user_bmi_value: parseFloat(user_bmi_value),
                user_gender: user_gender,
            }
        })

        if(!data){
            return NextResponse.json(createResponse(500, "Error creating BMI data", null), {status: 500})
        }
        else{
            return NextResponse.json(createResponse(201, "Create data succesful!", data), {status: 201})
        }
    } catch (error) {
        console.error(error)
        return NextResponse.json(createResponse(500, "Something went wrong, please try again.", null), {status: 500})
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
            return NextResponse.json(createResponse(200, "No existing data", {
                user_bmi_value: 0
            }), {status: 200})
        }
        else{
            return NextResponse.json(createResponse(200, "Fetch data succesful!", bmiData), {status: 200})
        }
    } catch (error) {
        return NextResponse.json(createResponse(500, "Internal Server Error", null), {status: 500})
    }
}
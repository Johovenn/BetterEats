import { createResponse } from "@/lib/api"
import { calculateBMI } from "@/lib/bmiUtils"
import db from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function POST(req: Request){
    try {
        const {userId} = auth()
        if(!userId){
            return NextResponse.json(createResponse(401, "Unauthorized", null), {status: 401})
        }

        const request = await req.json()

        const bmiValue = calculateBMI({
            user_weight: request.user_weight,
            user_height: request.user_height,
            user_age: request.user_age,
            user_gender: request.user_gender,
        })

        if(!bmiValue){
            return NextResponse.json(createResponse(500, "Error calculating BMI data", null), {status: 500})
        }

        const result = {
            bmi_value: bmiValue,
        }
        return NextResponse.json(createResponse(200, "Calculate BMI succesful!", result), {status: 200})
    } catch (error) {
        return NextResponse.json(createResponse(500, "Internal Server Error", null), {status: 500})
    }
}
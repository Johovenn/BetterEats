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

        const request = await req.json()

        const activityLevelCode = request.activity_level_code
        const goalCode = request.goal_code

        if(!activityLevelCode || !goalCode){
            return NextResponse.json(createResponse(400, "Bad Request", null), {status: 400})
        }

        const activityLevelData = await db.activityLevel.findFirst({
            where: {
                activity_level_code: activityLevelCode
            }    
        })

        if(!activityLevelData){
            return NextResponse.json(createResponse(400, "Activity Level Invalid", null), {status: 400})
        }

        const goalData = await db.goal.findFirst({
            where: {
                goal_code: goalCode
            }
        })
        if(!goalData){
            return NextResponse.json(createResponse(400, "Goal Invalid", null), {status: 400})
        }

        const data = await db.userTDEE.create({
            data: {
                user_id: userId,
                user_height: parseInt(request.user_height),
                user_weight: parseInt(request.user_weight),
                user_age: parseInt(request.user_age),
                user_tdee_date: request.user_tdee_date,
                user_tdee_value: request.user_tdee_value,
                protein: request.protein,
                carbohydrate: request.carbohydrate,
                fat: request.fat,
                activity_level_id: activityLevelData.activity_level_id,
                goal_id: goalData.goal_id,
                user_gender: request.user_gender,
            }
        })

        if(!data){
            return NextResponse.json(createResponse(500, "Error creating TDEE data", null), {status: 500})
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

        const tdeeData = await db.userTDEE.findFirst({
            where: {
                user_id: userId,
            },
            include: {
                goal: true,
                activityLevel: true
            },
            orderBy:{
                user_tdee_date: 'desc'
            }
        })

        if(!tdeeData){
            return NextResponse.json(createResponse(200, "No existing data", null), {status: 200}) //belum ada data user
        }
        else{
            let response = {
                ...tdeeData,
                goal_code: tdeeData.goal.goal_code,
                activity_level_code: tdeeData.activityLevel.activity_level_code
            }

            return NextResponse.json(createResponse(200, "Fetch data succesful!", response), {status: 200})
        }
    } catch (error) {
        return NextResponse.json(createResponse(500, "Internal Server Error", null), {status: 500})
    }
}
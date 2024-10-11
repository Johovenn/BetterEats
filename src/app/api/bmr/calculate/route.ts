import { createResponse } from "@/lib/api"
import { calculateBMR, calculateCarbs, calculateFat, calculateProtein } from "@/lib/bmrUtils"
import db from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function POST(req: Request){ //create new bmr record
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

        const bmrValue = calculateBMR({
            user_weight: request.user_weight,
            user_height: request.user_height,
            user_age: request.user_age,
            user_gender: request.user_gender,
            activity_level_multiplier: activityLevelData.activity_level_multiplier,
            goal_calorie_multiplier: goalData.goal_calorie_multiplier
        })
        const proteinGrams = calculateProtein(bmrValue, goalData.goal_protein_multiplier)
        const fatGrams = calculateFat(bmrValue, goalData.goal_fat_multiplier)
        const carbsGrams = calculateCarbs(bmrValue, goalData.goal_carbohydrate_multiplier)

        if(!bmrValue || !proteinGrams || !fatGrams || !carbsGrams){
            return NextResponse.json(createResponse(500, "Error calculating BMR data", null), {status: 500})
        }

        const result = {
            bmr_value: bmrValue,
            protein: proteinGrams,
            fat: fatGrams,
            carbohydrate: carbsGrams
        }
        return NextResponse.json(createResponse(200, "Calculate BMR succesful!", result), {status: 200})
    } catch (error) {
        return NextResponse.json(createResponse(500, "Internal Server Error", null), {status: 500})
    }
}
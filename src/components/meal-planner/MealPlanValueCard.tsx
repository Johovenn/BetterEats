import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import MealPlanNutritionProgress from "./MealPlanNutritionProgress"
import { Button } from "../ui/button"
import { cn } from "@/lib/utils"
import { ReactNode, useState } from "react"
import DateInput from "../form/DatePicker"
import DatePicker from "../form/DatePicker"

interface MealPlanValueProps{
    title?: string | ReactNode
    date: Date
    maxCalorie: number
    calorieValue: number
    maxProtein: number
    proteinValue: number
    maxCarbohydrate: number
    carbohydrateValue: number
    maxFat: number
    fatValue: number
    disableChangeDate?: boolean
    handleChangeDate: (date: Date) => void
    className?: string
}

export default function MealPlanValueCard(props: MealPlanValueProps){
    return(
        <div className={cn("h-[320px] shadow-lg bg-white rounded-lg px-7 py-5 min-w-min", props.className)}>
            <div className="flex justify-between items-center gap-5">
                <h3 className="font-medium text-lg">{props.title ? props.title : "Meal Plan Value"}</h3>
                {
                    !props.disableChangeDate
                        &&
                    <DatePicker
                        dateValue={props.date}
                        onDateChange={(date: Date) => props.handleChangeDate(date)}
                    />
                }
            </div>
            <div className="mt-5 flex flex-col gap-4">  
                <MealPlanNutritionProgress 
                    nutritionName="Calories"    
                    nutritionValue={props.calorieValue}
                    maxValue={props.maxCalorie}
                />
                <MealPlanNutritionProgress 
                    nutritionName="Protein"
                    nutritionValue={props.proteinValue}
                    maxValue={props.maxProtein}
                />
                <MealPlanNutritionProgress 
                    nutritionName="Carbohydrate"
                    nutritionValue={props.carbohydrateValue}
                    maxValue={props.maxCarbohydrate}
                />
                <MealPlanNutritionProgress 
                    nutritionName="Fat"
                    nutritionValue={props.fatValue}
                    maxValue={props.maxFat}
                />
            </div>
        </div>
    )
}
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import MealPlanNutritionProgress from "./MealPlanNutritionProgress"
import { Button } from "../ui/button"
import { cn } from "@/lib/utils"
import { ReactNode, useState } from "react"
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
        <div className={cn("shadow-lg bg-white rounded-lg px-4 sm:px-5 py-4 w-full", props.className)}>
            <div className="flex justify-between items-start gap-3 sm:gap-5">
                <h3 className="font-medium text-base sm:text-lg">{props.title ? props.title : "Meal Plan Value"}</h3>
                {
                    !props.disableChangeDate
                        &&
                    <DatePicker
                        dateValue={props.date}
                        onDateChange={(date: Date) => props.handleChangeDate(date)}
                    />
                }
            </div>
            <div className="mt-4 sm:mt-5 flex flex-col gap-3 sm:gap-4">  
                <MealPlanNutritionProgress 
                    nutritionName="Calories"    
                    nutritionValue={props.calorieValue}
                    maxValue={props.maxCalorie | 0}
                    className="[&>*]:bg-gradient-to-r from-[#8FD694] to-[#8FD694]"
                />
                <MealPlanNutritionProgress 
                    nutritionName="Protein"
                    nutritionValue={props.proteinValue}
                    maxValue={props.maxProtein | 0}
                    className="[&>*]:bg-gradient-to-r from-[#71B340] to-[#71B340]"
                />
                <MealPlanNutritionProgress 
                    nutritionName="Carbohydrate"
                    nutritionValue={props.carbohydrateValue}
                    maxValue={props.maxCarbohydrate | 0}
                    className="[&>*]:bg-gradient-to-r from-[#669D31] to-[#669D31]"
                />
                <MealPlanNutritionProgress 
                    nutritionName="Fat"
                    nutritionValue={props.fatValue}
                    maxValue={props.maxFat | 0}
                    className="[&>*]:bg-gradient-to-r from-[#598B2C] to-[#598B2C]"
                />
            </div>
        </div>
    )
}
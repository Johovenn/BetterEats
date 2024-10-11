import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import MealPlanNutritionProgress from "./MealPlanNutritionProgress"
import { Button } from "../ui/button"
import { cn } from "@/lib/utils"

interface MealPlanValueProps{
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
    handleChangeDate?: (date: Date) => void
}

export default function MealPlanValueCard(props: MealPlanValueProps){

    const options: Intl.DateTimeFormatOptions = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    }
    const formattedDate = props.date.toLocaleDateString('en-US', options)

    const handleOnClickPreviousDate = () => {
        if (props.handleChangeDate) {
            const previousDate = new Date(props.date)
            previousDate.setDate(previousDate.getDate() - 1)
            props.handleChangeDate(previousDate)
        }
    }
    
    const handleOnClickNextDate = () => {
        if (props.handleChangeDate) {
            const nextDate = new Date(props.date)
            nextDate.setDate(nextDate.getDate() + 1)
            props.handleChangeDate(nextDate)
        }
    }

    return(
        <div className="w-[500px] h-[310px] shadow-lg bg-white rounded-xl px-7 py-5">
            <div className="flex justify-between">
                <h3 className="font-medium text-xl">Meal Plan Value</h3>
                <div className="flex items-center gap-2">
                    <Button variant={"outline"} size={"icon"} onClick={handleOnClickPreviousDate} className={cn(props.disableChangeDate ? "hidden" : "")}>
                        <ChevronLeft size={20} color="gray"/>
                    </Button>
                    {formattedDate}
                    <Button variant={"outline"} size={"icon"} onClick={handleOnClickNextDate} className={cn(props.disableChangeDate ? "hidden" : "")}>
                        <ChevronRight size={20} color="gray"/>
                    </Button>
                </div>
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
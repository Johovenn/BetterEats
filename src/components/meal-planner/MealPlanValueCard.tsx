import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import MealPlanNutritionProgress from "./MealPlanNutritionProgress"
import { Button } from "../ui/button"

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
}

export default function MealPlanValueCard(props: MealPlanValueProps){

    const options: Intl.DateTimeFormatOptions = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    }
    const formattedDate = props.date.toLocaleDateString('en-US', options)

    return(
        <div className="w-[500px] h-[310px] shadow-lg bg-white rounded-xl px-7 py-5">
            <div className="flex justify-between">
                <h3 className="font-medium text-xl">Meal Plan Value</h3>
                <div className="flex items-center gap-2">
                    {/* <Button variant={"outline"}> */}
                        <ChevronLeft size={20} color="gray"/>
                    {/* </Button> */}
                    {formattedDate}
                    {/* <Button variant={"outline"}> */}
                        <ChevronRight size={20} color="gray"/>
                    {/* </Button> */}
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
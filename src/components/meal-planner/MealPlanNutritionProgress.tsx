import { Info } from "lucide-react"
import HoverTooltip from "../Tooltip"
import { Progress } from "../ui/progress"
import { cn } from "@/lib/utils"

interface MealPlanNutritionProgressProps{
    nutritionName: string
    nutritionValue: number
    maxValue: number
    className?: string
}

export default function MealPlanNutritionProgress(props: MealPlanNutritionProgressProps){
    return(
        <div>
            <div className="mb-1 flex items-center">
                <p className="mr-2 text-sm">
                    <span className="font-medium">{props.nutritionName}</span>: {props.nutritionValue} / {props.maxValue}
                </p>
                <HoverTooltip
                    tooltipContent={
                        props.nutritionValue > props.maxValue
                        ? `The total amount of ${props.nutritionName} in the meal plan has surpassed your daily needs`
                        : props.nutritionValue * 100 / props.maxValue < 80
                        ? `The total amount of ${props.nutritionName} in the meal plan is not enough for your daily needs.`
                        : `The total amount of ${props.nutritionName} in the meal plan is already enough for your daily needs.` 
                    }
                >
                    <Info size={14}></Info>
                </HoverTooltip>
            </div>
            <Progress 
                value={Math.min(props.nutritionValue / props.maxValue * 100, 100)}
                className={cn("bg-slate-200", props.className)}
                // className={
                //     props.nutritionValue > props.maxValue 
                //     ? '[&>*]:bg-gradient-to-r from-red-500 to-red-700 bg-slate-200' 
                //     : props.nutritionValue * 100 / props.maxValue < 80 
                //     ? '[&>*]:bg-gradient-to-r from-yellow-400 to-yellow-600 bg-slate-200' 
                //     : '[&>*]:bg-gradient-to-r from-green-400 to-green-600 bg-slate-200'
                // }
            />                    
        </div>
    )
}
import { Beef, Droplet, Ellipsis, Flame, Sunrise, Wheat } from "lucide-react";
import { CldImage } from "next-cloudinary";
import { MealPlanQuoteProps } from "@/app/(app)/community/api/getAllPosts";
import QuotedMeal from "./QuotedMeal";
interface QuotedMealPlanProps{
    mealPlanDetail?: {
        breakfast: MealPlanQuoteProps[]
        lunch: MealPlanQuoteProps[]
        dinner: MealPlanQuoteProps[]
        snack: MealPlanQuoteProps[]
    }
    mealPlanDate: string
    totalCalories: number
    totalProtein: number
    totalCarbs: number
    totalFat: number
}

export default function QuotedMealPlan(props: QuotedMealPlanProps){
    const date = new Date(props.mealPlanDate)
        
    const options: Intl.DateTimeFormatOptions = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    }
    const formattedDate = date.toLocaleDateString('en-US', options)

    return(
        <div className="min-w-full border-2 rounded-lg border-gray-300 px-2 py-1 hover:bg-gray-200 hover:cursor-pointer transition-all">
            <div className="flex items-center justify-between gap-3">
                <span className="font-medium text-sm">Meal plan</span>
                <span className="text-xs text-gray-400">{`${formattedDate}`}</span>
            </div>
            <div className="flex justify-around items-center mt-1">
                <span className="text-xs text-black flex item-center gap-1"><Flame size={18} color="#b53a31"/>{props.totalCalories} calories</span>
                <span className="text-xs text-black flex item-center gap-1"><Beef size={18} color="#6e0e07"/>{props.totalProtein}g protein</span>
                <span className="text-xs text-black flex item-center gap-1"><Wheat size={18} color="#f2a929"/>{props.totalCarbs}g carbs</span>
                <span className="text-xs text-black flex item-center gap-1"><Droplet size={18} color="#bd7006"/>{props.totalFat}g fat</span>
            </div>
            {
                props.mealPlanDetail?.breakfast
                    &&
                props.mealPlanDetail.breakfast.map((meal) => (
                    <QuotedMeal 
                        key={meal.meal_id}
                        type="breakfast"
                        data={meal}
                    />
                ))
            }
            {
                props.mealPlanDetail?.lunch
                    &&
                props.mealPlanDetail.lunch.map((meal) => (
                    <QuotedMeal 
                        key={meal.meal_id}
                        type="lunch"
                        data={meal}
                    />
                ))
            }
            {
                props.mealPlanDetail?.snack
                    &&
                props.mealPlanDetail.snack.map((meal) => (
                    <QuotedMeal 
                        key={meal.meal_id}
                        type="snack"
                        data={meal}
                    />
                ))
            }
            {
                props.mealPlanDetail?.dinner
                    &&
                props.mealPlanDetail.dinner.map((meal) => (
                    <QuotedMeal 
                        key={meal.meal_id}
                        type="dinner"
                        data={meal}
                    />
                ))
            }
        </div>
    )
}
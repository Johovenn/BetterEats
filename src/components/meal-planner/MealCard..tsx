import Image from "next/image"
import { Badge } from "../ui/badge"
import MealBadge from "./MealBadge"
import { Beef, Droplet, Flame, Wheat } from "lucide-react"
import { Button } from "../ui/button"
import { Separator } from "@radix-ui/react-separator"
import { MealProps } from "@/app/search/api/getAllMeals"
import { getMealPlanTotalNutrition } from "@/app/meal-planner/api/getMealPlanTotalNutrition"

interface MealCardProps{
    meal: MealProps
}

export default function MealCard(props: MealCardProps){
    const handleClick = async () => {
        await getMealPlanTotalNutrition(new Date)
    }

    return(
        <div className="w-full h-[100px] bg-white shadow-lg flex items-center px-3 rounded-xl">
            <div className="relative w-[80px] h-[80px]">
                <Image 
                    // src={props.meal.imageUrl ? props.meal.imageUrl : '/placeholder.jpeg'} 
                    src={'/placeholder.jpeg'} 
                    alt="placeholder" 
                    layout="fill"
                    objectFit="cover"
                    className="rounded-xl"
                /> 
            </div>
            <div className="ml-3 flex items-center justify-between w-full">
                <div className="flex flex-col space-y-3">
                    <div className="flex items-center gap-3">
                        <p className="text-xl font-medium">{props.meal.meal_name}</p>
                        {/* <MealBadge text={props.meal.mealType ? props.meal.mealType : 'Unknown'}/> */}

                        {props.meal.is_breakfast && <MealBadge text="Breakfast"/>}
                        {props.meal.is_lunch && <MealBadge text="Lunch"/>}
                        {props.meal.is_dinner && <MealBadge text="Dinner"/>}
                        {props.meal.is_snack && <MealBadge text="Snack"/>}
                    </div>
                    <div className="flex items-center">
                        <p className="text-sm text-gray-600 flex item-center w-[130px] gap-1"><Flame size={18} /> {props.meal.meal_calories} calories</p>
                        <p className="text-sm text-gray-600 flex item-center w-[110px] gap-1"><Beef size={18} /> {props.meal.meal_protein} protein</p>
                        <p className="text-sm text-gray-600 flex item-center w-[150px] gap-1"><Wheat size={18} /> {props.meal.meal_carbohydrate} carbohyrate</p>
                        <p className="text-sm text-gray-600 flex item-center w-[80px] gap-1"><Droplet size={18} /> {props.meal.meal_fat} fat</p>
                    </div>
                </div>
                <div className="mr-1 flex items-center gap-3">
                    <Button className="" variant={"outline"}>Info</Button>
                    <Button className="" onClick={handleClick}>Add to meal plan</Button>
                </div>
            </div>
        </div>
    )
}  
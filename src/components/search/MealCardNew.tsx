import Image from "next/image"
import { Badge } from "../ui/badge"
import { Beef, Droplet, Ellipsis, Flame, Star, Wheat } from "lucide-react"
import { Button } from "../ui/button"
import { Separator } from "@radix-ui/react-separator"
import { CldImage } from 'next-cloudinary'
import { MealProps } from "@/app/(app)/search/api/getAllMeals"
import Menu from "../Menu"
import { MealPlanDetailProps } from "@/app/(app)/meal-planner/api/getMealPlan"
import MealBadge from "../meal-planner/MealBadge"
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import StarOutlinedIcon from '@mui/icons-material/StarOutlined';

interface MealCardNewProps{
    meal: MealProps | MealPlanDetailProps
    mode: "search" | "meal-plan" | "admin"
    handleInfoButton: (id: number) => void
    handleAddMealButton?: (meal: MealProps) => void
    updateMeal: (meal_id: number) => void
    removeMeal: (meal_id: number) => void
}

export default function MealCardNew(props: MealCardNewProps){
    return(
        <div className="w-[260px] bg-white rounded-lg shadow-lg hover:cursor-pointer">
            <div onClick={() => props.handleInfoButton(props.meal.meal_id)}>
                <div className="w-[260px] h-[150px] px-3 pt-3">
                    <CldImage 
                        src={props.meal.meal_image}
                        width={500}
                        height={500}
                        alt={props.meal.meal_name}
                        className="object-cover rounded-t-lg z-10 w-full h-full"
                        crop={"fill"}
                    />
                </div>
                <div className="w-full px-3">
                    <div className="mt-1 flex items-center justify">
                        <p className="font-medium w-[250px] line-clamp-1">{props.meal.meal_name}</p>
                        {
                            props.meal.is_favorite 
                                ?
                            <div onClick={(e) => {
                                e.stopPropagation()
                                props.removeMeal(props.meal.meal_id)
                            }}>
                                <StarOutlinedIcon className="text-yellow-500 hover:text-yellow-200 transition-all hover:cursor-pointer"/>
                            </div>
                                :
                            <div onClick={(e) => {
                                e.stopPropagation()
                                props.updateMeal(props.meal.meal_id)
                            }}>
                                <StarBorderOutlinedIcon className="hover:cursor-pointer hover:text-yellow-500 transition-all"/>
                            </div> 
                        }
                    </div>
                    <div className="mb-2 space-x-1">
                        {props.meal.is_breakfast && <MealBadge text="Breakfast"/>}
                        {props.meal.is_lunch && <MealBadge text="Lunch"/>}
                        {props.meal.is_dinner && <MealBadge text="Dinner"/>}
                        {props.meal.is_snack && <MealBadge text="Snack"/>}
                    </div>
                    <div className="flex items-center gap-4">
                        <p className="text-sm text-black flex item-center gap-1"><Flame size={18} color="#b53a31"/> {props.meal.meal_calories}</p>
                        <p className="text-sm text-black flex item-center gap-1"><Beef size={18} color="#6e0e07"/> {props.meal.meal_protein}</p>
                        <p className="text-sm text-black flex item-center gap-1"><Wheat size={18} color="#f2a929"/> {props.meal.meal_carbohydrate}</p>
                        <p className="text-sm text-black flex item-center gap-1"><Droplet size={18} color="#bd7006"/> {props.meal.meal_fat}</p>
                    </div>
                </div>
            </div>
            <div className="px-3 mt-2 mb-3">
                <Button 
                    className="w-full"
                    onClick={() => props.handleAddMealButton ? props.handleAddMealButton(props.meal) : () => {}}
                >
                    Add to Meal Plan
                </Button>
            </div>
        </div>
    )
}  
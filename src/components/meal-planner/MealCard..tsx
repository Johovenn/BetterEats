import Image from "next/image"
import { Badge } from "../ui/badge"
import MealBadge from "./MealBadge"
import { Beef, Droplet, Flame, Wheat } from "lucide-react"
import { Button } from "../ui/button"


interface MealCardProps{
    imageUrl?: string
    mealName: string
    calories: number
    carbs: number
    protein: number
    fat: number
    mealType?: string
}

export default function MealCard(props: MealCardProps){
    return(
        <div className="w-full h-[100px] bg-white shadow-lg flex items-center px-3 rounded-xl">
            <div className="relative w-[80px] h-[80px]">
                <Image 
                    src={props.imageUrl ? props.imageUrl : '/placeholder.jpeg'} 
                    alt="placeholder" 
                    layout="fill"
                    objectFit="cover"
                    className="rounded-xl"
                /> 
            </div>
            <div className="ml-3 flex items-center justify-between w-full">
                <div className="flex flex-col space-y-3">
                    <p className="text-xl font-medium">{props.mealName}</p>
                    <div className="flex items-center">
                        <p className="text-sm text-gray-600 flex item-center w-[130px] gap-1"><Flame size={18} color="red"  /> {props.calories} calories</p>
                        <p className="text-sm text-gray-600 flex item-center w-[110px] gap-1"><Beef size={18} color="orange"/> {props.protein} protein</p>
                        <p className="text-sm text-gray-600 flex item-center w-[150px] gap-1"><Wheat size={18} color="green"/> {props.carbs} carbohyrate</p>
                        <p className="text-sm text-gray-600 flex item-center w-[80px] gap-1"><Droplet size={18} color="blue"/> {props.fat} fat</p>
                    </div>
                </div>
                <div className="mr-1 flex items-center">
                    <Button className="">Add to meal plan</Button>
                </div>
            </div>
        </div>
    )
}  
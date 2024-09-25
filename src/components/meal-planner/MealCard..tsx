import Image from "next/image"
import { Badge } from "../ui/badge"
import MealBadge from "./MealBadge"


interface MealCardProps{
    imageUrl?: string
    title: string
    calories: number
    mealType?: string
}

export default function MealCard(props: MealCardProps){
    return(
        <div className="p-2 shadow border rounded-lg">
            <div>
                <Image src={props.imageUrl ? props.imageUrl : "placeholder.svg"} alt={props.title} className="" width={220} height={150}/>
            </div>
            <div className="flex justify-between items-start mt-2">
                <div>
                    <h4 className="text-xl font-medium">{props.title}</h4>
                    <p className="text-gray-400 mt-1">Calories: {props.calories} calories</p>
                </div>
                <MealBadge text={props.mealType ? props.mealType : 'Unknown'}/>
            </div>
        </div>
    )
}  
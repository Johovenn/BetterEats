import { cn } from "@/lib/utils"
import { Badge } from "../ui/badge"

interface MealBadgeProps{
    text: string
}

export default function MealBadge(props: MealBadgeProps){
    let color = ''
    if(props.text === 'Breakfast'){
        color = 'bg-green-600 hover:bg-green-700'
    }
    else if(props.text === 'Lunch'){
        color = 'bg-yellow-600 hover:bg-yellow-700'
    }
    else if(props.text === 'Dinner'){
        color = 'bg-blue-500 hover:bg-blue-600 '
    }

    return(
        <Badge className={cn(color, "text-white")}>{props.text}</Badge>
    )
}
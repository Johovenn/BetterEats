import { cn } from "@/lib/utils"
import { Badge } from "../ui/badge"

interface MealBadgeProps{
    text: string
}

export default function MealBadge(props: MealBadgeProps){
    let color = ''
    if(props.text === 'Breakfast'){
        color = 'bg-[#FF9B50] hover:bg-[#FF9B50]/80'
    }
    else if(props.text === 'Lunch'){
        color = 'bg-[#E25E3E] hover:bg-[#E25E3E]/80'
    }
    else if(props.text === 'Dinner'){
        color = 'bg-[#C63D2F] hover:bg-[#C63D2F]/80'
    }
    else if(props.text === 'Snack'){
        color = 'bg-[#FFBB5C] hover:bg-[#FFBB5C]/80'
    }

    return(
        <Badge className={cn(color, "text-white text-[10px]")}>{props.text}</Badge>
    )
}
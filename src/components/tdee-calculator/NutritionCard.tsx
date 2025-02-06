import { ReactNode } from "react";


interface NutritionCardProps{
    icon: ReactNode
    title: string
    value: number | null | undefined
}

export default function NutritionCard(props: NutritionCardProps){
    return(
        <div className="w-[65px] p-3 shadow-xl rounded-lg flex flex-col items-center bg-[#f4f4f4]">
            {props.icon}
            <p className="text-md">{props.value}g</p>
            <p className="text-xs">{props.title}</p>
        </div>
    )
}
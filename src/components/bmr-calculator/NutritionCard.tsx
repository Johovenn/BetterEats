import { ReactNode } from "react";


interface NutritionCardProps{
    icon: ReactNode
    title: string
    value: number | null | undefined
}

export default function NutritionCard(props: NutritionCardProps){
    return(
        <div className="w-[80px] p-3 shadow-xl rounded flex flex-col items-center bg-paper-default ">
            {props.icon}
            <p className="text-xl">{props.value}g</p>
            <p className="text-md">{props.title}</p>
        </div>
    )
}
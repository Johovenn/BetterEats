import { InfoIcon } from "lucide-react";
import HoverTooltip from "../Tooltip";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

interface TotalMealCardProps{
    totalMeals: number
    className?: string
}


export default function TotalMealCard(props: TotalMealCardProps){
    return(
        
        <div className={cn('h-[285px] bg-white shadow-lg rounded-xl border p-3 flex flex-col', props.className)}>
            <div className="flex items-center justify-between gap-1 mb-4">
                <h1 className="text-lg font-medium">
                    Total Meals
                </h1>
                <HoverTooltip
                    tooltipContent={'The number of meals in the database'}
                >
                    <InfoIcon size={15} color="gray"></InfoIcon>
                </HoverTooltip>
            </div>
            
            <div className="bg-gradient-to-b from-slate-200 to-green-primary w-[180px] h-[180px] rounded-full flex justify-center items-center mx-auto">
                <div className="rounded-full w-[140px] h-[140px] p-4 text-center flex flex-col justify-center mx-auto my-auto bg-white">
                    <span className="text-2xl font-bold">{props.totalMeals}</span>
                    <span className="text-md text-slate-500 font-medium">meals</span>
                </div>
            </div>
        </div>
    )
}
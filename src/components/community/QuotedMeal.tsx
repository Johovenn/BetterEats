import { MealPlanQuoteProps } from "@/app/(app)/community/api/getAllPosts";
import { Beef, Droplet, Eclipse, Flame, Sun, Sunrise, Sunset, Wheat } from "lucide-react";
import { CldImage } from "next-cloudinary";


interface QuotedMealProps{
    type: string
    data: MealPlanQuoteProps
}

export default function QuotedMeal(props: QuotedMealProps){
    return(
        
        <div className="w-full flex items-center justify-center mt-1 mb-3 gap-3">
            <div>
                {props.type === 'breakfast' && <Sunrise size={20} color="#b53a31"/>}
                {props.type === 'lunch' && <Sun size={20} color="#b53a31"/>}
                {props.type === 'dinner' && <Eclipse size={20} color="#b53a31"/>}
                {props.type === 'snack' && <Sunset size={20} color="#b53a31"/>}
                
            </div>
            <div className="flex items-center gap-3">
                <div className="w-[60px] h-[60px]">
                    <CldImage 
                        src={props.data.meal_image}
                        width={110}
                        height={110}
                        alt={'test'}
                        className="object-cover rounded-lg my-1 z-10"
                        crop={"fill"}
                        gravity="center"
                    />
                </div>
                <div className="mr-3">
                    <p className="text-sm">{props.data.meal_name}</p>
                    <div className="flex items-center gap-3">
                        <span className="text-xs text-black flex item-center gap-1"><Flame size={18} color="#b53a31"/>{props.data.meal_calories}</span>
                        <span className="text-xs text-black flex item-center gap-1"><Beef size={18} color="#6e0e07"/>{props.data.meal_protein}</span>
                        <span className="text-xs text-black flex item-center gap-1"><Wheat size={18} color="#f2a929"/>{props.data.meal_carbohydrate}</span>
                        <span className="text-xs text-black flex item-center gap-1"><Droplet size={18} color="#bd7006"/>{props.data.meal_fat}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
import { CircleAlert, Info, InfoIcon, Router } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"
import { Button } from "../ui/button"
import { Separator } from "../ui/separator"
import { useRouter } from "next/navigation"
import HoverTooltip from "../Tooltip"

interface BMRCardProps{
    bmrValue: number
}

export default function BMRCard(props: BMRCardProps){
    const router = useRouter()

    const handleUpdateButton = () => {
        router.push(`/bmr-calculator`)
    }

    return(
        <div className="w-[280px] h-[170px] bg-white shadow-lg rounded-xl border p-3 flex flex-col">
            <div className="flex items-center justify-between gap-1 mb-4">
                <h1 className="text-lg font-medium">
                    Basal Metabolic Rate
                </h1>
                <HoverTooltip
                    tooltipContent={
                        props.bmrValue !== 0
                            ?
                        "This BMR value will be used to create food recommendations for you."
                            :
                        "You haven't calculated your BMR yet, please go to the BMR Calculator page."
                    }
                >
                    {
                        props.bmrValue !== 0
                            ? 
                        <InfoIcon size={15} color="gray"></InfoIcon>
                            :
                        <CircleAlert size={15} color="red"></CircleAlert>
                    }
                </HoverTooltip>
            </div>

            <p className="text-5xl font-semibold text-right">{props.bmrValue} <span className="text-lg font-medium">Calories</span></p>

            <Button 
                className="ml-auto mt-auto"
                onClick={handleUpdateButton}
            >
                Update
            </Button>
        </div>

        
    )
}
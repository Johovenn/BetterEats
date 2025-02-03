import { CircleAlert, Info, InfoIcon, Router } from "lucide-react"
import { Button } from "../ui/button"
import { Separator } from "../ui/separator"
import { useRouter } from "next/navigation"
import HoverTooltip from "../Tooltip"
import { cn } from "@/lib/utils"

interface BMRCardProps{
    bmrValue: number
    className?: string
}

export default function BMRCard(props: BMRCardProps){
    const router = useRouter()

    const handleUpdateButton = () => {
        router.push(`/health-calculator`)
    }

    return(
        <div className={cn('h-[240px] lg:h-[285px] w-full bg-white shadow-lg rounded-xl border p-3 flex flex-col', props.className)}>
            <div className="flex items-center justify-between gap-1 mb-4">
                <h1 className="lg:text-lg font-medium">
                    Total Daily Energy Expenditure
                </h1>
                <HoverTooltip
                    tooltipContent={
                        props.bmrValue !== 0
                            ?
                        "This BMR value will be used to create food recommendations for you."
                            :
                        "You haven't calculated your TDEE yet, please go to the TDEE Calculator page."
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
            
            <div className="bg-gradient-to-b from-slate-200 to-green-primary w-[140px] h-[140px] lg:w-[180px] lg:h-[180px] rounded-full flex justify-center items-center mx-auto">
                <div className="rounded-full w-[110px] h-[110px] lg:w-[140px] lg:h-[140px] p-4 text-center flex flex-col justify-center mx-auto my-auto bg-white">
                    <span className="text-2xl font-bold">{props.bmrValue}</span>
                    <span className="text-md text-slate-500 font-medium">kCal</span>
                </div>
            </div>

            <Button 
                className="ml-auto mt-auto"
                onClick={handleUpdateButton}
            >
                Update
            </Button>
        </div>
    )
}
import { Info, InfoIcon, Router } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"
import { Button } from "../ui/button"
import { Separator } from "../ui/separator"
import { useRouter } from "next/navigation"

interface BMRCardProps{
    bmrValue: number
}

export default function BMRCard(props: BMRCardProps){
    const router = useRouter()

    const handleUpdateButton = () => {
        router.push(`/bmr-calculator`)
    }

    return(
        <div className="w-[280px] h-[170px] bg-paper-default shadow-lg rounded-xl border p-3 flex flex-col">
            <div className="flex items-center justify-between gap-1">
                <h1 className="text-xl font-medium">
                    Basal Metabolic Rate
                </h1>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <InfoIcon size={15} color="gray"></InfoIcon>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="border rounded-lg bg-[#fafafa]">
                            <p className="text-sm text-gray-600">
                                This BMR value will be used to create
                                <br /> food recommendations for you.
                            </p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>

            <Separator className="h-4 text-red-500 w-5" orientation="horizontal"/>

            <p className="text-5xl font-semibold text-right">{props.bmrValue} <span className="text-lg font-medium">Calories</span></p>

            <Button 
                className="ml-auto mt-3"
                onClick={handleUpdateButton}
            >
                Update
            </Button>
        </div>

        
    )
}
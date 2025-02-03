import { ReactNode } from "react";
import { Tooltip, TooltipProvider } from "./ui/tooltip";
import { TooltipContent, TooltipTrigger } from "@radix-ui/react-tooltip";

interface HoverTooltipProps{
    children: ReactNode
    tooltipContent: string
}

export default function HoverTooltip(props: HoverTooltipProps){
    return(
        <TooltipProvider delayDuration={100}>
            <Tooltip>
                <TooltipTrigger asChild>
                    {props.children}
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={10} className="py-1 px-2 bg-paper-default border shadow-md rounded-lg text-sm w-[350px] z-50 max-lg:hidden">
                    {props.tooltipContent}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
import { format } from "date-fns"
import { useState } from "react"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface DateInputProps {
  dateValue: Date
  onDateChange: (date: Date) => void
  className?: string
}

export default function DatePicker(props: DateInputProps) {
    const [isOpen, setIsOpen] = useState(false)

    const handleDateSelect = (date: Date | undefined) => {
        if (date) {
            props.onDateChange(date)
            setIsOpen(false)
        }
    }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
            <Button
                variant={"outline"}
                className={cn(
                    "justify-start text-left max-sm:text-sm font-normal meal-plan-date-picker",
                    !props.dateValue && "text-muted-foreground",
                    props.className
                )}
                onClick={() => setIsOpen(true)}
            >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {props.dateValue ? format(props.dateValue, "PPP") : <span>Pick a date</span>}
            </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
            <Calendar
                mode="single"
                selected={props.dateValue}
                onSelect={handleDateSelect}
            />
        </PopoverContent>
    </Popover>
  )
}

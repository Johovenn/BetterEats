import { Control, Controller } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { cn } from "@/lib/utils"

interface NumericInputProps{
    control: Control<any, any>
    id: string
    label: string
    placeholder: string
    error?: string
    disabled?: boolean
    className?: string
    onBlur?: () => void
}
export default function NumericInput(props: NumericInputProps) {
    return (
        <Controller
            control={props.control}
            name={props.id}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{props.label}</FormLabel>
                    <FormControl>
                        <Input
                            type="number"
                            placeholder={props.placeholder}
                            disabled={props.disabled}
                            {...field}
                            onChange={(e) => {
                                const value = e.target.value;
                                field.onChange(value === '' ? value : Number(value));
                            }}
                            className={cn(
                                props.className,
                                "border border-gray-300 rounded-xl hover:border-green-primary transition-all focus:border-2 focus:border-green-primary focus:outline-none"
                            )}
                            onBlur={props.onBlur}
                        />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs">{props.error}</FormMessage>
                </FormItem>
            )}
        />
    );
}

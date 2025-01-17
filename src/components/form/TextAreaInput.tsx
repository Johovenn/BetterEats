import { Control } from "react-hook-form"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { cn } from "@/lib/utils"
import { HTMLAttributes, ReactNode } from "react"
import { Textarea } from "../ui/textarea"

interface TextAreaInputProps extends HTMLAttributes<HTMLInputElement>{
    control: Control<any, any>
    id: string
    placeholder: string
    label: string | ReactNode
    error?: string
    disabled?: boolean
    description?: string
}

export default function TextAreaInput(props: TextAreaInputProps){
    return(
        <FormField
            control={props.control}
            name={props.id}
            render={({field}) => (
                <FormItem>
                    <FormLabel>{props.label}</FormLabel>
                    <FormControl>
                        <Textarea
                            placeholder={props.placeholder} 
                            disabled={props.disabled} 
                            className={cn(
                                props.className, 
                                "border border-gray-300 rounded-xl hover:border-green-primary transition-all focus:border-2 focus:border-green-primary focus:outline-none"
                            )}
                            {...field}
                        />
                    </FormControl>
                    <FormDescription>
                        {props.description}
                    </FormDescription>
                    <FormMessage className="text-red-500 text-xs">{props.error}</FormMessage>
                </FormItem>
            )}
        />
    )
}
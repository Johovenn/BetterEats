import { Control } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Checkbox } from "../ui/checkbox";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface CheckboxInputProps{
    control: Control<any, any>
    id: string
    label: string | ReactNode
    classname?: string
    disabled?: boolean
}

export default function CheckboxInput(props: CheckboxInputProps){
    return(
        <FormField
            control={props.control}
            name={props.id}
            render={({ field }) => (
                <FormItem className={cn("flex flex-row items-start space-x-2 space-y-0", props.classname)}>
                    <FormControl>
                        <Checkbox
                            disabled={props.disabled}
                            checked={field.value}
                            onCheckedChange={field.onChange}
                        />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                        <FormLabel>
                            {props.label}
                        </FormLabel>
                    </div>
                </FormItem>
            )}
        />
    )
}
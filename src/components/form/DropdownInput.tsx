import { Control } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

interface DropdownInputProps{
    control: Control<any, any>
    id: string
    label: string
    placeholder: string
    options: any[]
    optionLabel: string
    optionValue: string
    error?: string
    disabled?: boolean
}

export default function DropdownInput(props: DropdownInputProps){
    return(
        <FormField
            control={props.control}
            name={props.id}
            render={({field}) => (
                <FormItem className="w-full">
                    <FormLabel className="text-sm">{props.label}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={props.disabled || props.options.length === 0}>
                        <FormControl>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder={props.placeholder} />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {props.options.length !== 0 &&
                                props.options.map((option) => (
                                    <SelectItem value={option[props.optionValue]} key={option[props.optionValue]}>
                                        {option[props.optionLabel]}
                                    </SelectItem>
                                ))
                            }
                        </SelectContent>
                    </Select>
                    <FormMessage className="text-xs">{props.error}</FormMessage>
                </FormItem>
            )}
        />
    )
}
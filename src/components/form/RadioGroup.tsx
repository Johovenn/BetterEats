import { Control } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { cn } from "@/lib/utils";

interface RadioInputProps{
    control: Control<any, any>
    id: string
    label: string
    inputValues: any[]
    radioId: string
    radioLabel: string
}

export default function RadioInput(props: RadioInputProps){
    return(
        <FormField
            control={props.control}
            name={props.id}
            render={({ field }) => (
                <FormItem className="space-y-2">
                    <FormLabel>
                        {props.label}
                    </FormLabel>
                    <FormControl>
                        <RadioGroup
                            value={field.value?.toString()}
                            onValueChange={(val) => field.onChange(val)}
                            defaultValue={field.value}
                            className="flex flex-wrap"
                        >
                            {
                                props.inputValues.length > 0
                                    ?
                                props.inputValues.map((radio) => (
                                    <FormItem className="flex items-center space-y-0" key={radio[props.radioId]}>
                                        <FormControl className="hidden sr-only">
                                            <RadioGroupItem value={radio[props.radioId]}/>
                                        </FormControl>
                                        <FormLabel 
                                            className={cn(
                                            "cursor-pointer px-4 py-2 border rounded-lg transition-colors duration-200",
                                            field.value === radio[props.radioId] ? "bg-green-primary text-white hover:bg-green-primary/80" : "bg-gray-200 text-black hover:bg-green-primary/20",
                                        )}>
                                            {radio[props.radioLabel]}
                                        </FormLabel>
                                    </FormItem>
                                ))
                                    :
                                <p className="text-lg font-medium">
                                    Loading..
                                </p>
                            }
                        </RadioGroup>
                    </FormControl>
                </FormItem>
            )}
        />
    )
}
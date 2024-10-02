import { Control } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

export interface RadioInputValues{
    label: string
    value: string
}

interface RadioInputProps{
    control: Control<any, any>
    id: string
    label: string
    inputValues: RadioInputValues[]
    orientation?: 'horizontal' | 'vertical'
}

export default function RadioInput(props: RadioInputProps){
    return(
        <FormField
            control={props.control}
            name={props.id}
            render={({ field }) => (
                <FormItem className="space-y-3">
                    <FormLabel>
                        {props.label}
                    </FormLabel>
                    <FormControl>
                        <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                            orientation={props.orientation ? props.orientation : 'horizontal'}
                        >
                            {
                                props.inputValues.map((radio) => (
                                    <FormItem className="flex items-center space-x-3 space-y-0" key={radio.value}>
                                        <FormControl>
                                            <RadioGroupItem value={radio.value}/>
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                            {radio.label}
                                        </FormLabel>
                                    </FormItem>
                                ))
                            }
                        </RadioGroup>
                    </FormControl>
                </FormItem>
            )}
        />
    )
}
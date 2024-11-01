import { Control } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { HTMLAttributes } from "react"

interface FileInputProps extends HTMLAttributes<HTMLElement> {
    control: Control<any, any>
    id: string
    label: string
    error?: string
    disabled?: boolean
    onFileChange: (file: File | null) => void
}

export default function FileInput(props: FileInputProps) {
    return (
        <FormField
            control={props.control}
            name={props.id}
            render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                    <FormLabel>{props.label}</FormLabel>
                    <FormControl>
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Input
                            {...fieldProps}
                            placeholder="Picture"
                            type="file"
                            accept="image/*"
                            onChange={(event) => {
                                const file = event.target.files?.[0] || null
                                onChange(file)
                                props.onFileChange(file)
                            }}
                        />
                        </div>
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm">{props.error}</FormMessage>
                </FormItem>
            )}
        />
    )
}

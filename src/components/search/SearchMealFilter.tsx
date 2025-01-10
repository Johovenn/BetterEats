import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTrigger } from "../ui/sheet";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "../ui/button";
import { FormProvider, UseFormReturn } from "react-hook-form";
import CheckboxInput from "../form/CheckboxInput";
import NumericInput from "../form/NumericInput";

interface SearchMealFilterProps{
    onConfirm: () => void
    onClear: () => void
    form: UseFormReturn<any>
}

export default function SearchMealFilter(props: SearchMealFilterProps){
    return(
        <Sheet>
            <SheetTrigger asChild>
            <Button variant={'outline'} className="gap-2 text-green-primary">
                Filter
                <SlidersHorizontal size={18}/>
            </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader className="text-xl font-semibold">Filter</SheetHeader>
                <SheetDescription>
                    Search for more specific meals.
                </SheetDescription>
                <div className="mt-4">
                    <FormProvider {...props.form}>
                        <form action="" className="">
                            <h2 className="text-md font-medium mt-1">Meal Type</h2>
                            <div className="flex flex-wrap gap-3 justify-between mt-2">
                                <CheckboxInput
                                    control={props.form.control}
                                    id="is_breakfast"
                                    label="Breakfast"
                                    classname="w-[110px]"
                                />
                                <CheckboxInput 
                                    control={props.form.control}
                                    id="is_lunch"
                                    label="Lunch"
                                    classname="w-[110px]"
                                />
                                <CheckboxInput 
                                    control={props.form.control}
                                    id="is_dinner"
                                    label="Dinner"
                                    classname="w-[110px]"
                                />
                                <CheckboxInput 
                                    control={props.form.control}
                                    id="is_snack"
                                    label="Snack"
                                    classname="w-[110px]"
                                />
                            </div>
                            <div className="mt-5">
                                <h2 className="text-md font-medium">Calorie Range</h2>
                                <div className="flex items-end gap-5">
                                    <NumericInput
                                        control={props.form.control}
                                        id="calorie_range_from"
                                        label="From"
                                        placeholder="Minimum Calorie"
                                        className=""
                                    />
                                    <span className="mb-3">To</span>
                                    <NumericInput
                                        control={props.form.control}
                                        id="calorie_range_to"
                                        label="To"
                                        placeholder="Maximum Calorie"
                                        className=""
                                    />
                                </div>
                            </div>
                            <div className="mt-3">
                                <h2 className="text-md font-medium">Protein Range</h2>
                                <div className="flex items-end gap-5">
                                    <NumericInput
                                        control={props.form.control}
                                        id="protein_range_from"
                                        label="From"
                                        placeholder="Minimum Protein"
                                        className=""
                                    />
                                    <span className="mb-3">To</span>
                                    <NumericInput
                                        control={props.form.control}
                                        id="protein_range_to"
                                        label="To"
                                        placeholder="Maximum Protein"
                                        className=""
                                    />
                                </div>
                            </div>
                            <div className="mt-3">
                                <h2 className="text-md font-medium">Carbohydrate Range</h2>
                                <div className="flex items-end gap-5">
                                    <NumericInput
                                        control={props.form.control}
                                        id="carbohydrate_range_from"
                                        label="From"
                                        placeholder="Minimum Carbohydrate"
                                        className=""
                                    />
                                    <span className="mb-3">To</span>
                                    <NumericInput
                                        control={props.form.control}
                                        id="carbohydrate_range_to"
                                        label="To"
                                        placeholder="Maximum Carbohydrate"
                                        className=""
                                    />
                                </div>
                            </div>
                            <div className="mt-3">
                                <h2 className="text-md font-medium">Fat Range</h2>
                                <div className="flex items-end gap-5">
                                    <NumericInput
                                        control={props.form.control}
                                        id="fat_range_from"
                                        label="From"
                                        placeholder="Minimum Fat"
                                        className=""
                                    />
                                    <span className="mb-3">To</span>
                                    <NumericInput
                                        control={props.form.control}
                                        id="fat_range_to"
                                        label="To"
                                        placeholder="Maximum Fat"
                                        className=""
                                    />
                                </div>
                            </div>
                        </form>
                    </FormProvider>
                </div>
                <SheetFooter className="mt-5 flex justify-between w-full">
                    <Button variant={'outline'} onClick={props.onClear}>Clear Filter</Button>
                    <SheetClose asChild>
                        <Button onClick={props.onConfirm}>Apply Filter</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
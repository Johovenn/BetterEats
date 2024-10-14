import { FormProvider, useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import MealPlanValueCard from "./MealPlanValueCard";
import { useCallback, useEffect, useState } from "react";
import { getMealPlanTotalNutrition } from "@/app/meal-planner/api/getMealPlanTotalNutrition";
import HoverTooltip from "../Tooltip";
import { Info, Router } from "lucide-react";
import DatePicker from "../form/DatePicker";
import DropdownInput from "../form/DropdownInput";
import { getMealType, MealTypeProps } from "@/app/search/api/getMealType";
import { postMealPlan } from "@/app/meal-planner/api/postMealPlan";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { MealProps } from "@/app/search/api/getAllMeals";

interface AddMealModalProps{
    isOpen: boolean
    handleClose: () => void
    setIsOpen: (value: boolean) => void
    meal: MealProps
}

interface FormProps {
    meal_id: number
    meal_plan_date: Date
    meal_plan_total_calorie: number
    meal_plan_total_protein: number
    meal_plan_total_carbohydrate: number
    meal_plan_total_fat: number
    user_calorie_requirement: number
    user_protein_requirement: number
    user_carbohydrate_requirement: number
    user_fat_requirement: number
    meal_type_id: number
}

const validationSchema = yup.object().shape({
    meal_type_id: yup.number().nullable().required('Meal Type is required!'),
    meal_id: yup.number().nullable().required('Meal is required!'),
    meal_plan_date: yup.date().nullable().required('Date is required!'),
})

export default function AddMealModal(props: AddMealModalProps){
    const [isLoading, setIsLoading] = useState(false)
    const [mealTypeOptions, setMealTypeOptions] = useState<MealTypeProps[]>([])
    const [date, setDate] = useState(new Date)
    const router = useRouter()

    const form = useForm<FormProps>({
        mode: 'onChange',
        defaultValues: {
            meal_plan_date: new Date,
            meal_plan_total_calorie: 0,
            meal_plan_total_carbohydrate: 0,
            meal_plan_total_fat: 0,
            meal_plan_total_protein: 0,
            user_calorie_requirement: 0,
            user_carbohydrate_requirement: 0,
            user_fat_requirement: 0,
            user_protein_requirement: 0,
            meal_type_id: undefined
        },
        resolver: yupResolver<any>(validationSchema)
    })

    const getTotalNutrition = useCallback(async () => {
        setIsLoading(true)

        await getMealPlanTotalNutrition(form.getValues('meal_plan_date')).then((response) => {
            if(response.data){
                form.setValue('meal_plan_total_calorie', response.data.meal_plan_total_calorie)
                form.setValue('meal_plan_total_carbohydrate', response.data.meal_plan_total_carbohydrate)
                form.setValue('meal_plan_total_fat', response.data.meal_plan_total_fat)
                form.setValue('meal_plan_total_protein', response.data.meal_plan_total_protein)
                form.setValue('user_calorie_requirement', response.data.user_calorie_requirement)
                form.setValue('user_protein_requirement', response.data.user_protein_requirement)
                form.setValue('user_fat_requirement', response.data.user_fat_requirement)
                form.setValue('user_carbohydrate_requirement', response.data.user_carbohydrate_requirement)
            }
        })

        setIsLoading(false)
    }, [form])

    useEffect(() => {
        const getMealTypeDropdown = async () => {
            setIsLoading(true)

            await getMealType().then((response) => {
                setMealTypeOptions(response.data)
            })

            setIsLoading(false)
        }

        if(props.isOpen){
            getMealTypeDropdown()
            getTotalNutrition()
        }
        else {
            form.reset()
        }
    }, [getTotalNutrition, props.isOpen, form])

    const handleChangeDate = async (date: Date) => {
        form.setValue('meal_plan_date', date)
        
        getTotalNutrition()
    }

    const handleConfirmButton = async () => {
        setIsLoading(true)

        form.setValue('meal_id', props.meal.meal_id)
        await postMealPlan({
            meal_id: form.getValues('meal_id'),
            meal_plan_date: form.getValues('meal_plan_date'),
            meal_type_id: form.getValues('meal_type_id')
        }).then((response) => {
            toast("Add new meal plan successful!")
            router.push(`/meal-planner`)
        })

        props.setIsOpen(false)
        
        setIsLoading(false)
    }

    return(
        <Dialog open={props.isOpen} onOpenChange={props.setIsOpen}>
            <DialogContent className="max-w-xl w-full h-auto p-6">
                <DialogHeader>
                    <DialogTitle>Add to meal plan</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col items-center">
                    <FormProvider {...form}>
                        <DatePicker
                            dateValue={form.watch('meal_plan_date')}
                            onDateChange={(date) => {
                                form.setValue('meal_plan_date', date)
                                getTotalNutrition()
                            }}
                            className="w-[500px] mb-4"
                        />
                        <MealPlanValueCard 
                            title={
                                <span className="text-lg flex items-center gap-2">
                                    Meal Plan Value
                                    <HoverTooltip 
                                        tooltipContent="The displayed value is the added value of your selected meal plan."
                                    >
                                        <Info color="gray" size={14}/>
                                    </HoverTooltip>
                                </span>
                            }
                            date={form.watch('meal_plan_date')}
                            calorieValue={form.watch('meal_plan_total_calorie') + props.meal.meal_calories}
                            maxCalorie={form.watch('user_calorie_requirement')}
                            proteinValue={form.watch('meal_plan_total_protein') + props.meal.meal_protein}
                            maxProtein={form.watch('user_protein_requirement')}
                            carbohydrateValue={form.watch('meal_plan_total_carbohydrate') + props.meal.meal_carbohydrate}
                            maxCarbohydrate={form.watch('user_carbohydrate_requirement')}
                            fatValue={form.watch('meal_plan_total_fat') + props.meal.meal_fat}
                            maxFat={form.watch('user_fat_requirement')}
                            handleChangeDate={handleChangeDate}
                            disableChangeDate
                            className="w-[500px] border mb-4"
                        />
                        <DropdownInput
                            control={form.control}
                            id="meal_type_id"
                            label="Meal Type"
                            optionLabel="meal_type_description"
                            optionValue="meal_type_id"
                            options={mealTypeOptions}
                            placeholder="Select meal type"
                            error={form.formState.errors.meal_type_id?.message}
                        />
                    </FormProvider>
                </div>
                <DialogFooter>
                    <Button
                        disabled={isLoading} 
                        onClick={handleConfirmButton}
                    >
                        Confirm
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
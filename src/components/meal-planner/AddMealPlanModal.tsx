import { FormProvider, useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import MealPlanValueCard from "./MealPlanValueCard";
import { useCallback, useEffect, useState } from "react";
import HoverTooltip from "../Tooltip";
import { Info, Router } from "lucide-react";
import DatePicker from "../form/DatePicker";
import DropdownInput from "../form/DropdownInput";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { MealProps } from "@/app/(app)/search/api/getAllMeals";
import { getMealType, MealTypeProps } from "@/app/(app)/search/api/getMealType";
import { getMealPlanTotalNutrition } from "@/app/(app)/meal-planner/api/getMealPlanTotalNutrition";
import { postMealPlan } from "@/app/(app)/meal-planner/api/postMealPlan";

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
    meal_type_id: yup.number().nullable().required('Meal Type is required!')
})

export default function AddMealPlanModal(props: AddMealModalProps){
    const [isLoading, setIsLoading] = useState(false)
    const [mealTypeOptions, setMealTypeOptions] = useState<MealTypeProps[]>([])
    const [date, setDate] = useState(new Date)
    const router = useRouter()

    const form = useForm<FormProps>({
        mode: 'onChange',
        defaultValues: {
            meal_id: undefined,
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
            router.push(`/meal-planner?meal_plan_date=${form.getValues('meal_plan_date')}`)
        }).catch((error) => toast('Something went wrong, add meal plan failed!'))

        props.setIsOpen(false)
        
        setIsLoading(false)
    }

    return(
        <Dialog open={props.isOpen} onOpenChange={props.setIsOpen}>
            <DialogContent className="max-w-full sm:max-w-xl w-[95%] sm:w-full h-auto p-4 sm:p-6 rounded-lg mx-auto">
                <DialogHeader>
                    <DialogTitle>Add to meal plan</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col items-center">
                    <FormProvider {...form}>
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
                            calorieValue={isLoading ? 0 : form.watch('meal_plan_total_calorie') + props.meal.meal_calories}
                            maxCalorie={form.watch('user_calorie_requirement')}
                            proteinValue={isLoading ? 0 : form.watch('meal_plan_total_protein') + props.meal.meal_protein}
                            maxProtein={form.watch('user_protein_requirement')}
                            carbohydrateValue={isLoading ? 0 : form.watch('meal_plan_total_carbohydrate') + props.meal.meal_carbohydrate}
                            maxCarbohydrate={form.watch('user_carbohydrate_requirement')}
                            fatValue={isLoading ? 0 : form.watch('meal_plan_total_fat') + props.meal.meal_fat}
                            maxFat={form.watch('user_fat_requirement')}
                            handleChangeDate={handleChangeDate}
                            className="w-full max-w-[500px] border mb-4"
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
                <DialogFooter className="mt-4">
                    <Button
                        disabled={isLoading} 
                        onClick={form.handleSubmit(handleConfirmButton)}
                        className="w-full sm:w-auto"
                    >
                        Confirm
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
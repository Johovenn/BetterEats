import { FormProvider, useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import TextAreaInput from "../form/TextAreaInput";
import { getMealPlan } from "@/app/(app)/meal-planner/api/getMealPlan";
import { getMealPlanById } from "@/app/(app)/meal-planner/api/getMealPlanById";
import QuotedMealPlan from "./QuotedMealPlan";
import { createPost } from "@/app/(app)/community/api/createPost";
import { toast } from "sonner";

interface PostModalProps{
    isOpen: boolean
    handleClose: () => void
    setIsOpen: (value: boolean) => void
    mealPlanId?: number
    refreshPosts: () => void
}

interface FormProps {
    post_body: string
    meal_plan_id: number
    meal_plan_date: Date
    meal_plan_total_calorie: number
    meal_plan_total_protein: number
    meal_plan_total_carbohydrate: number
    meal_plan_total_fat: number
}

const validationSchema = yup.object().shape({
    post_body: yup.string().nullable().required('Post Body cannot be empty!').min(5, 'Post Body must at least be 5 characters long!'),
    // meal_plan_id: yup.number().nullable().required('Meal Plan is required!'),
})

export default function PostModal(props: PostModalProps){
    const [isLoading, setIsLoading] = useState(false)
    const [mealPlanDetails, setMealPlanDetails] = useState<any>([])
    const router = useRouter()

    const form = useForm<FormProps>({
        mode: 'onBlur',
        defaultValues: {
            post_body: '',
            meal_plan_id: undefined,
            meal_plan_date: undefined,
            meal_plan_total_calorie: 0,
            meal_plan_total_carbohydrate: 0,
            meal_plan_total_fat: 0,
            meal_plan_total_protein: 0,
        },
        resolver: yupResolver<any>(validationSchema)
    })

    useEffect(() => {
        if(props.isOpen){
            const getMealPlanData = async (id: number) => {
                setIsLoading(true)

                await getMealPlanById(id).then((response) => {
                    setMealPlanDetails(response.data.meal_plan_details)
                    form.setValue('meal_plan_id', response.data.meal_plan_id)
                    form.setValue('meal_plan_total_calorie', response.data.meal_plan_total_calorie)
                    form.setValue('meal_plan_total_carbohydrate', response.data.meal_plan_total_carbohydrate)
                    form.setValue('meal_plan_total_protein', response.data.meal_plan_total_protein)
                    form.setValue('meal_plan_total_fat', response.data.meal_plan_total_fat)
                })

                setIsLoading(false)
            }

            if(props.mealPlanId){
                getMealPlanData(props.mealPlanId)
            }
        }
        else{
            form.reset()
            setMealPlanDetails(undefined)
        }
    }, [form, props.isOpen, props.mealPlanId])

    const handleConfirmButton = async () => {
        setIsLoading(true)

        await createPost(form.getValues()).then((response) => {
            props.refreshPosts()
        }).catch((error) => {
            toast(error.response.data.message)
        })

        props.handleClose()
        
        setIsLoading(false)
    }

    return(
        <Dialog open={props.isOpen} onOpenChange={props.setIsOpen}>
            <DialogContent className="max-w-xl w-full h-auto p-6">
                <DialogHeader>
                    <DialogTitle>Create a post</DialogTitle>
                </DialogHeader>
                <div className="w-full">
                    <FormProvider {...form}>
                        <TextAreaInput 
                            disabled={isLoading}
                            control={form.control}
                            id="post_body"
                            label={<span>Body{' '} <span className="text-red-500">*</span></span>}
                            placeholder="Check out this cool meal I planned for today, worth only 1200 calories, ....."
                        />
                    </FormProvider>
                    {
                        props.mealPlanId
                            &&
                        <div className="mt-3">
                            <p className="text-sm font-medium">Meal Plan</p>
                            <QuotedMealPlan
                                mealPlanDetail={mealPlanDetails}
                                mealPlanDate={form.watch('meal_plan_date') ? form.getValues('meal_plan_date').toString() : new Date().toString()}
                                totalCalories={form.watch('meal_plan_total_calorie')}
                                totalProtein={form.watch('meal_plan_total_protein')}
                                totalCarbs={form.watch('meal_plan_total_carbohydrate')}
                                totalFat={form.watch('meal_plan_total_fat')}
                            />
                        </div>
                    }
                </div>
                <DialogFooter>
                    <Button
                        disabled={isLoading} 
                        onClick={form.handleSubmit(handleConfirmButton)}
                    >
                        Submit
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
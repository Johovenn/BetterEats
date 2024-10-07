"use client";

import NumericInput from "@/components/form/NumericInput";
import Loading from "@/components/Loading";
import SearchBar from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import NutritionCard from "@/components/bmr-calculator/NutritionCard";
import { Beef, Wheat } from "lucide-react";
import SaveBMRAlertModal from "@/components/bmr-calculator/SaveBMRAlertModal";
import { postUserBMR } from "./api/postUserBMR";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";
import { ActivityLevelProps, getActivityLevel } from "./api/getAllActivityLevel";
import { getGoal, GoalProps } from "./api/getAllGoal";
import RadioInput from "@/components/form/RadioGroup";
import { getBMRValue } from "./api/calculateBMR";

const validationSchema = z.object({
    user_weight: z.preprocess(value => parseInt(z.string().parse(value)), z.number().min(1, {message: "Weight must be more than 0kg."})),
    user_height: z.preprocess(value => parseInt(z.string().parse(value)), z.number().min(1, {message: "Height must be more than 0cm."})),
    user_age: z.preprocess(value => parseInt(z.string().parse(value)), z.number().min(15, {message: "Age must at least be 15 years old."})),
    user_gender: z.enum(['M', 'F'], { errorMap: () => ({ message: "Gender is required!" }) }),
    user_bmr_date: z.date().nullable().default(() => new Date()),
    user_bmr_value: z.number().nullable().optional(),
    activity_level_id: z.preprocess(value => parseInt(value as string), z.number().min(1, { message: "Activity Level is required!" })),
    goal_id: z.preprocess(value => parseInt(value as string), z.number().min(1, { message: "Goal is required!" })),
    protein: z.number().nullable().optional(),
    carbohydrate: z.number().nullable().optional(),
    fat: z.number().nullable().optional(),
})

const genderInputValues = [
    {
        label: 'Male',
        value: 'M'
    },
    {
        label: 'Female',
        value: 'F'
    }
]

export default function BMRCalculator() {
    const [isLoading, setIsLoading] = useState(false)
    const [alertModal, setAlertModal] = useState(false)
    const [activityLevelInputValues, setActivityLevelInputValues] = useState<ActivityLevelProps[]>([])
    const [goalInputValues, setGoalInputValues] = useState<GoalProps[]>([])

    const form = useForm<z.infer<typeof validationSchema>>({
        mode: 'onChange',
        defaultValues: {
            user_height: 0,
            user_weight: 0,
            user_age: 0,
            user_bmr_date: new Date(),
            user_gender: 'M',
            user_bmr_value: 0,
            activity_level_id: undefined,
            goal_id: undefined,
            protein: 0,
            carbohydrate: 0,
            fat: 0,
        },
        resolver: zodResolver(validationSchema),
    });

    useEffect(() => {
        const getRadioInputValues = async () => {
            setIsLoading(true)

            await getActivityLevel().then((response) => {
                if(response.data){
                    setActivityLevelInputValues(response.data)
                }
            }).catch((error) => toast(error.response.data.message))

            await getGoal().then((response) => {
                if(response.data){
                    setGoalInputValues(response.data)
                }
            }).catch((error) => toast(error.response.data.message))
            
            setIsLoading(false)
        }

        getRadioInputValues()
    }, [form])

    const handleCalculateButton = async () => {
        setIsLoading(true)

        await getBMRValue(form.getValues()).then((response) => {
            form.setValue('user_bmr_value', response.data.bmr_value)
            form.setValue('protein', response.data.protein)
            form.setValue('fat', response.data.fat)
            form.setValue('carbohydrate', response.data.carbohydrate)
        }).catch((error) => toast(error.response.data.message))

        setIsLoading(false)
    }

    const handleSaveBMR = async () => {
        setIsLoading(true)

        await postUserBMR(form.getValues()).then((response) => {
            if(response.data){
                toast('BMR data saved successfully!')
            }
        }).catch((error) => {
            toast(error.response.data.message)
        })

        setIsLoading(false)
        setAlertModal(false)
    }

    return (
        <>
            <Loading loading={isLoading} />

            <SaveBMRAlertModal 
                isOpen={alertModal}
                setIsOpen={setAlertModal}
                handleClose={() => setAlertModal(true)}
                onConfirm={form.handleSubmit(handleSaveBMR)}
            />

            <main className="px-20 py-10 w-full h-full">
                <header className="flex justify-between items-start w-full">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-700">Basal Metabolic Rate Calculator</h1>
                        <p className="text-gray-500">Find out how many calories you burn everyday.</p>
                    </div>
                    <SearchBar />
                </header>
                <section className="mt-7 h-full flex gap-5 w-full">
                    <div className="h-full w-[60%] shadow bg-white p-5">
                        <h1 className="text-xl font-medium">
                            Calculate your BMR here
                        </h1>
                        <div className="mt-5 w-full flex flex-col">
                            <Form {...form} >
                                <form action="" onSubmit={form.handleSubmit(handleCalculateButton)} className="space-y-4 flex flex-col">
                                    <NumericInput
                                        control={form.control}
                                        id="user_height"
                                        label="Height (cm)"
                                        placeholder="Input your height in cm"
                                        className="w-full"
                                    />
                                    <NumericInput
                                        control={form.control}
                                        id="user_weight"
                                        label="Weight (kg)"
                                        placeholder="Input your weight in kg"
                                        className="w-full"
                                    />
                                    <NumericInput
                                        control={form.control}
                                        id="user_age"
                                        label="Age"
                                        placeholder="Input your Age"
                                        className="w-full"
                                    />
                                    <RadioInput
                                        control={form.control}
                                        id="user_gender"
                                        label="Gender"
                                        inputValues={genderInputValues}
                                        radioId="value"
                                        radioLabel="label"
                                    />
                                    <RadioInput
                                        control={form.control}
                                        id="activity_level_id"
                                        label="Activity Level"
                                        inputValues={activityLevelInputValues}
                                        radioId="activity_level_id"
                                        radioLabel="activity_level_description"
                                    />
                                    <RadioInput
                                        control={form.control}
                                        id="goal_id"
                                        label="Activity Level"
                                        inputValues={goalInputValues}
                                        radioId="goal_id"
                                        radioLabel="goal_description"
                                    />
                                    <Button
                                        className="text-white rounded-xl py-2 px-4 ml-auto"
                                        type="submit"
                                    >
                                        Calculate
                                    </Button>
                                </form>
                            </Form>
                        </div>
                    </div>
                    <div className="h-full w-[40%] shadow bg-white p-5 flex flex-col justify-center items-center">
                        <h2 className="text-xl font-medium mb-5">
                            Your daily nutrition needs
                        </h2>
                        <div className="rounded-full border-[20px] border-orange-default w-[200px] h-[200px] text-center flex flex-col justify-center">
                            <span className="text-lg text-slate-500 font-medium">Total</span>
                            <span className="text-2xl font-bold">{form.watch('user_bmr_value')}</span>
                            <span className="text-md text-slate-500 font-medium">kCal</span>
                        </div>
                        <div className="flex justify-around gap-3 mt-3">
                            <NutritionCard 
                                icon={<Beef size={30} className="text-gray-500"/>}
                                title="Protein"
                                value={form.watch('protein')}
                            />
                            <NutritionCard 
                                icon={<Wheat size={30} className="text-gray-500"/>}
                                title="Carbs"
                                value={form.watch('carbohydrate')}
                            />
                            <NutritionCard
                                icon={<Beef size={30} className="text-gray-500"/>}
                                title="Fat"
                                value={form.watch('fat')}
                            />
                        </div>

                        <Button 
                            disabled={!form.watch('user_bmr_value') || !form.getValues('protein') || !form.getValues('carbohydrate') || !form.getValues('fat')}
                            className="text-white rounded-xl mt-5"
                            onClick={form.handleSubmit(() => setAlertModal(true))}
                        >
                            Save BMR
                        </Button>
                    </div>
                </section>
            </main>
        </>
    )
}

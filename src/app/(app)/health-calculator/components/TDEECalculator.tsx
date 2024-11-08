"use client";

import NumericInput from "@/components/form/NumericInput";
import Loading from "@/components/Loading";
import SearchBar from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import NutritionCard from "@/components/bmr-calculator/NutritionCard";
import { Beef, Wheat } from "lucide-react";
import SaveBMRAlertModal from "@/components/bmr-calculator/SaveBMRAlertModal";
import { toast } from "sonner";
import RadioInput from "@/components/form/RadioGroup";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup'
import PageHeader from "@/components/PageHeader";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getUserBMR } from "../api/getUserBMR";
import { getBMRValue } from "../api/calculateBMR";
import { postUserBMR } from "../api/postUserBMR";
interface FormProps{
    user_height: number
    user_weight: number
    user_age: number
    user_bmr_date: Date
    user_gender: string
    user_bmr_value: number
    activity_level_code: string
    goal_code: string
    protein: number
    carbohydrate: number
    fat: number
}

const validationSchema = yup.object().shape({
    user_height: yup.number().required().min(1, "Height must be more than 0cm"),
    user_weight: yup.number().required().min(1, "Weight must be more than 0kg"),
    user_age: yup.number().required().min(15, "Age must at least be 15 years old"),
    user_gender: yup.string().required("Gender is required"),
    user_bmr_date: yup.date().default(() => new Date()),
    user_bmr_value: yup.number().required("BMR value is required"),
    activity_level_code: yup.string().required("Activity Level is required"),
    goal_code: yup.string().required("Goal is required"),
    protein: yup.number().optional(),
    carbohydrate: yup.number().optional(),
    fat: yup.number().optional(),
});


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

const activityLevelInputValues = [
    {
        label: 'Little to no exercise',
        value: 'AL1'
    },
    {
        label: 'Light exercise (1-2 days a week)',
        value: 'AL2'
    },
    {
        label: 'Moderate exercise (3-5 days a week)',
        value: 'AL3'
    },
    {
        label: 'Very Active (6-7 days a week)',
        value: 'AL4'
    },
    {
        label: 'Extra Active (Very active / physical job)',
        value: 'AL5'
    }
]

const goalInputValues = [
    {
        label: 'Gain Muscle / Weight',
        value: 'GM'
    },
    {
        label: 'Maintain Weight',
        value: 'MW'
    },
    {
        label: 'Lose Weight',
        value: 'LW'
    },
]

export default function TDEECalculator() {
    const [isLoading, setIsLoading] = useState(false)
    const [alertModal, setAlertModal] = useState(false)

    const form = useForm<FormProps>({
        mode: 'onChange',
        defaultValues: {
            user_height: 0,
            user_weight: 0,
            user_age: 0,
            user_bmr_date: new Date(),
            user_gender: 'M',
            user_bmr_value: 0,
            activity_level_code: "AL1",
            goal_code: "GM",
            protein: 0,
            carbohydrate: 0,
            fat: 0,
        },
        resolver: yupResolver<any>(validationSchema),
    });
    
    
    const driverObj = driver({
        popoverClass: 'driverjs-theme',
        nextBtnText: 'Next',
        prevBtnText: 'Previous',
        allowClose: false,
        steps: [
            {
                element: '.form', 
                popover: {
                    title: 'How to use the calculator?',
                    description: 'First, fill out all of these fields.'
                }
            },
            {
                element: '.calculate-button', 
                popover: {
                    title: 'How to use the calculator?',
                    description: 'Then, click this button to calculate your TDEE value and macronutrient needs.'
                }
            },
            {
                element: '.results-card', 
                popover: {
                    title: 'How to use the calculator?',
                    description: 'Your calculation results will appear here.'
                }
            },
            {
                element: '.save-button', 
                popover: {
                    title: 'How to use the calculator?',
                    description: 'Lastly, click on this button to save your calculation results. Your meal and meal plan recommendations will use this as the base.'
                }
            },
        ]
    })

    useEffect(() => {
        const getUserData = async () => {
            setIsLoading(true)

            await getUserBMR().then((response) => {
                if(response.data){
                    form.setValue('user_height', response.data.user_height)
                    form.setValue('user_weight', response.data.user_weight)
                    form.setValue('user_age', response.data.user_age)
                    form.setValue('activity_level_code', response.data.activity_level_code)
                    form.setValue('goal_code', response.data.goal_code)
                    form.setValue('user_bmr_value', response.data.user_bmr_value)
                    form.setValue('protein', response.data.protein)
                    form.setValue('carbohydrate', response.data.carbohydrate)
                    form.setValue('fat', response.data.fat)
                }
            }).catch((error) => [
                toast("Error retrieving user BMR data.")
            ])

            setIsLoading(false)
        }

        getUserData()
    }, [form])

    const handleCalculateButton = async () => {
        setIsLoading(true)

        await getBMRValue(form.getValues()).then((response) => {
            form.setValue('user_bmr_value', response.data.bmr_value)
            form.setValue('protein', response.data.protein)
            form.setValue('fat', response.data.fat)
            form.setValue('carbohydrate', response.data.carbohydrate)
        }).catch((error) => {})

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
    
    const triggerTutorial = async () => {
        driverObj.drive()
    }

    return (
        <>
            <SaveBMRAlertModal 
                isOpen={alertModal}
                setIsOpen={setAlertModal}
                handleClose={() => setAlertModal(true)}
                onConfirm={form.handleSubmit(handleSaveBMR)}
            />

            <section>
                <Loading loading={isLoading} />

                <h1 className="text-[28px] font-bold text-green-primary">TDEE Calculator</h1>
                <p className="text-green-primary">Find out how many calories you burn everyday.</p>
                <section className="mt-5 flex gap-5 w-full">
                    <div className="h-full w-[70%] shadow bg-white p-5">
                        <div className="w-full flex flex-col">
                            <Form {...form} >
                                <form action="" onSubmit={form.handleSubmit(handleCalculateButton)} className="form space-y-4 flex flex-col">
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
                                        id="activity_level_code"
                                        label="Activity Level"
                                        inputValues={activityLevelInputValues}
                                        radioId="value"
                                        radioLabel="label"
                                    />
                                    <RadioInput
                                        control={form.control}
                                        id="goal_code"
                                        label="Activity Level"
                                        inputValues={goalInputValues}
                                        radioId="value"
                                        radioLabel="label"
                                    />
                                    <span 
                                        className="text-sm hover:underline text-orange-primary hover:cursor-pointer"
                                        onClick={triggerTutorial}
                                    >
                                        How does this work?
                                    </span>
                                    <Button
                                        className="text-white rounded-lg py-2 px-4 ml-auto calculate-button"
                                        type="submit"
                                        size={'lg'}
                                    >
                                        Calculate
                                    </Button>
                                </form>
                            </Form>
                        </div>
                    </div>
                    <div className="h-fit w-[30%] shadow bg-white p-5 flex flex-col justify-center items-center results-card">
                        <h2 className="text-xl font-medium mb-5">
                            Your daily nutrition needs
                        </h2>
                        <div className="bg-gradient-to-b from-slate-200 to-green-primary w-[220px] h-[220px] rounded-full flex justify-center items-center">
                            <div className="rounded-full w-[170px] h-[170px] p-4 text-center flex flex-col justify-center mx-auto my-auto bg-white">
                                <span className="text-lg text-slate-500 font-medium">Total</span>
                                <span className="text-2xl font-bold">{form.watch('user_bmr_value')}</span>
                                <span className="text-md text-slate-500 font-medium">kCal</span>
                            </div>
                        </div>
                        <div className="flex justify-around gap-3 mt-5">
                            <NutritionCard 
                                icon={<Beef size={28} className="mt-[-20px]" color="#B2533E"/>}
                                title="Protein"
                                value={form.watch('protein')}
                            />
                            <NutritionCard 
                                icon={<Wheat size={28} className="mt-[-20px]" color="#B2533E"/>}
                                title="Carbs"
                                value={form.watch('carbohydrate')}
                            />
                            <NutritionCard
                                icon={<Beef size={28} className="mt-[-20px]" color="#B2533E"/>}
                                title="Fat"
                                value={form.watch('fat')}
                            />
                        </div>

                        <Button 
                            disabled={!form.watch('user_bmr_value') || !form.getValues('protein') || !form.getValues('carbohydrate') || !form.getValues('fat')}
                            className="text-white rounded-xl mt-6 save-button"
                            onClick={form.handleSubmit(() => setAlertModal(true))}
                            size={'sm'}
                        >
                            Save BMR
                        </Button>
                    </div>
                </section>
            </section>
        </>
    )
}
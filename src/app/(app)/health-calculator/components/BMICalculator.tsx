"use client";

import NumericInput from "@/components/form/NumericInput";
import Loading from "@/components/Loading";
import SearchBar from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import NutritionCard from "@/components/bmr-calculator/NutritionCard";
import { Beef, Calculator, Save, Wheat } from "lucide-react";
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
import { getUserBMI } from "../api/getUserBMI";
import { postUserBMI } from "../api/postUserBMI";
import { getBMIValue } from "../api/calculateBMI";
import { getRecommendationBasedOnBMI } from "@/lib/bmiUtils";

interface FormProps{
    user_bmi_id: number
    user_height: number
    user_weight: number
    user_age: number
    user_gender: string
    user_bmi_value: number
}

const validationSchema = yup.object().shape({
    user_height: yup.number().required().min(1, "Height must be more than 0cm"),
    user_weight: yup.number().required().min(1, "Weight must be more than 0kg"),
    user_age: yup.number().required().min(1, "Age must at least be 1 year old"),
    user_gender: yup.string().required("Gender is required"),
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

export default function TDEECalculator() {
    const [isLoading, setIsLoading] = useState(false)
    const [alertModal, setAlertModal] = useState(false)

    const form = useForm<FormProps>({
        mode: 'onChange',
        defaultValues: {
            user_bmi_id: undefined,
            user_height: 0,
            user_weight: 0,
            user_age: 0,
            user_gender: 'M',
            user_bmi_value: 0,
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
                    description: 'Then, click this button to calculate your BMI value and your recommendation.'
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
                    description: 'Lastly, click on this button to save your calculation results so you don\'t have to manually fill in all your data next time you want to calculate.'
                }
            },
        ]
    })

    useEffect(() => {
        const getUserData = async () => {
            setIsLoading(true)

            await getUserBMI().then((response) => {
                if(response.data !== null){
                    form.setValue('user_height', response.data.user_height)
                    form.setValue('user_weight', response.data.user_weight)
                    form.setValue('user_age', response.data.user_age)
                    form.setValue('user_gender', response.data.user_gender)
                    form.setValue('user_bmi_value', response.data.user_bmi_value)
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

        await getBMIValue(form.getValues()).then((response) => {
            form.setValue('user_bmi_value', response.data.bmi_value)
        }).catch((error) => {})

        setIsLoading(false)
    }

    const handleSaveBMI = async () => {
        setIsLoading(true)

        await postUserBMI(form.getValues()).then((response) => {
            if(response.data){
                toast('BMI data saved successfully!')
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
            <Loading loading={isLoading} />

            <section className="w-full">
                <h1 className="text-[28px] font-bold text-green-primary">BMI Calculator</h1>
                <p className="text-green-primary">Find out how healthy your body is.</p>
                <section className="mt-5 flex gap-5 w-full">
                    <div className="h-full w-[60%] min-w-[1000px] shadow bg-white p-5">
                        <div className="w-full flex flex-col">
                            <Form {...form} >
                                <form action="" onSubmit={form.handleSubmit(handleCalculateButton)} className="form space-y-4 flex flex-col w-full">
                                    <NumericInput
                                        control={form.control}
                                        id="user_height"
                                        label="Height (cm)"
                                        placeholder="Input your height in cm"
                                        className="w-full"
                                        error={form.formState.errors.user_height?.message}
                                    />
                                    <NumericInput
                                        control={form.control}
                                        id="user_weight"
                                        label="Weight (kg)"
                                        placeholder="Input your weight in kg"
                                        className="w-full"
                                        error={form.formState.errors.user_weight?.message}
                                    />
                                    <NumericInput
                                        control={form.control}
                                        id="user_age"
                                        label="Age"
                                        placeholder="Input your Age"
                                        className="w-full"
                                        error={form.formState.errors.user_age?.message}
                                    />
                                    <RadioInput
                                        control={form.control}
                                        id="user_gender"
                                        label="Gender"
                                        inputValues={genderInputValues}
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
                                        className="text-white rounded-lg ml-auto flex items-center gap-1 calculate-button"
                                        type="submit"
                                    >
                                        <Calculator size={16} />
                                        Calculate
                                    </Button>
                                </form>
                            </Form>
                        </div>
                    </div>
                    <div className="h-fit w-[40%] shadow bg-white p-5 flex flex-col justify-center items-center results-card min-w-min">
                        <h2 className="text-xl font-medium mb-5">
                            Your BMI Value
                        </h2>

                        <div className="bg-gradient-to-b from-slate-200 to-green-primary w-[220px] h-[220px] rounded-full flex justify-center items-center">
                            <div className="rounded-full w-[170px] h-[170px] p-4 text-center flex flex-col justify-center mx-auto my-auto bg-white">
                                <span className="text-2xl font-bold">{form.watch('user_bmi_value')}</span>
                                <span className="text-md text-slate-500 font-medium">kg/m&sup2;</span>
                            </div>
                        </div>

                        <p className="text-sm text-center text-green-primary mt-5">
                            {form.watch('user_bmi_value') !== 0 && getRecommendationBasedOnBMI(form.getValues('user_bmi_value'))}
                        </p>

                        <Button 
                            disabled={!form.watch('user_bmi_value')}
                            className="mt-6 flex items-center gap-1 save-button"
                            onClick={form.handleSubmit(handleSaveBMI)}
                        >
                            <Save size={16}/>
                            Save BMI
                        </Button>
                    </div>
                </section>
            </section>
        </>
    )
}

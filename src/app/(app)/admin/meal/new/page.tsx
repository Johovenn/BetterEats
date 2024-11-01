"use client"

import { useState } from "react"
import Image from "next/image"
import { FormProvider, useForm } from "react-hook-form"
import FileInput from "@/components/form/FileInput"
import TextInput from "@/components/form/TextInput"
import { Button } from "@/components/ui/button"
import PageHeader from "@/components/PageHeader"
import Loading from "@/components/Loading"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import NumericInput from "@/components/form/NumericInput"
import CheckboxInput from "@/components/form/CheckboxInput"
import TextAreaInput from "@/components/form/TextAreaInput"
import axios from "axios"
import * as yup from 'yup'
import { toast } from "sonner"
import { postMeal } from "../api/postMeal"
import { useRouter } from "next/navigation"
import { yupResolver } from "@hookform/resolvers/yup"

interface FormProps {
    meal_id: number | null
    meal_name: string
    meal_calories: number
    meal_protein: number
    meal_carbohydrate: number
    meal_fat: number
    meal_ingredients: string
    meal_recipe: string
    is_breakfast: boolean
    is_lunch: boolean
    is_dinner: boolean
    is_snack: boolean
    meal_image: File | null
}

const validationSchema = yup.object().shape({
    meal_name: yup.string().required('Meal name is required'),
    meal_calories: yup.number().nullable().min(1, 'Must be greater than 0').required('Calories are required'),
    meal_protein: yup.number().nullable().min(0, 'Protein cannot be negative').required('Protein is required'),
    meal_carbohydrate: yup.number().nullable().min(0, 'Carbohydrate cannot be negative').required('Carbohydrate is required'),
    meal_fat: yup.number().nullable().min(0, 'Fat cannot be negative').required('Fat is required'),
    meal_ingredients: yup.string().required('Ingredients are required'),
    meal_recipe: yup.string().required('Recipe is required'),
    meal_image: yup.mixed().required('An image is required').nullable(),
    is_breakfast: yup.boolean(),
    is_lunch: yup.boolean(),
    is_dinner: yup.boolean(),
    is_snack: yup.boolean(),
})

export default function CreateMealPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [imagePreview, setImagePreview] = useState<string | null>(null)

    const form = useForm<FormProps>({
        mode: 'onBlur',
        defaultValues: {
            meal_id: null,
            meal_name: '',
            meal_calories: 0,
            meal_carbohydrate: 0,
            meal_fat: 0,
            meal_protein: 0,
            is_breakfast: false,
            is_dinner: false,
            is_lunch: false,
            is_snack: false,
            meal_image: null,
            meal_ingredients: '',
            meal_recipe: '',
        },
        resolver: yupResolver<any>(validationSchema)
    })

    const handleFileChange = (file: File | null) => {
        if (file) {
            setImagePreview(URL.createObjectURL(file))
        } else {
            setImagePreview(null)
        }
    }

    const uploadImageToCloudinary = async (image: File | null) => {
        if(image){
            const formData = new FormData()
            formData.append("file", image)
            formData.append("upload_preset", "trw17ij0")
            formData.append("cloud_name", "ddxo8yebm")
    
            try {
                const response = await axios.post("https://api.cloudinary.com/v1_1/ddxo8yebm/image/upload", formData)
                return response.data.secure_url
            } catch (error) {
                console.error("Image upload failed:", error)
                return null
            }
        }
        else {
            return null
        }
    }
    
    const handleSaveButton = async () => {
        setIsLoading(true)

        let imageUrl = null

        if(form.getValues('meal_image')){
            imageUrl = await uploadImageToCloudinary(form.getValues('meal_image'))
            if(!imageUrl){
                toast('Upload image failed!')
                setIsLoading(false)
                return
            }

            const request = {
                ...form.getValues(),
                meal_image: imageUrl,
            }

            await postMeal(request).then((response) => {
                toast('Create meal successful!')
                router.push(`/admin/meal?keyword=${form.getValues('meal_name')}`)
            }).catch((error) => toast('Create meal failed, please try again.'))
        }

        setIsLoading(false)
    }

    return (
        <>
            <Loading loading={isLoading} />

            <PageHeader title={'Create new meal'} />

            <Link href={'/admin/meal'} className="flex items-center gap-2 hover:underline hover:underline-offset-4 transition-all w-fit">
                <ArrowLeft size={18} /> Go back to meal page
            </Link>

            <section className="mt-5 min-w-full bg-white p-5 rounded-lg flex flex-col">
                <div className="w-full flex justify-between">
                    <FormProvider {...form}>
                        <div className="w-[250px] space-y-2">
                            {
                                imagePreview 
                                    ? 
                                <Image
                                    className="rounded-lg"
                                    src={imagePreview}
                                    alt="Selected Image"
                                    width={250}
                                    height={250}
                                />
                                    : 
                                <Image
                                    className="rounded-lg"
                                    src={'/placeholder.jpeg'}
                                    alt="Placeholder Image"
                                    width={250}
                                    height={250}
                                />
                            }

                            <FileInput
                                control={form.control}
                                id="meal_image"
                                label="Image"
                                error={form.formState.errors?.meal_image?.message}
                                onFileChange={handleFileChange}
                            />
                        </div>
                        <div className="w-[75%] space-y-4">
                            <TextInput 
                                control={form.control}
                                id="meal_name"
                                label="Name"
                                placeholder="Kentucky Fried Chicken"
                                error={form.formState.errors?.meal_name?.message}
                            />
                            <div className="w-full flex justify-between">
                                <div className="w-[48%] space-y-2">
                                    <NumericInput
                                        control={form.control}
                                        id="meal_calories"
                                        label="Calories (kCal)"
                                        placeholder="250"
                                        error={form.formState.errors?.meal_calories?.message}
                                    />
                                    <NumericInput 
                                        control={form.control}
                                        id="meal_protein"
                                        label="Protein (g)"
                                        placeholder="52"
                                        error={form.formState.errors?.meal_protein?.message}
                                    />
                                </div>
                                <div className="w-[48%] space-y-2">
                                    <NumericInput 
                                        control={form.control}
                                        id="meal_carbohydrate"
                                        label="Carbohydrate (g)"
                                        placeholder="250"
                                        error={form.formState.errors?.meal_carbohydrate?.message}
                                    />
                                    <NumericInput 
                                        control={form.control}
                                        id="meal_fat"
                                        label="Fat (g)"
                                        placeholder="250"
                                        error={form.formState.errors?.meal_fat?.message}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h2 className="font-medium text-sm">Meal Type</h2>
                                <div className="flex">
                                    <CheckboxInput
                                        control={form.control}
                                        id="is_breakfast"
                                        label="Breakfast"
                                        classname="w-[110px]"
                                    />
                                    <CheckboxInput 
                                        control={form.control}
                                        id="is_lunch"
                                        label="Dinner"
                                        classname="w-[110px]"
                                    />
                                    <CheckboxInput 
                                        control={form.control}
                                        id="is_dinner"
                                        label="Lunch"
                                        classname="w-[110px]"
                                    />
                                    <CheckboxInput 
                                        control={form.control}
                                        id="is_snack"
                                        label="Snack"
                                        classname="w-[110px]"
                                    />
                                </div>
                            </div>
                            <TextAreaInput
                                control={form.control}
                                id="meal_ingredients"
                                label="Ingredients"
                                placeholder="5 tsp of sugar, 100 grams of chicken thigh"
                                description="The ingredients must be separated with a comma (,) and a space, ex: '5 tsp of sugar, 100 grams of chicken thight, 2 tsp of salt'"
                            />
                            <TextAreaInput 
                                control={form.control}
                                id="meal_recipe"
                                label="Recipe"
                                placeholder="Marinate chicken with salt, pepper, olive oil, and sauce overnight, wrap with flour, and fry over low heat."
                            />
                        </div>
                    </FormProvider>
                </div>

                <Button
                    className="w-fit ml-auto mt-3"
                    onClick={form.handleSubmit(handleSaveButton)}
                >
                    Save
                </Button>
            </section>
        </>
    )
}

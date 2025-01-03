"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { FormProvider, useForm } from "react-hook-form"
import FileInput from "@/components/form/FileInput"
import TextInput from "@/components/form/TextInput"
import { Button } from "@/components/ui/button"
import PageHeader from "@/components/PageHeader"
import Loading from "@/components/Loading"
import { ArrowLeft, Save, Trash, Trash2 } from "lucide-react"
import Link from "next/link"
import NumericInput from "@/components/form/NumericInput"
import CheckboxInput from "@/components/form/CheckboxInput"
import TextAreaInput from "@/components/form/TextAreaInput"
import axios from "axios"
import * as yup from 'yup'
import { toast } from "sonner"
import { postMeal } from "../api/postMeal"
import { useParams, useRouter } from "next/navigation"
import { yupResolver } from "@hookform/resolvers/yup"
import { getMealById } from "@/app/(app)/search/api/getMealById"
import { CldImage } from "next-cloudinary"
import { putMeal } from "../api/putMeal"
import AlertModal from "@/components/AlertModal"
import { deleteMeal } from "../api/deleteMeal"

interface FormProps {
    meal_id: number
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
    is_breakfast: yup.boolean(),
    is_lunch: yup.boolean(),
    is_dinner: yup.boolean(),
    is_snack: yup.boolean(),
})

export default function UpdateMealPage() {
    const router = useRouter()
    const { MealId } = useParams()
    const [isLoading, setIsLoading] = useState(false)
    const [imagePreview, setImagePreview] = useState<string>('')
    const [alertModal, setAlertModal] = useState(false)

    const form = useForm<FormProps>({
        mode: 'onBlur',
        defaultValues: {
            meal_id: undefined,
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

    useEffect(() => {
        const getData = async (id: number) => {
            setIsLoading(true)

            await getMealById(id).then((response) => {
                form.setValue('meal_id', response.data.meal_id)
                form.setValue('meal_name', response.data.meal_name)
                form.setValue('meal_calories', response.data.meal_calories)
                form.setValue('meal_protein', response.data.meal_protein)
                form.setValue('meal_fat', response.data.meal_fat)
                form.setValue('meal_carbohydrate', response.data.meal_carbohydrate)
                form.setValue('is_breakfast', response.data.is_breakfast)
                form.setValue('is_lunch', response.data.is_lunch)
                form.setValue('is_dinner', response.data.is_dinner)
                form.setValue('is_snack', response.data.is_breakfast)
                form.setValue('meal_ingredients', response.data.meal_ingredients)
                form.setValue('meal_recipe', response.data.meal_recipe)

                if(response.data.meal_image){
                    setImagePreview(response.data.meal_image)
                }
            }).catch((error) => {
                toast('Error retrieving meal data, please try again later.')
                router.push(`/admin/meal`)
            })

            setIsLoading(false)
        }

        if(MealId){
            const id = Number(MealId)
            if(!isNaN(id)){
                getData(id)
            }
        }
    }, [MealId, form, router])

    const handleFileChange = (file: File | null) => {
        if (file) {
            setImagePreview(URL.createObjectURL(file))
        } else {
            setImagePreview('')
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

        let imageUrl = imagePreview

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

            await putMeal(request).then((response) => {
                toast('Update meal successful!')
                router.push(`/admin/meal?keyword=${form.getValues('meal_name')}`)
            }).catch((error) => toast('Update meal failed, please try again.'))
        }
        else {
            const request = {
                ...form.getValues(),
                meal_image: imageUrl,
            }

            await putMeal(request).then((response) => {
                toast('Update meal successful!')
                router.push(`/admin/meal?keyword=${form.getValues('meal_name')}`)
            }).catch((error) => toast('Update meal failed, please try again.'))
        }

        setIsLoading(false)
    }

    const handleDeleteMeal = async () => {
        setIsLoading(true)

        await deleteMeal(form.getValues("meal_id")).then((response) => {
            router.push(`/admin/meal`)
            toast('Delete meal successful!')
        }).catch((error) => {
            toast('Meal is already used in a meal plan. Delete meal failed.')
        })

        setIsLoading(false)
    }

    return (
        <>
            <Loading loading={isLoading} />

            <PageHeader title={'Create new meal'} />

            <Link href={'/admin/meal'} className="flex items-center gap-2 hover:underline hover:underline-offset-4 transition-all w-fit">
                <ArrowLeft size={18} /> Go back to meal page
            </Link>

            <AlertModal 
                isOpen={alertModal}
                setIsOpen={setAlertModal}
                handleClose={() => setAlertModal(false)}
                title="Delete Meal"
                description="Are you sure you want to delete this meal? You won't be able to delete this meal if this meal is already used in a meal plan. This action cannot be undone."
                onConfirm={handleDeleteMeal}
            />

            <section className="mt-5 min-w-full bg-white p-5 rounded-lg flex flex-col">
                <div className="w-full flex justify-between">
                    <FormProvider {...form}>
                        <div className="w-[250px] h-[250px] space-y-2">
                            {
                                imagePreview 
                                    ?
                                <CldImage
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
                                disabled={isLoading || form.watch('meal_id') === null}
                                control={form.control}
                                id="meal_image"
                                label="Image"
                                error={form.formState.errors?.meal_image?.message}
                                onFileChange={handleFileChange}
                            />
                        </div>
                        <div className="w-[75%] space-y-4">
                            <TextInput 
                                disabled={isLoading || form.watch('meal_id') === null}
                                control={form.control}
                                id="meal_name"
                                label="Name"
                                placeholder="Kentucky Fried Chicken"
                                error={form.formState.errors?.meal_name?.message}
                            />
                            <div className="w-full flex justify-between">
                                <div className="w-[48%] space-y-2">
                                    <NumericInput
                                        disabled={isLoading || form.watch('meal_id') === null}
                                        control={form.control}
                                        id="meal_calories"
                                        label="Calories (kCal)"
                                        placeholder="250"
                                        error={form.formState.errors?.meal_calories?.message}
                                    />
                                    <NumericInput 
                                        disabled={isLoading || form.watch('meal_id') === null}
                                        control={form.control}
                                        id="meal_protein"
                                        label="Protein (g)"
                                        placeholder="52"
                                        error={form.formState.errors?.meal_protein?.message}
                                    />
                                </div>
                                <div className="w-[48%] space-y-2">
                                    <NumericInput 
                                        disabled={isLoading || form.watch('meal_id') === null}
                                        control={form.control}
                                        id="meal_carbohydrate"
                                        label="Carbohydrate (g)"
                                        placeholder="250"
                                        error={form.formState.errors?.meal_carbohydrate?.message}
                                    />
                                    <NumericInput 
                                        disabled={isLoading || form.watch('meal_id') === null}
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
                                        disabled={isLoading || form.watch('meal_id') === null}
                                        control={form.control}
                                        id="is_breakfast"
                                        label="Breakfast"
                                        classname="w-[110px]"
                                    />
                                    <CheckboxInput
                                        disabled={isLoading || form.watch('meal_id') === null}
                                        control={form.control}
                                        id="is_lunch"
                                        label="Lunch"
                                        classname="w-[110px]"
                                    />
                                    <CheckboxInput 
                                        disabled={isLoading || form.watch('meal_id') === null}
                                        control={form.control}
                                        id="is_dinner"
                                        label="Dinner"
                                        classname="w-[110px]"
                                    />
                                    <CheckboxInput
                                        disabled={isLoading || form.watch('meal_id') === null}
                                        control={form.control}
                                        id="is_snack"
                                        label="Snack"
                                        classname="w-[110px]"
                                    />
                                </div>
                            </div>
                            <TextAreaInput
                                disabled={isLoading || form.watch('meal_id') === null}
                                control={form.control}
                                id="meal_ingredients"
                                label="Ingredients"
                                placeholder="5 tsp of sugar, 100 grams of chicken thigh"
                                description="The ingredients must be separated with a comma (,) and a space, ex: '5 tsp of sugar, 100 grams of chicken thight, 2 tsp of salt'"
                            />
                            <TextAreaInput 
                                disabled={isLoading || form.watch('meal_id') === null}
                                control={form.control}
                                id="meal_recipe"
                                label="Recipe"
                                placeholder="Marinate chicken with salt, pepper, olive oil, and sauce overnight, wrap with flour, and fry over low heat."
                            />
                        </div>
                    </FormProvider>
                </div>
                <div className="ml-auto flex items-center mt-3 gap-3">
                    <Button
                        className="bg-red-700 hover:bg-red-600 flex items-center gap-1"
                        onClick={() => setAlertModal(true)}
                        disabled={isLoading || form.watch('meal_id') === null}
                    >
                        <Trash2 size={16} />
                        Delete
                    </Button>
                    <Button
                        className="flex items-center gap-1"
                        onClick={form.handleSubmit(handleSaveButton)}
                        disabled={isLoading || form.watch('meal_id') === null}
                    >
                        <Save size={16}/>
                        Save
                    </Button>
                </div>
            </section>
        </>
    )
}

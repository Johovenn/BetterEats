"use client"

import { useState } from "react"
import Image from "next/image"
import { FormProvider, useForm } from "react-hook-form"
import FileInput from "@/components/form/FileInput"
import TextInput from "@/components/form/TextInput"
import { Button } from "@/components/ui/button"
import PageHeader from "@/components/PageHeader"
import Loading from "@/components/Loading"
import { ArrowLeft, Save, Trash2 } from "lucide-react"
import Link from "next/link"
import NumericInput from "@/components/form/NumericInput"
import CheckboxInput from "@/components/form/CheckboxInput"
import TextAreaInput from "@/components/form/TextAreaInput"
import axios from "axios"
import * as yup from 'yup'
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { yupResolver } from "@hookform/resolvers/yup"
import { postArticle } from "../api/postArticle"
import AlertModal from "@/components/AlertModal"

interface FormProps {
    article_id: number
    article_image: File | null
    article_title: string
    article_description: string
    article_body: string
}

const validationSchema = yup.object().shape({
    article_title: yup.string().required('Title is required!'),
    article_description: yup.string().required('Description is required!'),
    article_body: yup.string().required('Body is required!'),
    article_image: yup.mixed().nullable().required('Image is required'),
})

export default function NewArticlePage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [imagePreview, setImagePreview] = useState<string | null>(null)

    const form = useForm<FormProps>({
        mode: 'onBlur',
        defaultValues: {
            article_id: undefined,
            article_title: '',
            article_description: '',
            article_body: '',
            article_image: null,
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

        let articleUrl = null

        if(form.getValues('article_image')){
            articleUrl = await uploadImageToCloudinary(form.getValues('article_image'))
            if(!articleUrl){
                toast('Upload image failed!')
                setIsLoading(false)
                return
            }

            const request = {
                ...form.getValues(),
                article_image: articleUrl,
            }

            await postArticle(request).then((response) => {
                toast('Create article successful!')
                router.push(`/admin/article?keyword=${form.getValues('article_title')}`)
            }).catch((error) => toast('Create article failed, please try again.'))
        }

        setIsLoading(false)
    }

    return (
        <>
            <Loading loading={isLoading} />

            <PageHeader title={'Create new article'} />

            <Link href={'/admin/meal'} className="flex items-center gap-2 hover:underline hover:underline-offset-4 transition-all w-fit">
                <ArrowLeft size={18} /> Go back to article page
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
                                id="article_image"
                                label="Image"
                                error={form.formState.errors?.article_image?.message}
                                onFileChange={handleFileChange}
                            />
                        </div>
                        <div className="w-[75%] space-y-4">
                            <TextInput 
                                control={form.control}
                                id="article_title"
                                label="Title"
                                placeholder="Tips and trick to lose weight"
                                error={form.formState.errors?.article_title?.message}
                            />
                            <TextAreaInput
                                control={form.control}
                                id="article_description"
                                label="Description"
                                placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                                description="This will be displayed as a short description when the user searches for articles. Ideally 3-4 sentences long."
                                error={form.formState.errors?.article_description?.message}
                            />
                            <TextAreaInput 
                                control={form.control}
                                id="article_body"
                                label="Body"
                                placeholder="\t Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi vel velit fermentum, ornare dui at, ultrices orci.
                                \n Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi vel velit fermentum, ornare dui at, ultrices orci. \n"
                                description="This is the main content of the article. Split paragraphs with '\n', make indentations with '\t'"
                                error={form.formState.errors?.article_body?.message}
                            />
                        </div>
                    </FormProvider>
                </div>
                <div className="flex items-center gap-2 ml-auto mt-3"> 
                    <Button
                        className="flex items-center gap-1"
                        onClick={form.handleSubmit(handleSaveButton)}
                    >
                        <Save size={16}/>
                        Save
                    </Button>   
                </div>
            </section>
        </>
    )
}

"use client"

import { useEffect, useState } from "react"
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
import { useParams, useRouter } from "next/navigation"
import { yupResolver } from "@hookform/resolvers/yup"
import { postArticle } from "../api/postArticle"
import AlertModal from "@/components/AlertModal"
import { putArticle } from "../api/putArticle"
import { deleteArticle } from "../api/deleteArticle"
import { getArticleById } from "@/app/(app)/article/api/getArticleById.api"
import { CldImage } from "next-cloudinary"

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
})

export default function EditArticlePage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [alertModal, setAlertModal] = useState(false)
    const { ArticleId } = useParams()
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

    useEffect(() => {
        const getData = async () => {
            setIsLoading(true)

            await getArticleById(Number(ArticleId)).then((response) => {
                if(response.data){
                    form.setValue('article_id', response.data.article_id)
                    form.setValue('article_title', response.data.article_title)
                    form.setValue('article_description', response.data.article_description)
                    form.setValue('article_body', response.data.article_body)

                    if(response.data.article_image){
                        setImagePreview(response.data.article_image)
                    }
                }
            })

            setIsLoading(false)
        }

        if(!isNaN(Number(ArticleId))){
            getData()
        }
    }, [ArticleId, form])

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

        let imageUrl = imagePreview

        if(form.getValues('article_image')){
            imageUrl = await uploadImageToCloudinary(form.getValues('article_image'))
            if(!imageUrl){
                toast('Upload image failed!')
                setIsLoading(false)
                return
            }

            const request = {
                ...form.getValues(),
                article_image: imageUrl,
            }

            await putArticle(request).then((response) => {
                toast('Update article successful!')
                router.push(`/admin/article?keyword=${form.getValues('article_title')}`)
            }).catch((error) => toast('Update article failed, please try again.'))
        }
        else {
            const request = {
                ...form.getValues(),
                article_image: imageUrl,
            }

            await putArticle(request).then((response) => {
                toast('Update article successful!')
                router.push(`/admin/article?keyword=${form.getValues('article_title')}`)
            }).catch((error) => toast('Update article failed, please try again.'))
        }

        setIsLoading(false)
    }

    const handleDeleteArticle = async () => {
        setIsLoading(true)

        await deleteArticle(form.getValues('article_id')).then((response) => {
            toast('Delete article successful!')
            router.push(`/admin/article`)
        }).catch((error) => {
            toast('Something went wrong, please try again.')
        })

        setIsLoading(false)
    }

    return (
        <>
            <Loading loading={isLoading} />

            <AlertModal 
                isOpen={alertModal}
                setIsOpen={setAlertModal}
                handleClose={() => setAlertModal(false)}
                title="Delete Article"
                description="Are you sure you want to delete this article? This action cannot be undone."
                onConfirm={handleDeleteArticle}
            />

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
                        className="flex items-center gap-1 bg-red-700 hover:bg-red-600 transition-colors"
                        onClick={() => setAlertModal(true)}
                    >
                        <Trash2 size={16}/>
                        Delete
                    </Button>   
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

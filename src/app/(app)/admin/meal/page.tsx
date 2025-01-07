"use client"

import Loading from "@/components/Loading";
import SearchBar from "@/components/SearchBar";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import MealCard from "@/components/meal-planner/MealCard.";
import CheckboxInput from "@/components/form/CheckboxInput";
import { Form, FormProvider, useForm } from "react-hook-form";
import NumericInput from "@/components/form/NumericInput";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/PageHeader";
import MealDetailModal from "@/components/meal-planner/MealDetailModal";
import { FilterIcon, Plus, Router, SlidersHorizontal } from "lucide-react";
import SearchMealFilter from "@/components/search/SearchMealFilter";
import { getAllMeals, MealProps } from "../../search/api/getAllMeals";
import AddMealPlanModal from "@/components/meal-planner/AddMealPlanModal";
import AlertModal from "@/components/AlertModal";
import { deleteMeal } from "./api/deleteMeal";
import { CldImage } from "next-cloudinary";

interface FormProps{
    is_breakfast: boolean
    is_lunch: boolean
    is_dinner: boolean
    is_snack: boolean
    calorie_range_from: number
    calorie_range_to: number
    page: number
    limit: number
    total_rows: number
    meal_name: string
}

export default function AdminMealPage(){
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const [page, setPage] = useState(0)
    const [limit, setLimit] = useState(10)
    const [totalRows, setTotalRows] = useState(0)
    const [mealName, setMealName] = useState('')
    const [searchResults, setSearchResults] = useState<MealProps[]>([])
    const [deleteMealId, setDeleteMealId] = useState<number>()
    const [selectedMealDetailId, setSelectedMealDetailId] = useState<number>()
    const [detailModal, setDetailModal] = useState(false)
    const [alertModal, setAlertModal] = useState(false)
    const searchParams = useSearchParams()
    const keyword = searchParams.get('keyword')

    const form = useForm<FormProps>({
        defaultValues: {
            is_breakfast: false,
            is_dinner: false,
            is_lunch: false,
            is_snack: false,
            calorie_range_from: undefined,
            calorie_range_to: undefined,
            page: 0,
            limit: 10,
            total_rows: 0,
            meal_name: '',
        }
    })

    const getMeals = useCallback(async () => {
        setIsLoading(true)

        setPage(0)
        await getAllMeals({
            page: form.getValues('page'),
            limit: form.getValues('limit'),
            meal_name: form.getValues('meal_name'),
            is_breakfast: form.getValues('is_breakfast'),
            is_lunch: form.getValues('is_lunch'),
            is_dinner: form.getValues('is_dinner'),
            is_snack: form.getValues('is_snack'),
            calorie_range_from: form.getValues('calorie_range_from'),
            calorie_range_to: form.getValues('calorie_range_to')
        }).then((response) => {
            setSearchResults(response.data)
            setTotalRows(Number(response.total_rows))
        }).catch((error) => {
            setSearchResults([])
            setTotalRows(0)
        })

        setIsLoading(false)
    }, [form])

    const loadMoreMeals = useCallback(async () => {
        setIsLoading(true)

        await getAllMeals({
            page: form.getValues('page'),
            limit: form.getValues('limit'),
            meal_name: form.getValues('meal_name'),
            is_breakfast: form.getValues('is_breakfast'),
            is_lunch: form.getValues('is_lunch'),
            is_dinner: form.getValues('is_dinner'),
            is_snack: form.getValues('is_snack'),
            calorie_range_from: form.getValues('calorie_range_from'),
            calorie_range_to: form.getValues('calorie_range_to')
        }).then((response) => {
            if(response.data){
                setSearchResults(prev => [...prev, ...response.data])
                setTotalRows(Number(response.total_rows))
            }
        }).catch((error) => {
            setSearchResults([])
            setTotalRows(0)
        })

        setIsLoading(false)
    }, [form])

    const searchMeals = useCallback(async () => {
        setIsLoading(true)

        if(form.getValues('meal_name') !== ''){
            await getAllMeals({
                page: form.getValues('page'),
                limit: form.getValues('limit'),
                meal_name: form.getValues('meal_name'),
                is_breakfast: form.getValues('is_breakfast'),
                is_lunch: form.getValues('is_lunch'),
                is_dinner: form.getValues('is_dinner'),
                is_snack: form.getValues('is_snack'),
                calorie_range_from: form.getValues('calorie_range_from'),
                calorie_range_to: form.getValues('calorie_range_to')
            }).then((response) => {
                setSearchResults(response.data)
                setTotalRows(Number(response.total_rows))
            }).catch((error) => {
                setSearchResults([])
                setTotalRows(0)
            })
        }

        setIsLoading(false)
    }, [form])

    useEffect(() => {
        if(keyword){
            form.setValue('meal_name', keyword)
            searchMeals()
        }
        else{
            getMeals()
        }
    }, [searchMeals, getMeals, keyword, form])

    const handleInfoButton = (meal_id: number) => {
        setSelectedMealDetailId(meal_id)
        setDetailModal(true)
    }
    
    const handleEditButton = (meal_id: number) => {
        router.push(`/admin/meal/${meal_id}`)
    }

    const handleAddMealButton = () => {
        router.push(`/admin/meal/new`)
    }

    const handleLoadMoreButton = () => {
        form.setValue('page', form.getValues('page') + 1)
        loadMoreMeals()
    }

    const handleDeleteButton = async (meal_id: number) => {
        setDeleteMealId(meal_id)
        setAlertModal(true)
    } 

    const handleConfirmDeleteMeal = async () => {
        setIsLoading(true)

        if(deleteMealId){
            await deleteMeal(deleteMealId).then((response) => {
                getMeals()
                toast('Delete meal successful!')
            }).catch((error) => toast(error.response.data.message))
        }

        setIsLoading(false)
    }
    
    return(
        <>
            <Loading loading={isLoading} />

            <MealDetailModal 
                isOpen={detailModal}
                setIsOpen={setDetailModal}
                handleClose={() => setDetailModal(false)}
                mealId={selectedMealDetailId}
            />

            <AlertModal
                isOpen={alertModal}
                setIsOpen={setAlertModal}
                title="Delete Meal"
                description="Are you sure you want to delete this meal? You can only delete meals that haven't been included in a user's meal plan. This action cannot be undone."
                handleClose={() => setAlertModal(true)}
                onConfirm={handleConfirmDeleteMeal}
            />

            <PageHeader 
                title="Manage meals in the database"
            />

            <section className="mt-5 min-w-full">
                <div className="flex justify-between">
                    <div className="flex gap-2">
                        <h2 className="text-lg font-medium">{mealName === '' ? 'Showing all existing meals' : `Showing search results for keyword \'${mealName}\'`}</h2>
                        <SearchMealFilter
                            form={form}
                            onConfirm={getMeals}
                            onClear={() => form.reset()}
                        />
                    </div>
                    <Button 
                        className="flex items-center gap-1"
                        onClick={handleAddMealButton}
                    >
                        <Plus size={18}/>
                        Add Meal
                    </Button>
                </div>
                <div className="mt-3">
                    <div className="w-full space-y-3">
                        {
                            searchResults.length > 0
                                ?
                            searchResults.map((meal) => (
                                <MealCard 
                                    key={meal.meal_id}
                                    meal={meal}
                                    mode="admin"
                                    handleInfoButton={handleInfoButton}
                                    handleEditButton={handleEditButton}
                                    handleDeleteButton={handleDeleteButton}
                                />
                            ))
                                :
                            <div className="mt-6 w-full flex flex-col items-center justify-center">
                                <CldImage
                                    src="9796613-removebg_d4sxc2"
                                    alt="Not Found Image"
                                    width={250}
                                    height={250}
                                />
                                <p className="mt-3 text-lg font-semibold text-green-primary">Meal not found.</p>
                            </div>
                        }
                    </div>
                    {
                        (page + 1) * limit < totalRows
                            &&
                        <div className="w-full mt-3">
                            <Button 
                                variant={'outline'} 
                                className="w-full hover:bg-slate-100"
                                onClick={handleLoadMoreButton}
                            >
                                Load More
                            </Button>
                        </div>
                    }
                </div>
            </section>
        </>
    )
}
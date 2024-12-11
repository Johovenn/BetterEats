"use client"

import Loading from "@/components/Loading";
import SearchBar from "@/components/SearchBar";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { getAllMeals, MealProps } from "./api/getAllMeals";
import { toast } from "sonner";
import MealCard from "@/components/meal-planner/MealCard.";
import CheckboxInput from "@/components/form/CheckboxInput";
import { Form, FormProvider, useForm } from "react-hook-form";
import NumericInput from "@/components/form/NumericInput";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/PageHeader";
import MealDetailModal from "@/components/meal-planner/MealDetailModal";
import { FilterIcon, SlidersHorizontal } from "lucide-react";
import SearchMealFilter from "@/components/search/SearchMealFilter";
import AddMealPlanModal from "@/components/meal-planner/AddMealPlanModal";
import { CldImage } from "next-cloudinary";
import MealCardNew from "@/components/search/MealCardNew";
import RadioInput from "@/components/form/RadioGroup";

interface FormProps{
    is_breakfast: boolean
    is_lunch: boolean
    is_dinner: boolean
    is_snack: boolean
    calorie_range_from: number
    calorie_range_to: number
    protein_range_from: number
    protein_range_to: number
    carbohydrate_range_from: number
    carbohydrate_range_to: number
    fat_range_from: number
    fat_range_to: number
    page: number
    limit: number
    total_rows: number
    meal_name: string
    category: string
}

export default function SearchPage(){
    const [isLoading, setIsLoading] = useState(false)
    const [searchResults, setSearchResults] = useState<MealProps[]>([])
    const [addMealModal, setAddMealModal] = useState(false)
    const [selectedMeal, setSelectedMeal] = useState<MealProps>()
    const [selectedMealId, setSelectedMealId] = useState<number>()
    const [detailModal, setDetailModal] = useState(false)
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
            limit: 12,
            meal_name: '',
            total_rows: 0,
            category: 'ALL',
        }
    })

    const mealCategories = [
        {
            label: 'All',
            value: 'ALL',
        },
        {
            label: 'Favorites',
            value: 'FV',
        },
        {
            label: 'Recently Added',
            value: 'RA',
        },
        {
            label: "Newest Meals",
            value: 'NM'
        },
        {
            label: "Most Popular",
            value: 'MP'
        },
    ]

    const getMeals = useCallback(async () => {
        setIsLoading(true)

        await getAllMeals(form.getValues()).then((response) => {
            if(response.data){
                setSearchResults(response.data)
                form.setValue("total_rows", (Number(response.total_rows)))
            }
        }).catch((error) => {
            setSearchResults([])
            form.setValue("total_rows", 0)
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
                form.setValue("total_rows", (Number(response.total_rows)))
            }
        }).catch((error) => {
            setSearchResults([])
            form.setValue("total_rows", 0)
        })

        setIsLoading(false)
    }, [form])

    useEffect(() => {
        keyword ? form.setValue('meal_name', keyword) : form.setValue('meal_name', '')
        getMeals()
    }, [form, getMeals, keyword])

    const category = form.watch('category')
    useEffect(() => {
        if(category){
            form.setValue('page', 0)
            form.setValue('limit', 12)
            getMeals()
        }
    }, [category, form, getMeals])

    const handleAddMealButton = (meal: MealProps) => {
        setSelectedMeal(meal)
        setAddMealModal(true)
    } 

    const handleInfoButton = (meal_id: number) => {
        setSelectedMealId(meal_id)
        setDetailModal(true)
    }

    const handleLoadMoreButton = () => {
        form.setValue('page', form.getValues('page') + 1)
        loadMoreMeals()
    }
    
    return(
        <>
            <Loading loading={isLoading} />

            <AddMealPlanModal 
                isOpen={addMealModal}
                handleClose={() => setAddMealModal(false)}
                setIsOpen={setAddMealModal}
                meal={selectedMeal || {} as MealProps}
            />

            <MealDetailModal 
                isOpen={detailModal}
                setIsOpen={setDetailModal}
                handleClose={() => setDetailModal(false)}
                mealId={selectedMealId}
            />

            <PageHeader 
                title="Search for Food"
            />

            <section className="mt-5 min-w-full">
                <div className="flex justify-between">
                    <FormProvider {...form}>
                        <RadioInput 
                            control={form.control}
                            id="category"
                            inputValues={mealCategories}
                            label=""
                            radioId="value"
                            radioLabel="label"                    
                        />
                    </FormProvider>
                    {/* <h2 className="text-lg font-medium text-green-primary">
                        {  
                            form.watch('meal_name') === '' 
                            ? 'Showing all search results' 
                            : `Showing search results for keyword \'${form.watch('meal_name')}\'`
                        }
                    </h2> */}
                    <SearchMealFilter
                        form={form}
                        onConfirm={getMeals}
                        onClear={() => form.reset()}
                    />
                </div>
                <div className="mt-3">
                    <div className="w-full gap-y-5 grid grid-cols-4">
                        {
                            searchResults.length > 0
                                ?
                            searchResults.map((meal) => (
                                <MealCardNew
                                    key={meal.meal_id}
                                    meal={meal}
                                    mode="search"
                                    handleInfoButton={handleInfoButton}
                                    handleAddMealButton={handleAddMealButton}
                                />
                            ))
                                :
                            <div className="mt-6 w-full flex flex-col items-center justify-center col-span-4">
                                <CldImage 
                                    src="9796613-removebg_d4sxc2"
                                    alt="Not Found Image"
                                    width={300}
                                    height={300}
                                />
                                <p className="mt-3 text-lg font-semibold text-green-primary">Meal not found.</p>
                            </div>
                        }
                    </div>
                    {
                        (form.watch('page') + 1) * form.watch('limit') < form.watch('total_rows')
                            &&
                        <div className="w-full mt-3">
                            <Button 
                                variant={'outline'} 
                                className="w-full hover:bg-green-primary/10"
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
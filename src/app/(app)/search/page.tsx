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
import { addFavoriteMeal } from "./api/addFavoriteMeal";
import { deleteFavoriteMeal } from "./api/deleteFavoriteMeal";
import { getAllFavoriteMeals } from "./api/getAllFavoriteMeals";
import { getAllRecentlyAddedMeals } from "./api/getAllRecentlyAddedMeals";
import { getAllMostPopularMeals } from "./api/getAllMostPopularMeals";

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

        form.setValue('page', 0)
        form.setValue('limit', 12)
        form.setValue('total_rows', 0)
        setSearchResults([])

        if(form.getValues('category') === 'ALL'){
            await getAllMeals(form.getValues()).then((response) => {
                if(response.data){
                    setSearchResults(response.data)
                    form.setValue("total_rows", (Number(response.total_rows)))
                }
            }).catch((error) => {
                setSearchResults([])
                form.setValue("total_rows", 0)
            })
        }
        else if (form.getValues('category') === 'FV'){
            await getAllFavoriteMeals(form.getValues()).then((response) => {
                if(response.data){
                    setSearchResults(response.data)
                    form.setValue("total_rows", (Number(response.total_rows)))
                }
            }).catch((error) => {
                setSearchResults([])
                form.setValue("total_rows", 0)
            })
        }
        else if (form.getValues('category') === 'RA'){
            await getAllRecentlyAddedMeals(form.getValues()).then((response) => {
                if(response.data){
                    setSearchResults(response.data)
                    form.setValue("total_rows", (Number(response.total_rows)))
                }
            }).catch((error) => {
                setSearchResults([])
                form.setValue("total_rows", 0)
            })
        }
        else if (form.getValues('category') === 'MP'){
            await getAllMostPopularMeals(form.getValues()).then((response) => {
                if(response.data){
                    setSearchResults(response.data)
                    form.setValue("total_rows", (Number(response.total_rows)))
                }
            }).catch((error) => {
                setSearchResults([])
                form.setValue("total_rows", 0)
            })
        }

        setIsLoading(false)
    }, [form])

    const loadMoreMeals = useCallback(async () => {
        setIsLoading(true)

        if(form.getValues('category') === 'ALL'){
            await getAllMeals(form.getValues()).then((response) => {
                if(response.data){
                    setSearchResults(prev => [...prev, ...response.data])
                    form.setValue("total_rows", (Number(response.total_rows)))
                }
                }).catch((error) => {
                    setSearchResults([])
                    form.setValue("total_rows", 0)
            })
        }
        else if (form.getValues('category') === 'FV'){
            await getAllFavoriteMeals(form.getValues()).then((response) => {
                if(response.data){
                    setSearchResults(prev => [...prev, ...response.data])
                    form.setValue("total_rows", (Number(response.total_rows)))
                }
            }).catch((error) => {
                setSearchResults([])
                form.setValue("total_rows", 0)
            })
        }
        else if (form.getValues('category') === 'RA'){
            await getAllRecentlyAddedMeals(form.getValues()).then((response) => {
                if(response.data){
                    setSearchResults(prev => [...prev, ...response.data])
                    form.setValue("total_rows", (Number(response.total_rows)))
                }
            }).catch((error) => {
                setSearchResults([])
                form.setValue("total_rows", 0)
            })
        }
        else if (form.getValues('category') === 'MP'){
            await getAllMostPopularMeals(form.getValues()).then((response) => {
                if(response.data){
                    setSearchResults(prev => [...prev, ...response.data])
                    form.setValue("total_rows", (Number(response.total_rows)))
                }
            }).catch((error) => {
                setSearchResults([])
                form.setValue("total_rows", 0)
            })
        }

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

    const updateFavoriteMeal = async (meal_id: number) => {
        setIsLoading(true)

        await addFavoriteMeal(meal_id).catch((error) => toast(error.response.data.message))
        
        setSearchResults((prevResults) =>
            prevResults.map((meal) =>
                meal.meal_id === meal_id ? { ...meal, is_favorite: true } : meal
            )
        )

        setIsLoading(false)
    }

    const removeFavoriteMeal = async (meal_id: number) => {
        setIsLoading(true)

        await deleteFavoriteMeal(meal_id).catch((error) => toast(error.response.data.message))
        
        setSearchResults((prevResults) =>
            prevResults.map((meal) =>
                meal.meal_id === meal_id ? { ...meal, is_favorite: false } : meal
            )
        )

        setIsLoading(false)
    }

    const handleClearFilter = async () => {
        form.setValue('is_breakfast', false)
        form.setValue('is_lunch', false)
        form.setValue('is_dinner', false)
        form.setValue('is_snack', false)
        form.setValue('calorie_range_from', 0)
        form.setValue('calorie_range_to', 0)
        form.setValue('protein_range_from', 0)
        form.setValue('protein_range_to', 0)
        form.setValue('carbohydrate_range_from', 0)
        form.setValue('carbohydrate_range_to', 0)
        form.setValue('fat_range_from', 0)
        form.setValue('fat_range_to', 0)
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
                <div className="flex justify-between items-center">
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
                    <SearchMealFilter
                        form={form}
                        onConfirm={getMeals}
                        onClear={handleClearFilter}
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
                                    updateMeal={updateFavoriteMeal}
                                    removeMeal={removeFavoriteMeal}
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
                                <p className="mt-3 text-lg font-semibold text-green-primary">
                                    {
                                        isLoading ? 'Loading meals....' : 'Meal not found'
                                    }
                                </p>
                            </div>
                        }
                    </div>
                    {
                        ((form.watch('page') + 1) * form.watch('limit') < form.watch('total_rows') && form.getValues('total_rows') !== 0)
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
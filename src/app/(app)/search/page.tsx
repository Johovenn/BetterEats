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
import AddMealModal from "@/components/meal-planner/AddMealModal";
import PageHeader from "@/components/PageHeader";
import MealDetailModal from "@/components/meal-planner/MealDetailModal";
import { FilterIcon, SlidersHorizontal } from "lucide-react";
import SearchMealFilter from "@/components/search/SearchMealFilter";

interface FormProps{
    is_breakfast: boolean
    is_lunch: boolean
    is_dinner: boolean
    is_snack: boolean
    calorie_range_from: number
    calorie_range_to: number
}

export default function SearchPage(){
    const [isLoading, setIsLoading] = useState(false)
    const [page, setPage] = useState(0)
    const [limit, setLimit] = useState(10)
    const [totalRows, setTotalRows] = useState(0)
    const [mealName, setMealName] = useState('')
    const [searchResults, setSearchResults] = useState<MealProps[]>([])
    const [addMealModal, setAddMealModal] = useState(false)
    const [selectedMeal, setSelectedMeal] = useState<MealProps>()
    const [selectedMealId, setSelectedMealId] = useState<number>()
    const [detailModal, setDetailModal] = useState(false)
    const [openFilter, setOpenFilter] = useState(false)
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
        }
    })

    const getMeals = useCallback(async () => {
        setIsLoading(true)

        await getAllMeals({
            page: page,
            limit: limit,
            meal_name: mealName,
            is_breakfast: form.getValues('is_breakfast'),
            is_lunch: form.getValues('is_lunch'),
            is_dinner: form.getValues('is_dinner'),
            is_snack: form.getValues('is_snack'),
            calorie_range_from: form.getValues('calorie_range_from'),
            calorie_range_to: form.getValues('calorie_range_to')
        }).then((response) => {
            if(response.data){
                setSearchResults(response.data)
                setTotalRows(Number(response.total_rows))
            }
        }).catch((error) => {
            setSearchResults([])
            setTotalRows(0)
        })

        setIsLoading(false)
    }, [form, limit, mealName, page])

    const loadMoreMeals = useCallback(async () => {
        setIsLoading(true)

        await getAllMeals({
            page: page,
            limit: limit,
            meal_name: mealName,
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
    }, [form, limit, mealName, page])

    useEffect(() => {
        keyword ? setMealName(keyword) : setMealName('')
        getMeals()
    }, [getMeals, keyword])

    // const breakfast = form.watch('is_breakfast')
    // const lunch = form.watch('is_lunch')
    // const dinner = form.watch('is_dinner')
    // const snack = form.watch('is_snack')
    // useEffect(() => {
    //     getMeals()
    // }, [breakfast, lunch, dinner, snack, getMeals])

    const handleOnBlurFilter = async () => {
        getMeals()
    }

    const handleClearFilterButton = async () => {
        form.reset()
        getMeals()
    }

    const handleAddMealButton = (meal: MealProps) => {
        setSelectedMeal(meal)
        setAddMealModal(true)
    } 

    const handleInfoButton = (meal_id: number) => {
        setSelectedMealId(meal_id)
        setDetailModal(true)
    }

    const handleLoadMoreButton = () => {
        setPage((prev) => prev + 1)
        loadMoreMeals()
    }
    
    return(
        <>
            <Loading loading={isLoading} />

            <AddMealModal 
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
                    <h2 className="text-lg font-medium">{mealName === '' ? 'Showing all search results' : `Showing search results for keyword \'${mealName}\'`}</h2>
                    <SearchMealFilter
                        form={form}
                        onConfirm={getMeals}
                        onClear={() => form.reset()}
                    />
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
                                    mode="search"
                                    handleInfoButton={handleInfoButton}
                                    handleAddMealButton={handleAddMealButton}
                                />
                            ))
                                :
                            <h3>Food not found.</h3>
                        }
                    </div>
                    {
                        (page + 1) * limit < totalRows
                            &&
                        <div className="w-full mt-3">
                            <Button 
                                variant={'outline'} 
                                className="w-full hover:bg-orange-default/10"
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
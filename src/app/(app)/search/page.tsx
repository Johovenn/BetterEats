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
    const [mealName, setMealName] = useState('')
    const [searchResults, setSearchResults] = useState<MealProps[]>([])
    const [addMealModal, setAddMealModal] = useState(false)
    const [selectedMeal, setSelectedMeal] = useState<MealProps>()
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
            }
        }).catch((error) => {
            setSearchResults([])
        })

        setIsLoading(false)
    }, [form, limit, mealName, page])

    useEffect(() => {
        keyword ? setMealName(keyword) : setMealName('')
        getMeals()
    }, [getMeals, keyword])

    const breakfast = form.watch('is_breakfast')
    const lunch = form.watch('is_lunch')
    const dinner = form.watch('is_dinner')
    const snack = form.watch('is_snack')
    useEffect(() => {
        getMeals()
    }, [breakfast, lunch, dinner, snack, getMeals])

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
    
    return(
        <>
            <Loading loading={isLoading} />

            <AddMealModal 
                isOpen={addMealModal}
                handleClose={() => setAddMealModal(false)}
                setIsOpen={setAddMealModal}
                meal={selectedMeal || {} as MealProps}
            />

            <PageHeader 
                title="Search for Food"
            />

            <section className="mt-5 min-w-full">
                <h2 className="text-xl font-medium">{mealName === '' ? 'Showing all search results' : `Showing search results for keyword \'${mealName}\'`}</h2>
                <div className="flex gap-10 mt-3">
                    <div className="w-[65%] space-y-3 max-h-[550px]">
                        {
                            searchResults.length > 0
                                ?
                            searchResults.map((meal) => (
                                <MealCard 
                                    key={meal.meal_id}
                                    meal={meal}
                                    mode="search"
                                    handleAddMealButton={handleAddMealButton}
                                />
                            ))
                                :
                            <h3>Food not found.</h3>
                        }
                    </div>
                    <div className="w-[35%] px-4 py-2 bg-white shadow-xl rounded-xl h-full max-lg:hidden">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-semibold">Filter</h3>
                            <Button variant={"outline"} onClick={handleClearFilterButton}>Clear Filter</Button>
                        </div>
                        <div className="p-2">
                            <FormProvider {...form}>
                                <form action="" className="">
                                    <h2 className="text-lg font-medium mt-1">Meal Type</h2>
                                    <div className="flex flex-wrap gap-3 justify-between mt-2">
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
                                    <div className="mt-5">
                                        <h2 className="text-lg font-medium">Calorie Range</h2>
                                        <div className="flex items-end gap-5">
                                            <NumericInput
                                                control={form.control}
                                                id="calorie_range_from"
                                                label="From"
                                                placeholder="Minimum Calorie"
                                                className=""
                                                onBlur={handleOnBlurFilter}
                                            />
                                            <span className="mb-3">To</span>
                                            <NumericInput
                                                control={form.control}
                                                id="calorie_range_to"
                                                label="To"
                                                placeholder="Maximum Calorie"
                                                className=""
                                                onBlur={handleOnBlurFilter}
                                            />
                                        </div>
                                    </div>
                                </form>
                            </FormProvider>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
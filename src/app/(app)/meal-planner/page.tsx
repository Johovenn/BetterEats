"use client"

import Loading from "@/components/Loading"
import { useCallback, useEffect, useState } from "react"
import { getMealPlan, MealPlanDetailProps } from "./api/getMealPlan"
import MealPlanValueCard from "@/components/meal-planner/MealPlanValueCard"
import { useForm } from "react-hook-form"
import PageHeader from "@/components/PageHeader"
import AlertModal from "@/components/AlertModal"
import { deleteMealPlan } from "./api/deleteMealPlan"
import { toast } from "sonner"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import MealDetailModal from "@/components/meal-planner/MealDetailModal"
import { driver } from "driver.js"
import "driver.js/dist/driver.css"
import { Button } from "@/components/ui/button"
import { ChefHat, Link, Moon, Quote, Share, Share2, Sun, Sunrise, Sunset } from "lucide-react"
import { generateMealPlan } from "./api/generateMealPlan"
import PostModal from "@/components/community/PostModal"
import Menu from "@/components/Menu"
import MealSection from "@/components/meal-planner/MealSection"
import { generateBreakfastMealPlan } from "./api/generateBreakfastMealPlan"
import { generateLunchMealPlan } from "./api/generateLunchMealPlan"
import { generateDinnerMealPlan } from "./api/generateDinnerMealPlan"
import { generateSnackMealPlan } from "./api/generateSnackMealPlan"

interface FormProps {
    meal_plan_id: number
    meal_plan_date: Date
    meal_plan_total_calorie: number
    meal_plan_total_protein: number
    meal_plan_total_carbohydrate: number
    meal_plan_total_fat: number
    user_calorie_requirement: number
    user_protein_requirement: number
    user_carbohydrate_requirement: number
    user_fat_requirement: number
}

export default function MealPlannerPage(){
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [isLoading, setIsLoading] = useState(false)
    const [mealPlanDetailId, setMealPlanDetailId] = useState<any>()
    const [alertDeleteModal, setAlertDeleteModal] = useState(false)
    const [breakfastData, setBreakfastData] = useState<MealPlanDetailProps[]>([])
    const [lunchData, setLunchData] = useState<MealPlanDetailProps[]>([])
    const [dinnerData, setDinnerData] = useState<MealPlanDetailProps[]>([])
    const [snackData, setSnackData] = useState<MealPlanDetailProps[]>([])
    const [selectedMealId, setSelectedMealId] = useState<number>()
    const [detailModal, setDetailModal] = useState(false)
    const [postModal, setPostModal] = useState(false)
    const [mealPlanId, setMealPlanId] = useState<number>()
    const [isClient, setIsClient] = useState(false)
    const mealPlanDate = searchParams.get('meal_plan_date')

    useEffect(() => {
        setIsClient(true)
    }, [])
    
    const form = useForm<FormProps>({
        defaultValues: {
            meal_plan_id: undefined,
            meal_plan_date: new Date,
            meal_plan_total_calorie: 0,
            meal_plan_total_carbohydrate: 0,
            meal_plan_total_fat: 0,
            meal_plan_total_protein: 0,
            user_calorie_requirement: 0,
            user_carbohydrate_requirement: 0,
            user_fat_requirement: 0,
            user_protein_requirement: 0,
        }
    })
    
    const driverObj = driver({
        popoverClass: 'driverjs-theme',
        nextBtnText: 'Next',
        prevBtnText: 'Previous',
        allowClose: false,
        steps: [
            {
                element: '.meal-plans', 
                popover: {
                    title: 'How to use the meal planner?',
                    description: 'Meal plans added to the day will appear here.'
                }
            },
            {
                element: '.sidebar-Search', 
                popover: {
                    title: 'How to use the meal planner?',
                    description: 'Search for meals to add to your meal plan on the search page.'
                }
            },
            {
                element: '.search-bar', 
                popover: {
                    title: 'How to use the meal planner?',
                    description: 'You can also go to the search page by typing the name of meal you would like to add to the meal plan.'
                }
            },
            {
                element: '.generate-button', 
                popover: {
                    title: 'How to use the meal planner?',
                    description: "Don't know what to eat? Let us fill in rest of your meal plan according to your needs."
                }
            },
            {
                element: '.meal-plan-value', 
                popover: {
                    title: 'How to use the meal planner?',
                    description: 'This is the total nutrient value of your current meal plan.'
                }
            },
            {
                element: '.meal-plan-date-picker', 
                popover: {
                    title: 'How to use the meal planner?',
                    description: 'Click on this to change dates and view other date\'s meal plans.'
                }
            },
        ]
    })

    const getMealPlanData = useCallback(async () => {
        setIsLoading(true)

        await getMealPlan(form.getValues('meal_plan_date')).then((response) => {
            if(response.data){
                form.setValue('meal_plan_id', response.data.meal_plan_id)
                form.setValue('meal_plan_total_calorie', response.data.meal_plan_total_calorie)
                form.setValue('meal_plan_total_protein', response.data.meal_plan_total_protein)
                form.setValue('meal_plan_total_fat', response.data.meal_plan_total_fat)
                form.setValue('meal_plan_total_carbohydrate', response.data.meal_plan_total_carbohydrate)
                form.setValue('user_calorie_requirement', response.data.user_calorie_requirement)
                form.setValue('user_carbohydrate_requirement', response.data.user_carbohydrate_requirement)
                form.setValue('user_protein_requirement', response.data.user_protein_requirement)
                form.setValue('user_fat_requirement', response.data.user_fat_requirement)
                response.data.meals.breakfast ? setBreakfastData(response.data.meals.breakfast) : setBreakfastData([])
                response.data.meals.lunch ? setLunchData(response.data.meals.lunch) : setLunchData([])
                response.data.meals.dinner ? setDinnerData(response.data.meals.dinner) : setDinnerData([])
                response.data.meals.snack ? setSnackData(response.data.meals.snack) : setSnackData([])
            }
        })

        setIsLoading(false)
    }, [form])

    useEffect(() => {
        if(mealPlanDate){
            form.setValue('meal_plan_date', new Date(mealPlanDate))
        }
        
        getMealPlanData()
    }, [form, getMealPlanData, mealPlanDate])

    const handleChangeDate = async (date: Date) => {
        form.setValue('meal_plan_date', date)
        
        getMealPlanData()
    }

    const handleDeleteButton = async (meal_plan_detail_id: number) => {
        setMealPlanDetailId(meal_plan_detail_id)
        setAlertDeleteModal(true)
    } 

    const onConfirmDelete = async () => {
        setIsLoading(true)

        await deleteMealPlan(mealPlanDetailId).then((response) => {
            toast("Meal successfully removed!")
            router.refresh()
        }).catch((error) => {
            toast("Error removing meal, please try again.")
        })

        getMealPlanData()
        setIsLoading(false)
    }

    const handleInfoButton = (meal_id: number) => {
        setSelectedMealId(meal_id)
        setDetailModal(true)
    }

    const triggerTutorial = () => {
        driverObj.drive()
    }

    const handleGenerateMealPlanButton = async () => {
        setIsLoading(true)

        if(breakfastData.length === 0){
            await generateBreakfastMealPlan(form.getValues()).then((response) => {
                toast("Generate breakfast meal successful!")
            }).catch((error) => {
                toast("Please calculate your TDEE first.")
            })
        }

        if(lunchData.length === 0){
            await generateLunchMealPlan(form.getValues()).then((response) => {
                toast("Generate lunch successful!")
            }).catch((error) => {
                toast("Please calculate your TDEE first.")
            })
        }

        if(dinnerData.length === 0){
            await generateDinnerMealPlan(form.getValues()).then((response) => {
                toast("Generate dinner successful!")
            }).catch((error) => {
                toast("Please calculate your TDEE first.")
            })
        }

        if(snackData.length === 0){
            await generateSnackMealPlan(form.getValues()).then((response) => {
                toast("Generate snack successful!")
            }).catch((error) => {
                toast("Please calculate your TDEE first.")
            })
        }

        await getMealPlanData()

        setIsLoading(false)
    }

    const handleShareButton = async () => {
        setPostModal(true)
        setMealPlanId(form.getValues('meal_plan_id'))
    }

    const handleCopyLinkButton = async () => {
        const url = `${window.location.origin}${pathname}`

        navigator.clipboard.writeText(url).then(() => {
            toast('Link copied to clipboard')
        })
    }

    return (
        <div className="container mx-auto px-4 pb-6">
            <Loading loading={isLoading} />

            <MealDetailModal
                isOpen={detailModal}
                setIsOpen={setDetailModal}
                handleClose={() => setDetailModal(false)}
                mealId={selectedMealId}
            />

            <PostModal
                isOpen={postModal}
                setIsOpen={setPostModal}
                handleClose={() => setPostModal(false)}
                mealPlanId={mealPlanId}
                refreshPosts={() => {}}
            />

            <PageHeader 
                title="Meal Planner"
            />

            <AlertModal 
                title="Remove meal from meal plan?"
                description="Are you sure you want to remove this meal from the meal plan? You can always re-add the meal to the meal plan later."
                isOpen={alertDeleteModal}
                handleClose={() => setAlertDeleteModal(false)}
                onConfirm={onConfirmDelete}
                setIsOpen={setAlertDeleteModal}
            />

            <section className="w-full flex flex-col-reverse lg:flex-row justify-between gap-6">
                <div className="w-full lg:w-[65%] mb-5 px-4 py-2 bg-[#fefefe] shadow-lg rounded-lg meal-plans">
                    <div className="p-2 flex flex-col sm:flex-row items-center justify-between w-full gap-4">
                        <h3 className="text-xl font-semibold text-green-primary text-center sm:text-left">
                            Your Meal Plan
                        </h3>
                        <div className="flex flex-row items-center gap-2">
                            <Button 
                                className="flex items-center gap-2 generate-button w-full sm:w-auto"
                                onClick={handleGenerateMealPlanButton}
                            >
                                <ChefHat size={18}/> 
                                Generate Meal Plan
                            </Button>
                            {
                                isClient
                                    &&
                                <Menu 
                                    items={[
                                        {
                                            label: <span className="flex items-center gap-3"><Link size={12} color="gray"/>Copy Link</span>,
                                            onClick: handleCopyLinkButton
                                        },  
                                        {
                                            label: <span className="flex items-center gap-3"><Quote size={12} color="gray"/>Quote Meal Plan</span>,
                                            onClick: handleShareButton
                                        }
                                    ]}
                                    label={<Share size={16} color="#1A5319"/>}
                                />
                            }
                            
                        </div>
                    </div>
                    
                    <MealSection 
                        title={"Breakfast"}
                        icon={<Sunrise size={20} color="#b53a31"/>}
                        meals={breakfastData}
                        handleDeleteButton={handleDeleteButton}
                        handleInfoButton={handleInfoButton}
                    />
                    <MealSection 
                        title={"Lunch"}
                        icon={<Sun size={20} color="#b53a31"/>}
                        meals={lunchData}
                        handleDeleteButton={handleDeleteButton}
                        handleInfoButton={handleInfoButton}
                    />
                    <MealSection 
                        title={"Snack"}
                        icon={<Sunset size={20} color="#b53a31"/>}
                        meals={snackData}
                        handleDeleteButton={handleDeleteButton}
                        handleInfoButton={handleInfoButton}
                    />
                    <MealSection 
                        title={"Dinner"}
                        icon={<Moon size={20} color="#b53a31"/>}
                        meals={dinnerData}
                        handleDeleteButton={handleDeleteButton}
                        handleInfoButton={handleInfoButton}
                    />

                    <span className="text-sm hover:cursor-pointer text-orange-primary hover:underline" onClick={triggerTutorial}>How does this work?</span>
                </div>
                <div className="w-full lg:w-[30%]">
                    <MealPlanValueCard 
                        date={form.watch('meal_plan_date')}
                        calorieValue={form.watch('meal_plan_total_calorie')}
                        maxCalorie={form.watch('user_calorie_requirement')}
                        proteinValue={form.watch('meal_plan_total_protein')}
                        maxProtein={form.watch('user_protein_requirement')}
                        carbohydrateValue={form.watch('meal_plan_total_carbohydrate')}
                        maxCarbohydrate={form.watch('user_carbohydrate_requirement')}
                        fatValue={form.watch('meal_plan_total_fat')}
                        maxFat={form.watch('user_fat_requirement')}
                        handleChangeDate={handleChangeDate}
                    />
                </div>
            </section>
        </div>
    )
}
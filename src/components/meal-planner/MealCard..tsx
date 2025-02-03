import Image from "next/image"
import { Badge } from "../ui/badge"
import MealBadge from "./MealBadge"
import { Beef, Droplet, Ellipsis, Flame, Wheat } from "lucide-react"
import { Button } from "../ui/button"
import { Separator } from "@radix-ui/react-separator"
import { CldImage } from 'next-cloudinary'
import { MealProps } from "@/app/(app)/search/api/getAllMeals"
import Menu from "../Menu"
import { MealPlanDetailProps } from "@/app/(app)/meal-planner/api/getMealPlan"

interface MealCardProps{
    meal: MealProps | MealPlanDetailProps
    mode: "search" | "meal-plan" | "admin"
    handleInfoButton: (id: number) => void
    handleAddMealButton?: (meal: MealProps) => void
    handleDeleteButton?: (meal_plan_detail_id: number) => void
    handleEditButton?: (meal_id: number) => void
}

export default function MealCard(props: MealCardProps){
    return(
        <div className="w-full bg-white shadow-lg flex flex-col sm:flex-row items-center px-3 py-2 rounded-xl space-y-2 sm:space-y-0">
            <div className="relative w-[80px] h-[80px] flex-shrink-0">
                <CldImage 
                    src={props.meal.meal_image}
                    width={110}
                    height={110}
                    alt={props.meal.meal_name}
                    className="object-cover rounded-lg z-10"
                    crop={"fill"}
                    gravity="center"
                />
            </div>
            <div className="ml-0 sm:ml-3 flex flex-col sm:flex-row items-center justify-between w-full">
                <div className="flex flex-col space-y-3 w-full sm:w-auto">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <p className="text-lg font-medium text-center sm:text-left">{props.meal.meal_name}</p>
                        <div className="flex justify-center sm:justify-start gap-2">
                            {props.meal.is_breakfast && <MealBadge text="Breakfast"/>}
                            {props.meal.is_lunch && <MealBadge text="Lunch"/>}
                            {props.meal.is_dinner && <MealBadge text="Dinner"/>}    
                            {props.meal.is_snack && <MealBadge text="Snack"/>}
                        </div>
                    </div>
                    <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2">
                        <p className="text-sm text-black flex items-center gap-1"><Flame size={18} color="#b53a31"/> {props.meal.meal_calories} calories</p>
                        <p className="text-sm text-black flex items-center gap-1"><Beef size={18} color="#6e0e07"/> {props.meal.meal_protein} protein</p>
                        <p className="text-sm text-black flex items-center gap-1"><Wheat size={18} color="#f2a929"/> {props.meal.meal_carbohydrate} carbohydrate</p>
                        <p className="text-sm text-black flex items-center gap-1"><Droplet size={18} color="#bd7006"/> {props.meal.meal_fat} fat</p>
                    </div>
                </div>
                <div className="mt-2 sm:mt-0 mr-0 sm:mr-1 flex items-center justify-center sm:justify-end gap-2 w-full sm:w-auto">
                    {props.mode === "search" && (
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => props.handleInfoButton(props.meal.meal_id)}>Info</Button>
                            <Button onClick={() => props.handleAddMealButton ? props.handleAddMealButton(props.meal) : () => {}}>
                                Add to meal plan
                            </Button>
                        </div>
                    )}
                    {props.mode === "meal-plan" && (
                        <Menu 
                            label={<Ellipsis color="gray" size={16}/>}
                            items={[
                                {
                                    label: "Info",
                                    onClick: () => props.handleInfoButton(props.meal.meal_id)
                                },
                                {
                                    label: "Remove",
                                    onClick: () => props.handleDeleteButton ? props.handleDeleteButton(props.meal.meal_plan_detail_id) : () => {}
                                }
                            ]}
                        />
                    )}
                    {props.mode === "admin" && (
                        <Menu 
                            label={<Ellipsis color="gray" size={16}/>}
                            items={[
                                {
                                    label: "Info",
                                    onClick: () => props.handleInfoButton(props.meal.meal_id)
                                },
                                {
                                    label: "Edit",
                                    onClick: () => props.handleEditButton ? props.handleEditButton(props.meal.meal_id) : () => {}
                                },
                                {
                                    label: "Remove",
                                    onClick: () => props.handleDeleteButton ? props.handleDeleteButton(props.meal.meal_id) : () => {}
                                }
                            ]}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}
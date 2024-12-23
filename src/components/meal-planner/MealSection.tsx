import { MealPlanDetailProps } from "@/app/(app)/meal-planner/api/getMealPlan";
import { ReactNode } from "react";
import MealCard from "./MealCard.";
import { Sun } from "lucide-react";
import Link from "next/link";

interface MealSectionProps{
    title: string
    icon: ReactNode
    meals: MealPlanDetailProps[]
    handleDeleteButton: (meal_id: number) => {}
    handleInfoButton: (meal_id: number) => void
}

export default function MealSection(props: MealSectionProps){
    return(
        <div className="w-full mb-5 p-2 bg-white">
            <h2 className="text-lg font-medium text-green-primary flex items-center gap-2">{props.icon}{props.title}</h2>
            <div className="flex flex-col gap-3 justify-between">
                {
                    props.meals.length > 0
                        ?
                    props.meals.map((meal) => (
                        <MealCard
                            key={meal.meal_plan_detail_id}
                            meal={meal}
                            mode="meal-plan"
                            handleDeleteButton={props.handleDeleteButton}
                            handleInfoButton={props.handleInfoButton}
                        />
                    ))
                        :
                    <p className="text-sm">
                        No meals yet for {props.title}, click <Link className="text-orange-primary font-semibold underline" href={'/search'}>here</Link> to add meals
                    </p>
                }
            </div>
        </div>
    )
}
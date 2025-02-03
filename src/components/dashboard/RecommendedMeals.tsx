import { MealProps } from "@/app/(app)/search/api/getAllMeals";
import { Button } from "../ui/button";
import MealCard from "../meal-planner/MealCard.";
import { CldImage } from "next-cloudinary";
import { useRouter } from "next/navigation";

interface RecommendedMealsProps{
    meals: MealProps[]
    handleInfoButton: (id: number) => void
    handleAddMealButton: (meal: MealProps) => void 
}

export default function RecommendedMeals(props: RecommendedMealsProps){
    const router = useRouter()
    
    return(
        <div className="col-span-3 px-5 py-4 bg-white rounded-lg shadow-lg">
            <div className="flex items-start justify-between">
                <h3 className="font-medium lg:text-lg">
                    Recommended Meals
                </h3>
                <Button
                    onClick={() => router.push('/search')}
                >Go to Search Page</Button>
            </div>
            <div className="h-full space-y-2">
                {
                    props.meals.length > 0
                        ?
                    props.meals.map((meal) => (
                        <MealCard 
                            key={meal.meal_id}
                            meal={meal} 
                            mode="search"
                            handleInfoButton={props.handleInfoButton}
                            handleAddMealButton={props.handleAddMealButton}
                        />
                    ))
                        :
                    <div className="flex flex-col items-center gap-3 justify-center mt-4">
                        <CldImage
                            src="9796613-removebg_d4sxc2"
                            alt="Not Found Image"
                            width={150}
                            height={150}
                        />
                        <h4>Loading...</h4>
                    </div>
                }
            </div>
        </div>
    )
}
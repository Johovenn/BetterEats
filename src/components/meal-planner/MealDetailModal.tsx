import { useEffect, useState } from "react"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { MealProps } from "@/app/(app)/search/api/getAllMeals"
import { CldImage } from "next-cloudinary"
import { Skeleton } from "../ui/skeleton"
import { BeefIcon, DropletIcon, FlameIcon, WheatIcon } from "lucide-react"
import { getMealById } from "@/app/(app)/search/api/getMealById"

interface MealDetailModalProps{
    isOpen: boolean
    handleClose: () => void
    setIsOpen: (value: boolean) => void
    mealId: number | undefined
}

export default function MealDetailModal(props: MealDetailModalProps){
    const [isLoading, setIsLoading] = useState(false)
    const [mealData, setMealData] = useState<any>()

    useEffect(() => {
        const getDetail = async () => {
            setIsLoading(true)

            if(props.mealId){
                await getMealById(props.mealId).then((response) => {
                    if(response.data){
                        setMealData(response.data)
                    }
                })
            }

            setIsLoading(false)
        }
        
        if(props.isOpen){
            getDetail()
        } else {
            setMealData(null)
        }
    }, [props.isOpen, props.mealId])

    return(
        <Dialog open={props.isOpen} onOpenChange={props.setIsOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Meal Detail
                    </DialogTitle>
                </DialogHeader>
                <div className="flex gap-5">
                    <div className="w-[200px] h-[200px]">
                        {
                            mealData
                                ?
                            <CldImage
                                src={mealData.meal_image}
                                width={200}
                                height={200}
                                alt={mealData.meal_name}
                                className="object-cover rounded-lg"
                                crop={"fill"}
                                gravity="center"
                            />
                                :
                            <Skeleton className="h-full w-full"/>
                        }
                    </div>
                    <div className="">
                        {mealData ? <h4 className="text-lg font-medium">{mealData.meal_name}</h4> : <Skeleton className="w-[200px] h-[30px]"/>}
                        {
                            mealData 
                                ?
                            <div className="space-y-2 mt-2">
                                <p className="text-sm text-gray-700 flex item-center w-[150px] gap-1"><FlameIcon size={18}/>{mealData.meal_calories} calories</p>
                                <p className="text-sm text-gray-700 flex item-center w-[150px] gap-1"><BeefIcon size={18}/>{mealData.meal_protein} protein</p>
                                <p className="text-sm text-gray-700 flex item-center w-[150px] gap-1"><WheatIcon size={18}/>{mealData.meal_carbohydrate} carbohydrate</p>
                                <p className="text-sm text-gray-700 flex item-center w-[150px] gap-1"><DropletIcon size={18}/>{mealData.meal_fat} fat</p>
                            </div>
                                :
                            <Skeleton className="w-[200px] h-[155px]"/>
                        }
                        {
                            mealData
                                ?
                            <div className="mt-4">
                                <h5 className="font-medium">Ingredients :</h5>
                                <ul className="list-inside list-disc ml-1 space-y-1">
                                    {
                                        mealData.meal_ingredients.split(", ").map((item: string) => (
                                            <li key={item} className="text-sm">{item}</li>
                                        ))
                                    }
                                </ul>
                            </div>
                                :
                            <Skeleton className="w-[200px] h-[155px]"/>
                        }
                        {
                            mealData
                                ?
                            <div className="mt-4">
                                <h5 className="font-medium">How to cook :</h5>
                                <p className="text-sm">{mealData.meal_recipe}</p>
                            </div>
                                :
                            <Skeleton className="w-[200px] h-[100px]"/>
                        }
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
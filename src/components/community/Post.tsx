import { Skeleton } from "../ui/skeleton";
import QuotedMealPlan from "./QuotedMealPlan";

interface PostProps{

}

export default function Post(props: PostProps){
    

    return(
        <div className="flex gap-3 w-[500px] p-3 border-b-2 border-b-gray-300">
            <div>
                <Skeleton className="w-10 h-10 rounded-full"/>
            </div>
            <div className="">
                <div className="flex items-center gap-2">
                    <span className="font-semibold">
                        Jonathan Gunawan
                    </span>
                    <span className="text-gray-500">
                        @johovenn
                    </span>
                </div>
                <p className="mb-2">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum perspiciatis voluptatum quaerat consectetur. Cupiditate quod doloremque quibusdam atque assumenda ratione quae corporis numquam voluptates nemo eligendi eius officiis, minus rem! Cupiditate nam ducimus voluptatem esse necessitatibus odit, qui voluptate recusandae nobis impedit! Qui voluptatibus sint natus reprehenderit iure aperiam unde?
                </p>
                <QuotedMealPlan />
            </div>
        </div>
    )
}
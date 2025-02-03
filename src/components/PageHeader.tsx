import { ReactNode } from "react";
import SearchBar from "./SearchBar";
import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";

interface PageHeaderProps{
    title: string | ReactNode
    subtitle?: string | ReactNode
    hideSearchBar?: boolean
    searchMode?: 'article' | 'meal' | 'post'
}

export default function PageHeader(props: PageHeaderProps){
    return(
        <header className="flex flex-wrap justify-end max-sm:pr-4 lg:justify-between items-start w-full mb-5">
            <div className="max-md:hidden">
                <h1 className="text-[28px] font-bold text-green-primary max-sm:text-xl max-md:text-2xl">{props.title}</h1>
                {
                    props.subtitle
                        &&
                    <p className="text-green-primary">{props.subtitle}</p>
                }
            </div>
            <div className="flex items-center gap-2">
                {
                    !props.hideSearchBar
                        &&
                    <SearchBar mode={props.searchMode ? props.searchMode : 'meal'}/>
                }
                <div className="lg:hidden mt-2">
                    <UserButton />
                </div>
            </div>
        </header>
    )
}
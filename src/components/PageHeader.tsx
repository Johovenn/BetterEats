import { ReactNode } from "react";
import SearchBar from "./SearchBar";

interface PageHeaderProps{
    title: string | ReactNode
    subtitle?: string | ReactNode
    hideSearchBar?: boolean
}

export default function PageHeader(props: PageHeaderProps){
    return(
        <header className="flex justify-between items-start w-full mb-5">
            <div>
                <h1 className="text-[28px] font-bold text-green-primary">{props.title}</h1>
                {
                    props.subtitle
                        &&
                    <p className="text-green-primary">{props.subtitle}</p>
                }
            </div>
            {
                !props.hideSearchBar
                    &&
                <SearchBar />
            }
        </header>
    )
}
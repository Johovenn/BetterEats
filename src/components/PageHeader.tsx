import { ReactNode } from "react";
import SearchBar from "./SearchBar";

interface PageHeaderProps{
    title: string | ReactNode
    subtitle?: string | ReactNode
}

export default function PageHeader(props: PageHeaderProps){
    return(
        <header className="flex justify-between items-start w-full mb-5">
            <div>
                <h1 className="text-[22px] font-semibold text-black">{props.title}</h1>
                {
                    props.subtitle
                        &&
                    <p className="text-gray-600">{props.subtitle}</p>
                }
            </div>
            <SearchBar />
        </header>
    )
}
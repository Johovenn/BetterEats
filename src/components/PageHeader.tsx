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
                <h1 className="text-2xl font-bold text-gray-700">{props.title}</h1>
                {
                    props.subtitle
                        &&
                    <p className="text-gray-500">{props.subtitle}</p>
                }
            </div>
            <SearchBar />
        </header>
    )
}
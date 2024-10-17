import { ReactNode } from "react";
import SearchBar from "./SearchBar";

interface PageHeaderProps{
    title: string | ReactNode
    subtitle: string | ReactNode
}

export default function PageHeader(props: PageHeaderProps){
    return(
        <header className="flex justify-between items-start w-full">
            <div>
                <h1 className="text-xl font-medium">{props.title}</h1>
                <p>{props.subtitle}</p>
            </div>
            <SearchBar />
        </header>
    )
}
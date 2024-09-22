"use client"

import Loading from "@/components/Loading";
import SearchBar from "@/components/SearchBar";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";


export default function SearchPage(){
    const [isLoading, setIsLoading] = useState(false)
    const searchParams = useSearchParams()
    const keyword = searchParams.get('keyword')

    useEffect(() => {
        if(keyword){
            console.log('call get food by name api')
        }
    }, [keyword])
    
    return(
        <>
            <Loading loading={isLoading} />

            <main className="px-20 py-10 w-full">
                <header className="flex justify-between items-start w-full">
                    <div>
                        <h1 className="text-2xl font-medium">Search for Food</h1>
                    </div>
                    <SearchBar />
                </header>
            </main>
        </>
    )
}
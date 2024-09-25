"use client"

import Loading from "@/components/Loading";
import SearchBar from "@/components/SearchBar";
import { useState } from "react";

export default function BMRCalculator(){
    const [isLoading, setIsLoading] = useState(false)



    return(
        <>
            <Loading loading={isLoading} />

            <main className="px-20 py-10 w-full">
                <header className="flex justify-between items-start w-full">
                    <h1 className="text-2xl font-medium">BMR Calculator</h1>
                    <SearchBar />
                </header>
                <section className="mt-7">
                    
                </section>
            </main>
        </>
    )
}
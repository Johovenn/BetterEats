"use client"
import BMRCard from "@/components/dashboard/BMRCard"
import Loading from "@/components/Loading"
import SearchBar from "@/components/SearchBar"
import { useUser } from "@clerk/nextjs"
import { Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { getUserBMR } from "../bmr-calculator/api/getUserBMR"

export default function HomePage(){
    const [isLoading, setIsLoading] = useState(false)
    const [bmrValue, setBmrValue] = useState(0)
    const router = useRouter()
    const {user} = useUser()

    const today = new Date()
    const options: Intl.DateTimeFormatOptions = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    }
    const formattedDate = today.toLocaleDateString('en-US', options)

    useEffect(() => {
        const getBMR = async () => {
            setIsLoading(true)

            await getUserBMR().then((response) => {
                if(response.data.user_bmr_value){
                    setBmrValue(response.data.user_bmr_value)
                }
            })

            setIsLoading(false)
        }

        getBMR()
    }, [])
    
    if(!user){
        return null
    }

    return(
        <>
            <Loading loading={isLoading} />

            <main className="px-20 py-10 w-full">
                <header className="flex justify-between items-start w-full">
                    <div>
                        <h1 className="text-2xl font-medium">Hello, {user.fullName}</h1>
                        <p>It&apos;s {formattedDate}</p>
                    </div>
                    <SearchBar />
                </header>
                <section className="mt-7">
                    <BMRCard 
                        bmrValue={bmrValue}
                    />
                </section>
            </main>
        </>
    )
}
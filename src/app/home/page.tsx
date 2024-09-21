"use client"
import { useUser } from "@clerk/nextjs"
import { Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function HomePage(){
    const router = useRouter()
    const [inputValue, setInputValue] = useState("")
    const {user} = useUser()

    const today = new Date()
    const options: Intl.DateTimeFormatOptions = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    }
    const formattedDate = today.toLocaleDateString('en-US', options)

    const handleSearch = () => {
        if (inputValue.trim()) {
            router.push(`/search?keyword=${inputValue}`)
        }
    }
    
    if(!user){
        return null
    }

    return(
        <main className="px-20 py-10 w-full">
            <div className="flex justify-between items-start w-full">
                <div>
                    <h1 className="text-2xl font-medium">Hello, {user.fullName}</h1>
                    <p>It&apos;s {formattedDate}</p>
                </div>
                <div className="flex items-center bg-[#f2f2f2] p-2 rounded-xl gap-2">
                    <Search color="gray"/>
                    <input 
                        type="text" 
                        placeholder="Search for food" 
                        className="bg-[#f2f2f2] focus: outline-none"
                        onChange={(e) => setInputValue(e.target.value)} 
                        onBlur={handleSearch}
                    />
                </div>
            </div>
        </main>
    )
}
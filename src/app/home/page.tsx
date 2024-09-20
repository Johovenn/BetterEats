"use client"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"

export default function HomePage(){
    const router = useRouter()
    const {user} = useUser()
    if(!user){
        return null
    }

    const today = new Date()
    const options: Intl.DateTimeFormatOptions = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    }
    const formattedDate = today.toLocaleDateString('en-US', options)

    return(
        <main className="px-20 py-10">
            <div>
                <h1 className="text-2xl font-medium">Hello, {user.fullName}</h1>
                <p>It&apos;s {formattedDate}</p>
            </div>
        </main>
    )
}
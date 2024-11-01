import Loading from "@/components/Loading"
import PageHeader from "@/components/PageHeader"
import { useState } from "react"



export default function ArticlePage(){
    const [isLoading, setIsLoading] = useState(false)

    return(
        <>
            <Loading loading={isLoading}></Loading>

            <PageHeader 
                title="Articles"
            />
        </>
    )
}
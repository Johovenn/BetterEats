"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TDEECalculator from "./components/TDEECalculator"
import BMICalculator from "./components/BMICalculator"

export default function HealthCalculatorPage() {
    const searchParams = useSearchParams()
    const router = useRouter()

    const defaultTab = searchParams.get("tab") || "bmi"
    const [selectedTab, setSelectedTab] = useState(defaultTab)

    const handleTabChange = (value: string) => {
        setSelectedTab(value)
        router.push(`?tab=${value}`, { scroll: false })
    }

    useEffect(() => {
        const value = searchParams.get("tab") || "bmi"
        setSelectedTab(value)
    }, [searchParams])

    return (
        <section className="w-full">
            <Tabs value={selectedTab} onValueChange={handleTabChange} className="ml-20 md:m-0">
                <TabsList>
                    <TabsTrigger value="bmi">BMI Calculator</TabsTrigger>
                    <TabsTrigger value="tdee">TDEE Calculator</TabsTrigger>
                </TabsList>
                <TabsContent value="tdee" className="ml-[-80px] md:ml-[-25px] mt-5">
                    <TDEECalculator />
                </TabsContent>
                <TabsContent value="bmi" className="ml-[-80px] md:ml-[-25px] md:m-0">
                    <BMICalculator />
                </TabsContent>
            </Tabs>
        </section>
    )
}

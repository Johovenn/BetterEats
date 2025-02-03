"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TDEECalculator from "./components/TDEECalculator";
import BMICalculator from "./components/BMICalculator";

export default function HealthCalculatorPage() {
    return (
        <>
            <section className="w-full">
                <Tabs defaultValue="bmi" className="ml-20 md:m-0">
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
        </>
    )
}

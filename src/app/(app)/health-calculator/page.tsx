"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TDEECalculator from "./components/TDEECalculator";
import BMICalculator from "./components/BMICalculator";

export default function HealthCalculatorPage() {
    return (
        <>
            <section className="flex justify-between items-start w-full mb-5">
                <Tabs defaultValue="bmi">
                    <TabsList>
                        <TabsTrigger value="bmi">BMI Calculator</TabsTrigger>
                        <TabsTrigger value="tdee">TDEE Calculator</TabsTrigger>
                    </TabsList>
                    <TabsContent value="tdee">
                        <TDEECalculator />
                    </TabsContent>
                    <TabsContent value="bmi">
                        <BMICalculator />
                    </TabsContent>
                </Tabs>
            </section>
        </>
    )
}

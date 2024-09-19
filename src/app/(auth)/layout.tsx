import { ReactNode } from "react";


export default function AuthLayout({children}: {children: ReactNode}){
    return(
        <main className="flex items-center justify-center h-screen w-full">
            {children}
        </main>
    )
}
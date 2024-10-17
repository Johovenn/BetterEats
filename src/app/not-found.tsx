import Link from "next/link"

export default function NotFoundPage(){
    return (
        <div className="flex justify-center items-center flex-col h-screen w-screen">
            <h1 className="text-2xl font-bold">Page Not Found</h1>
            <p>Go back by clicking <Link href="/dashboard" className="font-medium text-orange-default underline">here</Link></p>
        </div>
    )
}
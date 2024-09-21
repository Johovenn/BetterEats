import Link from "next/link"

export default function NotFoundPage(){
    return (
        <main className="w-full flex justify-center items-center flex-col">
            <h1 className="text-2xl font-bold">Page Not Found</h1>
            <p>Go back to home page by clicking <Link href="/home" className="font-medium text-primary underline">here</Link></p>
        </main>
    )
}
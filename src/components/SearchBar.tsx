import { useUser } from "@clerk/nextjs";
import { Search } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBar(){
    const router = useRouter()
    const pathname = usePathname()
    const {user} = useUser()
    const role = user?.publicMetadata?.role
    const [inputValue, setInputValue] = useState("")

    const handleEnterKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSearch()
        }
    }

    const handleSearch = () => {
        if(inputValue.trim()){
            if(role !== 'admin'){
                router.push(`/search?keyword=${encodeURIComponent(inputValue)}`)
            }
            else {
                router.push(`/admin/meal?keyword=${encodeURIComponent(inputValue)}`)
            }
        } else {
            if(pathname === '/search'){
                router.push('/search')
            }
            else if(pathname === '/admin/meal'){
                router.push('/admin/meal')
            }
        }
    }

    return(
        <div className="flex items-center bg-white p-2 rounded-xl gap-2 shadow">
            <Search color="gray" size={20}/>
            <input 
                type="text" 
                placeholder="Search for food" 
                className="bg-white focus:outline-none text-sm"
                onChange={(e) => setInputValue(e.target.value)} 
                onBlur={handleSearch}
                onKeyDown={handleEnterKeyDown}
            />
        </div>
    )
}
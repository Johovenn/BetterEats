import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBar(){
    const router = useRouter()
    const [inputValue, setInputValue] = useState("")

    const handleEnterKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSearch()
        }
    }

    const handleSearch = () => {
        if (inputValue.trim()) {
            router.push(`/search?keyword=${encodeURIComponent(inputValue)}`)
        }
    }

    return(
        <div className="flex items-center bg-[#f2f2f2] p-2 rounded-xl gap-2">
            <Search color="gray"/>
            <input 
                type="text" 
                placeholder="Search for food" 
                className="bg-[#f2f2f2] focus: outline-none"
                onChange={(e) => setInputValue(e.target.value)} 
                onBlur={handleSearch}
                onKeyDown={handleEnterKeyDown}
            />
        </div>
    )
}
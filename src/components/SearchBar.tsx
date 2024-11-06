import { useUser } from "@clerk/nextjs";
import { Search } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

interface SearchBarProps{
    mode: "article" | "meal"
}

export default function SearchBar(props: SearchBarProps){
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
            if(props.mode === 'meal'){
                if(role !== 'admin'){
                    router.push(`/search?keyword=${encodeURIComponent(inputValue)}`)
                }
                else {
                    router.push(`/admin/meal?keyword=${encodeURIComponent(inputValue)}`)
                }
            }
            else {
                if(role !== 'admin'){
                    router.push(`/article?keyword=${encodeURIComponent(inputValue)}`)
                }
                else {
                    router.push(`/admin/article?keyword=${encodeURIComponent(inputValue)}`)
                }
            }
        } else {
            if(props.mode === 'meal'){
                if(pathname === '/search'){
                    router.push('/search')
                }
                else if(pathname === '/admin/meal'){
                    router.push('/admin/meal')
                }
            }
            else {
                if(pathname === '/article'){
                    router.push('/article')
                }
                else if(pathname === '/admin/article'){
                    router.push('/admin/article')
                }
            }
        }
    }

    return(
        <div className="flex items-center bg-white p-2 rounded-xl gap-2 shadow search-bar">
            <Search color="gray" size={20}/>
            <input 
                type="text" 
                placeholder={props.mode === 'meal' ? 'Search for food' : 'Search for articles'} 
                className="bg-white focus:outline-none text-sm"
                onChange={(e) => setInputValue(e.target.value)} 
                onBlur={handleSearch}
                onKeyDown={handleEnterKeyDown}
            />
        </div>
    )
}
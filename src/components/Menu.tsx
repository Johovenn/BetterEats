import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Button } from "./ui/button"
import { Ellipsis } from "lucide-react"
import { ReactNode } from "react"

interface MenuProps{
    label: string | ReactNode
    items: {
        label: string
        onClick: () => void
    }[]
    className?: string
}

export default function Menu(props: MenuProps){
    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger className="meal-menu-trigger">
                <Button variant={"outline"} size={"icon"}>{props.label}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel className={props.className}>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {
                    props.items.map((item) => (
                        <DropdownMenuItem key={item.label} onClick={item.onClick} className={props.className}>{item.label}</DropdownMenuItem>
                    ))
                }
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
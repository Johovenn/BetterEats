import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog"

interface AlertModalProps{
    title: string
    description: string
    isOpen: boolean
    handleClose: () => void
    setIsOpen: (value: boolean) => void
    onConfirm: () => void
}

export default function AlertModal(props: AlertModalProps){

    return(
        <AlertDialog open={props.isOpen} onOpenChange={props.setIsOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{props.title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {props.description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={props.handleClose}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={props.onConfirm}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
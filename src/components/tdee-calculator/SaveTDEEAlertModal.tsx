import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog"

interface SaveTDEEAlertModalProps{
    isOpen: boolean
    handleClose: () => void
    setIsOpen: (value: boolean) => void
    onConfirm: () => void
}

export default function SaveTDEEAlertModal(props: SaveTDEEAlertModalProps){

    return(
        <AlertDialog open={props.isOpen} onOpenChange={props.setIsOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Your food recommendations and meal plans will be based on the latest saved TDEE data. This action cannot be undone
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
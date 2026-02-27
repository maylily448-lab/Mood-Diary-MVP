import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";

interface ConfirmDeleteModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    title?: string;
    description?: string;
}

export function ConfirmDeleteModal({
    open,
    onOpenChange,
    onConfirm,
    title = "정말로 삭제할까요?",
    description = "이 작업은 되돌릴 수 없습니다. 삭제된 기록은 영구적으로 사라집니다.",
}: ConfirmDeleteModalProps) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="max-w-xs rounded-2xl bg-card">
                <AlertDialogHeader className="flex flex-col items-center text-center">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                        <Trash2 className="h-6 w-6 text-destructive" />
                    </div>
                    <AlertDialogTitle className="text-lg">{title}</AlertDialogTitle>
                    <AlertDialogDescription className="text-sm">
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-6 flex gap-2 sm:justify-center">
                    <AlertDialogCancel className="w-full flex-1 rounded-xl">취소</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirm}
                        className="w-full flex-1 rounded-xl bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                    >
                        삭제
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

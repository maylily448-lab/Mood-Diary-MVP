import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { BEAR_HAPPY } from '@/store/moodStore';
import { motion, AnimatePresence } from 'framer-motion';

interface SuccessModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    message?: string;
}

export function SuccessModal({ open, onOpenChange, message = '오늘도 수고 많았어요!' }: SuccessModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-xs rounded-2xl border-accent text-center bg-card shadow-lg sm:max-w-[425px]">
                <DialogHeader className="flex flex-col items-center">
                    <AnimatePresence>
                        {open && (
                            <motion.div
                                initial={{ scale: 0.5, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                className="relative flex flex-col items-center"
                            >
                                {/* Speech Bubble */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="relative mb-6 rounded-2xl bg-primary px-4 py-3 shadow-md"
                                >
                                    <p className="text-sm font-bold text-primary-foreground">
                                        {message}
                                    </p>
                                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-primary" />
                                </motion.div>

                                <motion.img
                                    src={BEAR_HAPPY}
                                    alt="축하 곰돌이"
                                    className="h-32 w-32 object-contain"
                                    animate={{ y: [0, -8, 0] }}
                                    transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <DialogTitle className="mt-4 text-xl">기록 완료! 🎉</DialogTitle>
                    <DialogDescription className="mt-2 text-sm text-muted-foreground">
                        소중한 감정이 안전하게 저장되었어요.
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}

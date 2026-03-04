import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RECOVERY_GUIDES, type RecoveryGuide } from '@/store/moodStore';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RefreshCw, CheckCircle2 } from 'lucide-react';

interface RecoveryToolboxProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const RecoveryToolbox = ({ open, onOpenChange }: RecoveryToolboxProps) => {
    const [guideIndex, setGuideIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);

    // Pick a random guide when opened or when index changes
    const guide = useMemo(() => RECOVERY_GUIDES[guideIndex], [guideIndex]);

    useEffect(() => {
        if (open) {
            handleRandomize();
            setIsCompleted(false);
        } else {
            setIsActive(false);
        }
    }, [open]);

    useEffect(() => {
        let timer: number;
        if (isActive && timeLeft > 0) {
            timer = window.setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && isActive) {
            setIsActive(false);
            setIsCompleted(true);
            // Auto close after 2 seconds on completion
            setTimeout(() => onOpenChange(false), 2000);
        }
        return () => clearInterval(timer);
    }, [isActive, timeLeft, onOpenChange]);

    const handleRandomize = () => {
        let nextIndex;
        do {
            nextIndex = Math.floor(Math.random() * RECOVERY_GUIDES.length);
        } while (nextIndex === guideIndex && RECOVERY_GUIDES.length > 1);

        setGuideIndex(nextIndex);
        setTimeLeft(RECOVERY_GUIDES[nextIndex].durationSec);
        setIsActive(false);
        setIsCompleted(false);
    };

    const startTimer = () => setIsActive(true);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md rounded-3xl border-none bg-card p-0 overflow-hidden">
                <div className="relative p-6 text-center">
                    <AnimatePresence mode="wait">
                        {!isCompleted ? (
                            <motion.div
                                key={guide.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.05 }}
                                className="flex flex-col items-center gap-4"
                            >
                                <div className="text-6xl mb-2">{guide.emoji}</div>
                                <DialogHeader>
                                    <DialogTitle className="text-xl font-bold text-center">{guide.title}</DialogTitle>
                                    <DialogDescription className="text-center text-muted-foreground break-keep">
                                        {guide.description}
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="mt-4 flex flex-col items-center gap-6 w-full">
                                    {/* Timer UI */}
                                    <div className="relative flex items-center justify-center w-32 h-32">
                                        <svg className="w-full h-full transform -rotate-90">
                                            <circle
                                                cx="64"
                                                cy="64"
                                                r="58"
                                                stroke="currentColor"
                                                strokeWidth="8"
                                                fill="transparent"
                                                className="text-secondary"
                                            />
                                            <motion.circle
                                                cx="64"
                                                cy="64"
                                                r="58"
                                                stroke="currentColor"
                                                strokeWidth="8"
                                                fill="transparent"
                                                strokeDasharray="364.4"
                                                animate={{ strokeDashoffset: 364.4 * (1 - timeLeft / guide.durationSec) }}
                                                className="text-primary"
                                            />
                                        </svg>
                                        <span className="absolute text-2xl font-bold text-foreground">
                                            {timeLeft}s
                                        </span>
                                    </div>

                                    <div className="flex gap-2 w-full">
                                        {!isActive ? (
                                            <Button
                                                onClick={startTimer}
                                                className="flex-1 rounded-2xl font-bold h-12"
                                            >
                                                시작하기
                                            </Button>
                                        ) : (
                                            <Button
                                                disabled
                                                variant="secondary"
                                                className="flex-1 rounded-2xl font-bold h-12"
                                            >
                                                진행 중...
                                            </Button>
                                        )}
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={handleRandomize}
                                            disabled={isActive}
                                            className="rounded-2xl h-12 w-12"
                                        >
                                            <RefreshCw size={20} className={isActive ? 'opacity-50' : ''} />
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="completed"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col items-center gap-4 py-8"
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', damping: 12 }}
                                >
                                    <CheckCircle2 className="h-20 w-20 text-green-500" />
                                </motion.div>
                                <div className="text-center">
                                    <h3 className="text-xl font-bold text-foreground mb-1">수고했어요 💛</h3>
                                    <p className="text-sm text-muted-foreground">잠시나마 마음이 편안해졌길 바라요.</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </DialogContent>
        </Dialog>
    );
};

import { motion } from 'framer-motion';
import { BEAR_HAPPY } from '@/store/moodStore';

interface LoaderProps {
    message?: string;
}

export function FloatingBearLoader({ message = '잠시만 기다려주세요...' }: LoaderProps) {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
            <motion.img
                src={BEAR_HAPPY}
                alt="로딩 곰돌이"
                className="h-24 w-24 object-contain"
                animate={{
                    y: [-10, 10, -10],
                    rotate: [-5, 5, -5]
                }}
                transition={{
                    repeat: Infinity,
                    duration: 3,
                    ease: 'easeInOut'
                }}
            />
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-4 text-sm font-medium text-foreground"
            >
                {message}
            </motion.p>
        </div>
    );
}

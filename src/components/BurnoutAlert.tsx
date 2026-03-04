import { motion } from 'framer-motion';
import { type MoodType } from '@/store/moodStore';
import { Button } from './ui/button';
import { AlertCircle, Zap, ShieldCheck } from 'lucide-react';

interface BurnoutAlertProps {
    mood: MoodType | null;
    energy: number;
    onOpenSOS: () => void;
}

export const BurnoutAlert = ({ mood, energy, onOpenSOS }: BurnoutAlertProps) => {
    // Condition A: mood='great'|'good' & energy < 30
    const isHighMoodLowEnergy = (mood === 'great' || mood === 'good') && energy < 30;

    // Condition B: mood='sad'|'angry' & energy < 30
    const isLowMoodLowEnergy = (mood === 'sad' || mood === 'angry') && energy < 30;

    // Condition C: energy >= 70
    const isHighEnergy = energy >= 70;

    if (!isHighMoodLowEnergy && !isLowMoodLowEnergy && !isHighEnergy) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-6 w-full rounded-2xl p-4 border shadow-sm flex flex-col gap-3 ${isLowMoodLowEnergy ? 'bg-destructive/10 border-destructive/20' : 'bg-primary/5 border-primary/10'
                }`}
        >
            <div className="flex items-start gap-3">
                <div className="mt-0.5">
                    {isLowMoodLowEnergy && <AlertCircle className="text-destructive" size={20} />}
                    {isHighMoodLowEnergy && <Zap className="text-yellow-500" size={20} />}
                    {isHighEnergy && <ShieldCheck className="text-green-500" size={20} />}
                </div>
                <div className="flex-1">
                    <p className="text-sm font-bold text-foreground">
                        {isLowMoodLowEnergy && "번아웃 주의보! 🆘"}
                        {isHighMoodLowEnergy && "가짜 활기 주의보! ⚠️"}
                        {isHighEnergy && "에너지가 듬뿍 충전됐네요! 🔋"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 break-keep leading-relaxed">
                        {isLowMoodLowEnergy && "지금은 모든 일을 내려놓고 쉬어야 할 때예요. 1분 SOS 도구함을 사용해보는 건 어떨까요?"}
                        {isHighMoodLowEnergy && "기분은 좋지만 에너지가 매우 부족해요. 무리한 활동보다는 조기 퇴근이나 휴식을 추천해요."}
                        {isHighEnergy && "멋진 하루군요! 이 에너지를 나를 위해 소중히 사용해보세요."}
                    </p>
                </div>
            </div>

            {isLowMoodLowEnergy && (
                <Button
                    variant="destructive"
                    size="sm"
                    onClick={onOpenSOS}
                    className="rounded-xl text-xs font-bold w-full h-9"
                >
                    지금 SOS 도움받기
                </Button>
            )}
        </motion.div>
    );
};

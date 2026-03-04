import * as Slider from '@radix-ui/react-slider';
import { BatteryFull, BatteryMedium, BatteryLow } from 'lucide-react';

interface EnergySliderProps {
    value: number;
    onChange: (value: number) => void;
}

export const EnergySlider = ({ value, onChange }: EnergySliderProps) => {
    const getBatteryIcon = () => {
        if (value >= 70) return <BatteryFull className="text-green-500" size={24} />;
        if (value >= 30) return <BatteryMedium className="text-yellow-500" size={24} />;
        return <BatteryLow className="text-red-500" size={24} />;
    };

    const getBatteryLabel = () => {
        if (value >= 80) return "에너지가 넘쳐요! ⚡";
        if (value >= 50) return "충분해요 😊";
        if (value >= 30) return "조금 피곤해요.. 🥱";
        return "방전 직전이에요 🆘";
    };

    return (
        <div className="flex flex-col gap-4 w-full bg-secondary/20 p-4 rounded-2xl border border-border/50">
            <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-foreground">지금 에너지가 얼마나 남았나요?</label>
                <div className="flex items-center gap-2">
                    {getBatteryIcon()}
                    <span className="text-lg font-bold text-foreground">{value}%</span>
                </div>
            </div>

            <Slider.Root
                className="relative flex items-center select-none touch-none w-full h-5"
                value={[value]}
                onValueChange={(vals) => onChange(vals[0])}
                max={100}
                step={1}
            >
                <Slider.Track className="bg-secondary relative grow rounded-full h-[6px]">
                    <Slider.Range className="absolute bg-primary rounded-full h-full" />
                </Slider.Track>
                <Slider.Thumb
                    className="block w-5 h-5 bg-background border-2 border-primary shadow-md rounded-[10px] hover:scale-110 focus:outline-none transition-transform cursor-pointer"
                    aria-label="Energy level"
                />
            </Slider.Root>

            <p className="text-[11px] text-muted-foreground text-center italic">
                {getBatteryLabel()}
            </p>
        </div>
    );
};

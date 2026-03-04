import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MOODS, CHEER_MESSAGES, ACTIVITY_TAGS, MOOD_CHEER_BY_TYPE,
  useMoodStore, type MoodType,
} from '@/store/moodStore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/ThemeToggle';
import { SuccessModal } from '@/components/SuccessModal';
import { FloatingBearLoader } from '@/components/FloatingBearLoader';
import { RecoveryToolbox } from '@/components/RecoveryToolbox';
import { EnergySlider } from '@/components/EnergySlider';
import { BurnoutAlert } from '@/components/BurnoutAlert';
import { supabase } from '@/lib/supabase';
import { HeartPulse, Heart } from 'lucide-react';

const Index = () => {
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [memo, setMemo] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [cheerMsg, setCheerMsg] = useState('');
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [savedMood, setSavedMood] = useState<MoodType | null>(null);
  const [showRecovery, setShowRecovery] = useState(false);
  const [selectedEnergy, setSelectedEnergy] = useState(50);
  const [cheerMessage, setCheerMessage] = useState('');
  const [isThanked, setIsThanked] = useState(false);

  const [dailyQuote, setDailyQuote] = useState<string>('오늘 하루도 당신답게 빛나길 ✨');

  const addEntry = useMoodStore((s) => s.addEntry);
  const fetchCheerMessage = useMoodStore((s) => s.fetchCheerMessage);
  const entries = useMoodStore((s) => s.entries);
  const isLoading = useMoodStore((s) => s.isLoading);

  useEffect(() => {
    const fetchRandomQuote = async () => {
      const { data, error } = await supabase
        .from('daily_quotes')
        .select('quote');

      if (!error && data && data.length > 0) {
        const randomQ = data[Math.floor(Math.random() * data.length)];
        setDailyQuote(randomQ.quote);
      }
    };
    fetchRandomQuote();
  }, []);

  // Weekly mood summary
  const weeklySummary = useMemo(() => {
    const now = new Date();
    const weekAgo = new Date(now);
    weekAgo.setDate(now.getDate() - 7);
    const weekEntries = entries.filter((e) => new Date(e.date) >= weekAgo);
    if (weekEntries.length === 0) return null;

    const freq: Record<string, number> = {};
    weekEntries.forEach((e) => {
      freq[e.mood] = (freq[e.mood] || 0) + 1;
    });
    const topMood = Object.entries(freq).sort((a, b) => b[1] - a[1])[0][0] as MoodType;
    const moodInfo = MOODS.find((m) => m.type === topMood)!;
    return { topMood, moodInfo, count: weekEntries.length };
  }, [entries]);

  const toggleActivity = (id: string) => {
    setSelectedActivities((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    if (!selectedMood) return;

    // Validation
    if (memo.length > 50) {
      alert("메모는 50자 이내로 작성해주세요.");
      return;
    }

    // Fetch personalized message first
    const msg = await fetchCheerMessage(selectedMood, selectedEnergy);
    setCheerMessage(msg);

    await addEntry(selectedMood, memo, selectedActivities, selectedEnergy);

    setCheerMsg(msg);
    setSavedMood(selectedMood);
    setShowSuccess(true);

    setSelectedMood(null);
    setMemo('');
    setSelectedActivities([]);
    setSelectedEnergy(50);
    setIsThanked(false);
  };

  const savedMoodInfo = savedMood ? MOODS.find((m) => m.type === savedMood) : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex min-h-screen flex-col items-center px-4 pb-24 pt-12"
      style={{ background: 'var(--sky-gradient)' }}
    >
      {isLoading && <FloatingBearLoader />}

      {/* Header with Theme Toggle */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Title */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-2 text-center"
      >
        <h1 className="text-2xl font-bold text-foreground">오늘 기분이 어때요?</h1>
        <p className="mt-1 text-sm text-muted-foreground">감정을 선택하고 기록해보세요</p>
      </motion.div>

      {/* Daily Quote Card */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-4 w-full max-w-sm rounded-2xl bg-white/60 dark:bg-card/60 backdrop-blur-sm p-4 text-center shadow-sm"
      >
        <p className="text-sm italic text-muted-foreground">
          🌸 "{dailyQuote}"
        </p>
      </motion.div>

      {/* Mood Selector */}
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        {MOODS.map(({ type, image, label }, i) => (
          <motion.button
            key={type}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15 + i * 0.08, type: 'spring', stiffness: 300 }}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { setSelectedMood(type); setSavedMood(null); }}
            className={`flex flex-col items-center gap-2 rounded-xl border-2 bg-card p-4 shadow-sm transition-all ${selectedMood === type
              ? 'border-primary shadow-md scale-105'
              : 'border-transparent hover:border-border'
              }`}
          >
            <img src={image} alt={label} className="h-16 w-16 object-contain" />
            <span className="text-sm font-medium text-foreground/80">{label}</span>
          </motion.button>
        ))}
      </div>

      {/* Weekly Mood Summary */}
      {weeklySummary && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 w-full max-w-sm rounded-2xl bg-card p-4 shadow-sm border border-border/50"
        >
          <p className="mb-3 text-sm font-bold text-foreground">나의 이번 주 날씨</p>
          <div className="flex items-center gap-4 bg-secondary/30 p-3 rounded-xl">
            <img
              src={weeklySummary.moodInfo.image}
              alt={weeklySummary.moodInfo.label}
              className="h-12 w-12 object-contain filter drop-shadow-sm"
            />
            <p className="text-sm text-foreground">
              이번 주는 대체로 <span className="font-bold text-primary">'{weeklySummary.moodInfo.label}'</span> 이었어요! 🌤️
              <span className="block mt-0.5 text-xs text-muted-foreground">총 {weeklySummary.count}개의 기록이 있어요.</span>
            </p>
          </div>
        </motion.div>
      )}

      {/* Activity Tags + Memo (when mood selected) */}
      <AnimatePresence>
        {selectedMood && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-6 w-full max-w-sm overflow-hidden"
          >
            {/* Energy Slider */}
            <div className="mb-6">
              <EnergySlider
                value={selectedEnergy}
                onChange={setSelectedEnergy}
              />
            </div>

            {/* Activity Tags (MVP functionality UI only currently) */}
            <div className="mb-4 flex gap-2 overflow-x-auto scrollbar-hide pb-1">
              {ACTIVITY_TAGS.map((tag) => (
                <Badge
                  key={tag.id}
                  onClick={() => toggleActivity(tag.id)}
                  className={`cursor-pointer whitespace-nowrap select-none transition-colors border-0 hover:border-transparent ${selectedActivities.includes(tag.id)
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/70'
                    }`}
                >
                  {tag.emoji} {tag.label}
                </Badge>
              ))}
            </div>

            {/* Memo + Save */}
            <div className="rounded-2xl bg-card p-5 shadow-sm border border-border/50">
              <Input
                placeholder="한 줄 메모를 남겨보세요 ✏️ (최대 50자)"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                maxLength={50}
                className="border-input bg-background/50 text-sm focus-visible:ring-primary"
              />
              <Button
                onClick={handleSave}
                disabled={isLoading}
                className="mt-4 w-full rounded-xl text-sm font-bold tracking-wide"
              >
                저장하기
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interaction Area — post-save bear + speech bubble */}
      <AnimatePresence>
        {savedMood && savedMoodInfo && !selectedMood && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="mt-8 flex flex-col items-center gap-4 w-full max-w-sm"
          >
            <div className="flex flex-col items-center gap-2">
              <motion.div
                animate={isThanked ? {
                  scale: [1, 1.2, 1.1],
                  rotate: [0, -5, 5, 0]
                } : {}}
                className="relative"
              >
                <img
                  src={savedMoodInfo.image}
                  alt={savedMoodInfo.label}
                  className="h-32 w-32 object-contain"
                />
                {isThanked && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute -top-2 -right-2 bg-pink-500 rounded-full p-1"
                  >
                    <Heart className="text-white fill-current" size={16} />
                  </motion.div>
                )}
              </motion.div>

              <div className="relative">
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-card" />
                <div className="bg-card p-4 rounded-2xl shadow-sm border border-border max-w-[280px] text-center">
                  <p className="text-sm font-medium leading-relaxed break-keep">
                    {cheerMsg}
                  </p>
                  {!isThanked && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsThanked(true)}
                      className="mt-2 h-8 text-xs font-bold text-primary hover:bg-primary/10 rounded-xl"
                    >
                      고마워 💛
                    </Button>
                  )}
                  {isThanked && (
                    <p className="mt-2 text-[11px] text-pink-500 font-bold italic animate-pulse">
                      곰돌이가 수줍어해요! 유후~
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Burnout Alert Component */}
            <BurnoutAlert
              mood={savedMood}
              energy={selectedEnergy}
              onOpenSOS={() => setShowRecovery(true)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* SOS FAB */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowRecovery(true)}
        className="fixed right-4 z-40 h-14 w-14 rounded-full bg-destructive text-destructive-foreground shadow-lg flex items-center justify-center border-4 border-background"
        style={{ bottom: 'calc(6rem + env(safe-area-inset-bottom))' }}
      >
        <HeartPulse size={28} />
      </motion.button>

      {/* Recovery Toolbox Component */}
      <RecoveryToolbox
        open={showRecovery}
        onOpenChange={setShowRecovery}
      />

      {/* Success Dialog Component */}
      <SuccessModal
        open={showSuccess}
        onOpenChange={setShowSuccess}
        message={cheerMsg}
      />
    </motion.div>
  );
};

export default Index;

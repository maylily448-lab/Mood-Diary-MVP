import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MOODS, CHEER_MESSAGES, BEAR_HAPPY, DAILY_QUOTES, ACTIVITY_TAGS, MOOD_CHEER_BY_TYPE,
  useMoodStore, type MoodType,
} from '@/store/moodStore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';

const Index = () => {
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [memo, setMemo] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [cheerMsg, setCheerMsg] = useState('');
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [savedMood, setSavedMood] = useState<MoodType | null>(null);

  const addEntry = useMoodStore((s) => s.addEntry);
  const entries = useMoodStore((s) => s.entries);

  // Daily quote — stable per day
  const dailyQuote = useMemo(() => {
    const dayIndex = new Date().getDate() % DAILY_QUOTES.length;
    return DAILY_QUOTES[dayIndex];
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

  const handleSave = () => {
    if (!selectedMood) return;
    addEntry(selectedMood, memo, selectedActivities);
    setCheerMsg(CHEER_MESSAGES[Math.floor(Math.random() * CHEER_MESSAGES.length)]);
    setSavedMood(selectedMood);
    setShowSuccess(true);
    setSelectedMood(null);
    setMemo('');
    setSelectedActivities([]);
  };

  const savedMoodInfo = savedMood ? MOODS.find((m) => m.type === savedMood) : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex min-h-screen flex-col items-center px-4 pb-24 pt-12"
      style={{ background: 'var(--sky-gradient)' }}
    >
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
        className="mt-4 w-full max-w-sm rounded-2xl bg-white/60 backdrop-blur-sm p-4 text-center shadow-sm"
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
            className={`flex flex-col items-center gap-2 rounded-2xl border-2 bg-card p-4 shadow-md transition-colors ${
              selectedMood === type
                ? 'border-primary shadow-lg'
                : 'border-transparent hover:border-accent'
            }`}
          >
            <img src={image} alt={label} className="h-16 w-16 object-contain" />
            <span className="text-xs font-medium text-muted-foreground">{label}</span>
          </motion.button>
        ))}
      </div>

      {/* Weekly Mood Summary */}
      {weeklySummary && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 w-full max-w-sm rounded-2xl bg-card p-4 shadow-md"
        >
          <p className="mb-2 text-sm font-semibold text-foreground">나의 이번 주 날씨</p>
          <div className="flex items-center gap-3">
            <img
              src={weeklySummary.moodInfo.image}
              alt={weeklySummary.moodInfo.label}
              className="h-10 w-10 object-contain"
            />
            <p className="text-sm text-muted-foreground">
              이번 주는 대체로 '{weeklySummary.moodInfo.label}'이었어요! 🌤️
              <span className="ml-1 text-xs text-muted-foreground/70">({weeklySummary.count}건)</span>
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
            {/* Activity Tags */}
            <div className="mb-4 flex gap-2 overflow-x-auto scrollbar-hide pb-1">
              {ACTIVITY_TAGS.map((tag) => (
                <Badge
                  key={tag.id}
                  onClick={() => toggleActivity(tag.id)}
                  className={`cursor-pointer whitespace-nowrap select-none transition-colors ${
                    selectedActivities.includes(tag.id)
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                      : 'bg-secondary/50 text-secondary-foreground hover:bg-secondary/70'
                  }`}
                >
                  {tag.emoji} {tag.label}
                </Badge>
              ))}
            </div>

            {/* Memo + Save */}
            <div className="rounded-2xl bg-card p-5 shadow-md">
              <Input
                placeholder="한 줄 메모를 남겨보세요 ✏️"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                className="border-accent bg-secondary/50 text-sm"
              />
              <Button
                onClick={handleSave}
                className="mt-4 w-full rounded-xl text-sm font-semibold"
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
            className="mt-8 flex flex-col items-center gap-4"
          >
            <motion.img
              src={savedMoodInfo.image}
              alt={savedMoodInfo.label}
              className="h-32 w-32 object-contain"
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            />
            {/* Speech bubble */}
            <div className="relative rounded-2xl bg-card px-5 py-3 shadow-md">
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-card" />
              <p className="text-sm font-medium text-foreground text-center">
                {MOOD_CHEER_BY_TYPE[savedMood]}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Dialog */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="max-w-xs rounded-2xl border-accent text-center">
          <DialogHeader className="flex flex-col items-center">
            <img src={BEAR_HAPPY} alt="축하 곰돌이" className="mb-2 h-24 w-24 object-contain" />
            <DialogTitle className="text-lg">기록 완료! 🎉</DialogTitle>
            <DialogDescription className="mt-2 text-base font-medium text-foreground">
              {cheerMsg}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default Index;

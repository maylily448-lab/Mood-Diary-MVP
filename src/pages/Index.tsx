import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MOODS, CHEER_MESSAGES, BEAR_HAPPY, useMoodStore, type MoodType } from '@/store/moodStore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

const Index = () => {
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [memo, setMemo] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [cheerMsg, setCheerMsg] = useState('');
  const addEntry = useMoodStore((s) => s.addEntry);

  const handleSave = () => {
    if (!selectedMood) return;
    addEntry(selectedMood, memo);
    setCheerMsg(CHEER_MESSAGES[Math.floor(Math.random() * CHEER_MESSAGES.length)]);
    setShowSuccess(true);
    setSelectedMood(null);
    setMemo('');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex min-h-screen flex-col items-center px-4 pb-24 pt-12"
      style={{ background: 'var(--sky-gradient)' }}
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-2 text-center"
      >
        <h1 className="text-2xl font-bold text-foreground">오늘 기분이 어때요?</h1>
        <p className="mt-1 text-sm text-muted-foreground">감정을 선택하고 기록해보세요</p>
      </motion.div>

      <div className="mt-8 flex flex-wrap justify-center gap-4">
        {MOODS.map(({ type, image, label }, i) => (
          <motion.button
            key={type}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15 + i * 0.08, type: 'spring', stiffness: 300 }}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedMood(type)}
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

      <AnimatePresence>
        {selectedMood && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-8 w-full max-w-sm overflow-hidden"
          >
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

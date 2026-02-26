import { motion } from 'framer-motion';
import { useMoodStore, MOODS } from '@/store/moodStore';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

const History = () => {
  const entries = useMoodStore((s) => s.entries);

  const last7 = [...entries]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 7);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen px-4 pb-24 pt-12"
      style={{ background: 'var(--sky-gradient)' }}
    >
      <h1 className="mb-6 text-center text-2xl font-bold text-foreground">최근 기록</h1>

      <div className="mx-auto flex max-w-sm flex-col gap-3">
        {last7.length === 0 && (
          <p className="text-center text-muted-foreground">아직 기록이 없어요 🌱</p>
        )}
        {last7.map((entry, i) => {
          const moodInfo = MOODS.find((m) => m.type === entry.mood);
          return (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center gap-4 rounded-2xl bg-card p-4 shadow-md"
            >
              <img src={moodInfo?.image} alt={moodInfo?.label} className="h-12 w-12 object-contain" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">{moodInfo?.label}</p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(entry.date), 'M월 d일 (EEE)', { locale: ko })}
                </p>
                {entry.memo && (
                  <p className="mt-1 text-sm text-foreground/80">{entry.memo}</p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default History;

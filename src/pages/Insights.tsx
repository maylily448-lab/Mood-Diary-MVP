import { motion } from 'framer-motion';
import { useMoodStore, MOODS, type MoodType } from '@/store/moodStore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';

const MOOD_COLORS: Record<MoodType, string> = {
  great: '#67C6E3',
  good: '#85D4A0',
  meh: '#F4D983',
  sad: '#A8B8D8',
  angry: '#F4A0A0',
};

const Insights = () => {
  const entries = useMoodStore((s) => s.entries);

  const now = new Date();
  const thisMonth = entries.filter((e) => {
    const d = new Date(e.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const data = MOODS.map(({ type, emoji, label }) => ({
    name: `${emoji} ${label}`,
    type,
    count: thisMonth.filter((e) => e.mood === type).length,
  }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen px-4 pb-24 pt-12"
      style={{ background: 'var(--sky-gradient)' }}
    >
      <h1 className="mb-2 text-center text-2xl font-bold text-foreground">이번 달 인사이트</h1>
      <p className="mb-8 text-center text-sm text-muted-foreground">
        {now.getMonth() + 1}월의 감정 기록을 한눈에 확인하세요
      </p>

      <div className="mx-auto max-w-md rounded-2xl bg-card p-5 shadow-md">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
            <Bar dataKey="count" radius={[8, 8, 0, 0]} maxBarSize={40}>
              {data.map((entry) => (
                <Cell key={entry.type} fill={MOOD_COLORS[entry.type]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mx-auto mt-6 max-w-md rounded-2xl bg-card p-5 shadow-md">
        <p className="text-sm font-medium text-foreground">총 기록 수</p>
        <p className="mt-1 text-3xl font-bold text-primary">{thisMonth.length}회</p>
      </div>
    </motion.div>
  );
};

export default Insights;

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useMoodStore, MOODS, type MoodType } from '@/store/moodStore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell, LineChart, Line, Tooltip } from 'recharts';
import { Battery } from 'lucide-react';

const MOOD_COLORS: Record<MoodType, string> = {
  great: '#F9B4C2',
  good: '#F4D983',
  meh: '#A8D8EA',
  sad: '#C3AED6',
  angry: '#F4A0A0',
};

const CustomTick = ({ x, y, payload }: any) => {
  const mood = MOODS.find((m) => m.label === payload.value);
  if (!mood) return null;
  return (
    <g transform={`translate(${x},${y})`}>
      <image href={mood.image} x={-14} y={4} width={28} height={28} />
    </g>
  );
};

const Insights = () => {
  const entries = useMoodStore((s) => s.entries);

  const now = new Date();
  const thisMonth = entries.filter((e) => {
    const d = new Date(e.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const data = MOODS.map(({ type, label }) => ({
    name: label,
    type,
    count: thisMonth.filter((e) => e.mood === type).length,
  }));

  // Energy Trends (last 14 days)
  const energyTrends = useMemo(() => {
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(now.getDate() - 14);

    return entries
      .filter((e) => new Date(e.date) >= fourteenDaysAgo && e.energy_level !== undefined)
      .map((e) => ({
        date: new Date(e.date).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }),
        energy: e.energy_level
      }))
      .reverse();
  }, [entries]);

  const avgEnergy = useMemo(() => {
    const energyEntries = thisMonth.filter(e => e.energy_level !== undefined);
    if (energyEntries.length === 0) return 0;
    const sum = energyEntries.reduce((acc, curr) => acc + (curr.energy_level || 0), 0);
    return Math.round(sum / energyEntries.length);
  }, [thisMonth]);

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
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis
              dataKey="name"
              tick={<CustomTick />}
              axisLine={false}
              tickLine={false}
              height={50}
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

      <div className="mx-auto mt-6 grid max-w-md grid-cols-2 gap-4">
        <div className="rounded-2xl bg-card p-5 shadow-sm border border-border/50">
          <div className="flex items-center gap-2 mb-2">
            <Battery className="text-primary" size={16} />
            <p className="text-xs font-medium text-muted-foreground">평균 에너지</p>
          </div>
          <p className="text-2xl font-bold text-foreground">{avgEnergy}%</p>
        </div>
        <div className="rounded-2xl bg-card p-5 shadow-sm border border-border/50">
          <p className="text-xs font-medium text-muted-foreground mb-2">총 기록 수</p>
          <p className="text-2xl font-bold text-primary">{thisMonth.length}회</p>
        </div>
      </div>

      {/* Energy Trend Chart */}
      <div className="mx-auto mt-6 max-w-md rounded-2xl bg-card p-5 shadow-md border border-border/50">
        <h3 className="mb-4 text-sm font-bold text-foreground">에너지 변화 추세</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={energyTrends}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis
              dataKey="date"
              hide={energyTrends.length > 7}
              tick={{ fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis domain={[0, 100]} hide />
            <Tooltip
              contentStyle={{
                borderRadius: '12px',
                border: 'none',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                fontSize: '12px'
              }}
            />
            <Line
              type="monotone"
              dataKey="energy"
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              dot={{ r: 4, fill: 'hsl(var(--primary))', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
        <p className="mt-2 text-[10px] text-muted-foreground text-center">최근 14일간의 에너지 흐름입니다</p>
      </div>
    </motion.div>
  );
};

export default Insights;

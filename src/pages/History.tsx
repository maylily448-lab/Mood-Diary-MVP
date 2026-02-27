import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMoodStore, MOODS } from '@/store/moodStore';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths
} from 'date-fns';
import { ko } from 'date-fns/locale';
import { LayoutList, CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const History = () => {
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [currentDate, setCurrentDate] = useState(new Date());

  const entries = useMoodStore((s) => s.entries);

  // List View: Display recent 30 entries sorted by newest
  const recentEntries = useMemo(() => {
    return [...entries]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 30);
  }, [entries]);

  // Calendar View: days of the currently selected month
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    return eachDayOfInterval({ start: startDate, end: endDate });
  }, [currentDate]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen px-4 pb-24 pt-12"
      style={{ background: 'var(--sky-gradient)' }}
    >
      <h1 className="mb-6 text-center text-2xl font-bold text-foreground">최근 기록</h1>

      <div className="mx-auto flex max-w-sm justify-center mb-6">
        <div className="flex bg-card p-1 rounded-xl shadow-sm border border-border">
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary/50'
              }`}
          >
            <LayoutList size={18} />
            리스트
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${viewMode === 'calendar' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary/50'
              }`}
          >
            <CalendarDays size={18} />
            캘린더
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-sm">
        <AnimatePresence mode="wait">
          {viewMode === 'list' ? (
            <motion.div
              key="list-view"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col gap-3"
            >
              {recentEntries.length === 0 && (
                <p className="text-center text-muted-foreground mt-10">아직 기록이 없어요 🌱</p>
              )}
              {recentEntries.map((entry, i) => {
                const moodInfo = MOODS.find((m) => m.type === entry.mood);
                return (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-4 rounded-2xl bg-card p-4 shadow-md border-transparent border transition-colors hover:border-accent"
                  >
                    <img src={moodInfo?.image} alt={moodInfo?.label} className="h-12 w-12 object-contain" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground">{moodInfo?.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(entry.date), 'M월 d일 (EEE)', { locale: ko })}
                      </p>
                      {entry.memo && (
                        <p className="mt-1 text-sm text-foreground/80 break-words">{entry.memo}</p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              key="calendar-view"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-card rounded-3xl p-5 shadow-lg max-w-sm mx-auto min-h-[400px]"
            >
              <div className="flex items-center justify-between mb-6 px-2">
                <Button variant="ghost" size="icon" onClick={() => setCurrentDate(subMonths(currentDate, 1))}>
                  <ChevronLeft size={20} className="text-muted-foreground" />
                </Button>
                <h2 className="text-lg font-bold text-foreground">
                  {format(currentDate, 'yyyy년 M월')}
                </h2>
                <Button variant="ghost" size="icon" onClick={() => setCurrentDate(addMonths(currentDate, 1))}>
                  <ChevronRight size={20} className="text-muted-foreground" />
                </Button>
              </div>

              <div className="grid grid-cols-7 gap-y-4 gap-x-1 text-center mb-2">
                {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
                  <div key={day} className="text-[11px] font-medium text-muted-foreground">
                    {day}
                  </div>
                ))}

                {calendarDays.map((date, i) => {
                  const dayEntry = entries.find((e) => isSameDay(new Date(e.date), date));
                  const moodInfo = dayEntry ? MOODS.find((m) => m.type === dayEntry.mood) : null;
                  const isCurrentMonth = isSameMonth(date, currentDate);
                  const isToday = isSameDay(date, new Date());

                  return (
                    <div
                      key={date.toISOString()}
                      className={`flex flex-col items-center justify-center p-1 rounded-xl transition-colors ${!isCurrentMonth ? 'opacity-30' : ''
                        } ${isToday ? 'bg-secondary/50' : ''}`}
                    >
                      <span className={`text-[10px] mb-1 font-medium ${isToday ? 'text-primary font-bold' : 'text-foreground'}`}>
                        {format(date, 'd')}
                      </span>
                      <div className="h-8 w-8 flex items-center justify-center">
                        {moodInfo ? (
                          <motion.img
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', delay: i * 0.01 }}
                            src={moodInfo.image}
                            alt={moodInfo.label}
                            className="h-full w-full object-contain drop-shadow-sm"
                          />
                        ) : (
                          <div className="h-2 w-2 rounded-full bg-border/50" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default History;

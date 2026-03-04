import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMoodStore, MOODS, type MoodType } from '@/store/moodStore';
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
import { LayoutList, CalendarDays, ChevronLeft, ChevronRight, BatteryFull, BatteryMedium, BatteryLow, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const History = () => {
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMood, setFilterMood] = useState<MoodType | null>(null);

  const entries = useMoodStore((s) => s.entries);

  // Filtered Entries based on search and mood
  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const matchesMood = !filterMood || entry.mood === filterMood;
      const matchesSearch = !searchQuery ||
        (entry.memo && entry.memo.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesMood && matchesSearch;
    });
  }, [entries, filterMood, searchQuery]);

  // List View: Display recent 30 entries sorted by newest
  const recentEntries = useMemo(() => {
    return [...filteredEntries]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 30);
  }, [filteredEntries]);

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

      {/* NEW: Search and Filter UI */}
      <div className="mx-auto max-w-sm mb-6 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <Input
            placeholder="메모 내용 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10 bg-card/50 rounded-xl"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Mood Filter Chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <Badge
            variant={filterMood === null ? 'default' : 'secondary'}
            onClick={() => setFilterMood(null)}
            className="cursor-pointer whitespace-nowrap rounded-full px-3 py-1"
          >
            전체
          </Badge>
          {MOODS.map((m) => (
            <Badge
              key={m.type}
              variant={filterMood === m.type ? 'default' : 'secondary'}
              onClick={() => setFilterMood(m.type as MoodType)}
              className={`cursor-pointer whitespace-nowrap rounded-full px-3 py-1 flex gap-1.5 items-center ${filterMood === m.type ? 'bg-primary text-primary-foreground' : 'bg-card'
                }`}
            >
              <img src={m.image} alt={m.label} className="w-4 h-4 object-contain" />
              {m.label}
            </Badge>
          ))}
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

                      {/* Energy Level Display */}
                      {entry.energy_level !== undefined && (
                        <div className="mt-1 flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground bg-secondary/30 w-fit px-2 py-0.5 rounded-full">
                          {entry.energy_level >= 70 ? (
                            <BatteryFull size={12} className="text-green-500" />
                          ) : entry.energy_level >= 30 ? (
                            <BatteryMedium size={12} className="text-yellow-500" />
                          ) : (
                            <BatteryLow size={12} className="text-destructive" />
                          )}
                          에너지 {entry.energy_level}%
                        </div>
                      )}

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

              <div className="grid grid-cols-7 gap-1">
                {['일', '월', '화', '수', '목', '금', '토'].map((d) => (
                  <div key={d} className="text-center text-[10px] font-bold text-muted-foreground py-2">
                    {d}
                  </div>
                ))}

                {calendarDays.map((date, i) => {
                  const dayEntry = filteredEntries.find((e) => isSameDay(new Date(e.date), date));
                  const moodInfo = dayEntry ? MOODS.find((m) => m.type === dayEntry.mood) : null;
                  const isCurrentMonth = isSameMonth(date, currentDate);
                  const isToday = isSameDay(date, new Date());

                  return (
                    <motion.div
                      key={date.toISOString()}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedDate(date)}
                      className={`flex flex-col items-center justify-center p-1 rounded-xl cursor-pointer transition-colors ${!isCurrentMonth ? 'opacity-30' : ''
                        } ${isToday ? 'bg-secondary/50' : ''} ${selectedDate && isSameDay(date, selectedDate) ? 'ring-2 ring-primary ring-offset-1 bg-primary/10' : ''}`}
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
                    </motion.div>
                  );
                })}
              </div>

              {/* Selected Date Detail */}
              <div className="mt-8 border-t border-border pt-6">
                {selectedDate && (() => {
                  const dayEntry = entries.find((e) => isSameDay(new Date(e.date), selectedDate));
                  const moodInfo = dayEntry ? MOODS.find((m) => m.type === dayEntry.mood) : null;

                  if (!dayEntry) return (
                    <div className="text-center py-4">
                      <p className="text-xs text-muted-foreground">
                        {format(selectedDate, 'M월 d일')} - 기록이 없습니다.
                      </p>
                    </div>
                  );

                  return (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-4 bg-secondary/20 p-4 rounded-2xl border border-border/30"
                    >
                      <img src={moodInfo?.image} alt={moodInfo?.label} className="h-12 w-12 object-contain" />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <p className="text-sm font-bold text-foreground">{moodInfo?.label}</p>
                          <span className="text-[10px] text-muted-foreground">
                            {format(new Date(dayEntry.date), 'a h:mm', { locale: ko })}
                          </span>
                        </div>

                        {dayEntry.energy_level !== undefined && (
                          <div className="mt-1 flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground bg-background/50 w-fit px-2 py-0.5 rounded-full">
                            {dayEntry.energy_level >= 70 ? (
                              <BatteryFull size={12} className="text-green-500" />
                            ) : dayEntry.energy_level >= 30 ? (
                              <BatteryMedium size={12} className="text-yellow-500" />
                            ) : (
                              <BatteryLow size={12} className="text-destructive" />
                            )}
                            에너지 {dayEntry.energy_level}%
                          </div>
                        )}

                        {dayEntry.memo && (
                          <p className="mt-2 text-sm text-foreground/80 leading-snug">{dayEntry.memo}</p>
                        )}
                      </div>
                    </motion.div>
                  );
                })()}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default History;

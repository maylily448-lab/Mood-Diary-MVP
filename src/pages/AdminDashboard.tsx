import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { MOODS, type MoodType } from '@/store/moodStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Plus } from 'lucide-react';
import { ConfirmDeleteModal } from '@/components/ConfirmDeleteModal';

interface Quote {
    id: string;
    quote: string;
    created_at: string;
}

const MOOD_COLORS: Record<MoodType, string> = {
    great: '#F9B4C2',
    good: '#F4D983',
    meh: '#A8D8EA',
    sad: '#C3AED6',
    angry: '#F4A0A0',
};

const AdminDashboard = () => {
    const [statsData, setStatsData] = useState<any[]>([]);
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [newQuote, setNewQuote] = useState('');

    // Delete Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [quoteToDelete, setQuoteToDelete] = useState<string | null>(null);

    useEffect(() => {
        fetchStats();
        fetchQuotes();
    }, []);

    const fetchStats = async () => {
        const { data, error } = await supabase.from('mood_entries').select('emoji_type');
        if (!error && data) {
            const counts: Record<string, number> = {};
            data.forEach((entry) => {
                counts[entry.emoji_type] = (counts[entry.emoji_type] || 0) + 1;
            });

            const formatted = Object.keys(counts).map((key) => {
                const moodInfo = MOODS.find((m) => m.type === key);
                return {
                    name: moodInfo?.label || key,
                    type: key as MoodType,
                    value: counts[key],
                };
            });
            setStatsData(formatted);
        }
    };

    const fetchQuotes = async () => {
        const { data, error } = await supabase
            .from('daily_quotes')
            .select('*')
            .order('created_at', { ascending: false });
        if (!error && data) setQuotes(data);
    };

    const handleAddQuote = async () => {
        if (!newQuote.trim()) return;
        const { error } = await supabase.from('daily_quotes').insert([{ quote: newQuote }]);
        if (!error) {
            setNewQuote('');
            fetchQuotes();
        } else {
            alert("문구 추가에 실패했습니다.");
        }
    };

    const handleDeleteClick = (id: string) => {
        setQuoteToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!quoteToDelete) return;
        const { error } = await supabase.from('daily_quotes').delete().eq('id', quoteToDelete);
        if (!error) {
            fetchQuotes();
        } else {
            alert("문구 삭제에 실패했습니다.");
        }
        setIsDeleteModalOpen(false);
        setQuoteToDelete(null);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen px-4 py-12"
            style={{ background: 'var(--sky-gradient)' }}
        >
            <div className="mx-auto max-w-3xl">
                <h1 className="mb-8 text-center text-3xl font-bold text-foreground bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent-foreground">
                    관리자 대시보드
                </h1>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Statistics Section */}
                    <div className="rounded-2xl bg-card p-6 shadow-md border border-border/50">
                        <h2 className="mb-4 text-xl font-bold text-foreground">전체 사용자 감정 통계</h2>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={statsData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {statsData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={MOOD_COLORS[entry.type]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        {statsData.length === 0 && (
                            <p className="text-center text-sm text-muted-foreground mt-4">데이터가 없습니다.</p>
                        )}
                    </div>

                    {/* CMS Section (Daily Quotes) */}
                    <div className="rounded-2xl bg-card p-6 shadow-md border border-border/50 flex flex-col">
                        <h2 className="mb-4 text-xl font-bold text-foreground">응원 문구 관리 (CMS)</h2>

                        <div className="mb-6 flex gap-2">
                            <Input
                                placeholder="새 응원 문구 입력..."
                                value={newQuote}
                                onChange={(e) => setNewQuote(e.target.value)}
                                className="bg-background/50"
                            />
                            <Button onClick={handleAddQuote} className="shrink-0 gap-1 rounded-xl">
                                <Plus size={16} /> 추가
                            </Button>
                        </div>

                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3 max-h-64">
                            {quotes.length === 0 && (
                                <p className="text-center text-sm text-muted-foreground py-4">등록된 문구가 없습니다.</p>
                            )}
                            {quotes.map((q) => (
                                <div key={q.id} className="group flex items-center justify-between gap-3 rounded-xl bg-secondary/30 p-3 hover:bg-secondary/50 transition-colors border border-border/30">
                                    <p className="text-sm font-medium text-foreground break-keep">{q.quote}</p>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDeleteClick(q.id)}
                                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 size={16} />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmDeleteModal
                open={isDeleteModalOpen}
                onOpenChange={setIsDeleteModalOpen}
                onConfirm={confirmDelete}
            />
        </motion.div>
    );
};

export default AdminDashboard;

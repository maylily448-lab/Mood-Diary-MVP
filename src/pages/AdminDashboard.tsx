import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { MOODS, type MoodType } from '@/store/moodStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Plus, MessageCircleHeart, BarChart3, Quote } from 'lucide-react';
import { ConfirmDeleteModal } from '@/components/ConfirmDeleteModal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

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
    const [cheerMessages, setCheerMessages] = useState<any[]>([]);
    const [newCheerMood, setNewCheerMood] = useState<MoodType>('meh');
    const [newCheerMsg, setNewCheerMsg] = useState('');
    const [newCheerStart, setNewCheerStart] = useState('0');
    const [newCheerEnd, setNewCheerEnd] = useState('100');

    // Delete Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<{ id: string; type: 'quote' | 'cheer' } | null>(null);

    useEffect(() => {
        fetchStats();
        fetchQuotes();
        fetchCheerMessages();
    }, []);

    const fetchStats = async () => {
        const { data, error } = await supabase.from('mood_entries').select('emoji_type');
        if (!error && data) {
            const counts: Record<string, number> = {};

            // Define valid mood types for type guard
            const validMoodTypes = MOODS.map(m => m.type as string);

            data.forEach((entry) => {
                const type = entry.emoji_type;
                if (validMoodTypes.includes(type)) {
                    counts[type] = (counts[type] || 0) + 1;
                }
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

    const fetchCheerMessages = async () => {
        const { data, error } = await supabase
            .from('cheer_messages')
            .select('*')
            .order('mood_type', { ascending: true });
        if (!error && data) setCheerMessages(data);
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

    const handleAddCheerMessage = async () => {
        if (!newCheerMsg.trim()) return;
        const { error } = await supabase.from('cheer_messages').insert([{
            mood_type: newCheerMood,
            message: newCheerMsg,
            energy_range_start: parseInt(newCheerStart),
            energy_range_end: parseInt(newCheerEnd)
        }]);
        if (!error) {
            setNewCheerMsg('');
            fetchCheerMessages();
        } else {
            alert("응원 메시지 추가에 실패했습니다.");
        }
    };

    const handleDeleteClick = (id: string, type: 'quote' | 'cheer') => {
        setItemToDelete({ id, type });
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!itemToDelete) return;

        const table = itemToDelete.type === 'quote' ? 'daily_quotes' : 'cheer_messages';
        const { error } = await supabase.from(table).delete().eq('id', itemToDelete.id);

        if (!error) {
            itemToDelete.type === 'quote' ? fetchQuotes() : fetchCheerMessages();
        } else {
            alert("삭제에 실패했습니다.");
        }
        setIsDeleteModalOpen(false);
        setItemToDelete(null);
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

                <Tabs defaultValue="stats" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-3 rounded-2xl p-1 bg-secondary/20">
                        <TabsTrigger value="stats" className="rounded-xl data-[state=active]:shadow-sm">
                            <BarChart3 size={16} className="mr-2" /> 통계
                        </TabsTrigger>
                        <TabsTrigger value="quotes" className="rounded-xl data-[state=active]:shadow-sm">
                            <Quote size={16} className="mr-2" /> 한 줄 문구
                        </TabsTrigger>
                        <TabsTrigger value="cheer" className="rounded-xl data-[state=active]:shadow-sm">
                            <MessageCircleHeart size={16} className="mr-2" /> 응원 메시지
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="stats">
                        <Card className="rounded-2xl shadow-md border-border/50 overflow-hidden">
                            <CardHeader>
                                <CardTitle>전체 사용자 감정 통계</CardTitle>
                                <CardDescription>사용자들이 남긴 모든 감정 데이터 비중입니다.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-80 w-full mx-auto max-w-md">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={statsData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={70}
                                                outerRadius={100}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {statsData.map((entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={MOOD_COLORS[entry.type] || '#CBD5E1'}
                                                    />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}
                                            />
                                            <Legend verticalAlign="bottom" height={36} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                {statsData.length === 0 && (
                                    <p className="text-center text-sm text-muted-foreground py-10">데이터가 없습니다.</p>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="quotes">
                        <Card className="rounded-2xl shadow-md border-border/50">
                            <CardHeader>
                                <CardTitle>응원 문구 관리 (CMS)</CardTitle>
                                <CardDescription>홈 화면 상단에 랜덤하게 노출되는 문구들입니다.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="mb-6 flex gap-2">
                                    <Input
                                        placeholder="새 응원 문구 입력..."
                                        value={newQuote}
                                        onChange={(e) => setNewQuote(e.target.value)}
                                        className="bg-background/50 rounded-xl h-12"
                                    />
                                    <Button onClick={handleAddQuote} className="shrink-0 h-12 px-6 gap-2 rounded-xl">
                                        <Plus size={18} /> 추가
                                    </Button>
                                </div>

                                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                    {quotes.length === 0 && (
                                        <p className="text-center text-sm text-muted-foreground py-10">등록된 문구가 없습니다.</p>
                                    )}
                                    {quotes.map((q) => (
                                        <div key={q.id} className="group flex items-center justify-between gap-4 rounded-2xl bg-secondary/20 p-4 hover:bg-secondary/40 transition-all border border-transparent hover:border-border/50">
                                            <p className="text-sm font-medium text-foreground leading-relaxed break-keep">{q.quote}</p>
                                            <button
                                                onClick={() => handleDeleteClick(q.id, 'quote')}
                                                className="h-10 w-10 flex items-center justify-center rounded-xl bg-background shadow-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="cheer">
                        <Card className="rounded-2xl shadow-md border-border/50">
                            <CardHeader>
                                <CardTitle>맞춤형 응원 메시지 관리</CardTitle>
                                <CardDescription>기록 후 사용자의 감정과 에너지에 맞춰 곰돌이가 보내는 메시지입니다.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="mb-8 p-6 rounded-2xl bg-secondary/10 border border-border/50">
                                    <div className="grid gap-6 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-muted-foreground ml-1">대상 감정</label>
                                            <select
                                                value={newCheerMood}
                                                onChange={(e) => setNewCheerMood(e.target.value as MoodType)}
                                                className="w-full rounded-xl border border-input bg-background h-12 px-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
                                            >
                                                {MOODS.map(m => <option key={m.type} value={m.type}>{m.label}</option>)}
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-muted-foreground ml-1">에너지 범위(%)</label>
                                            <div className="flex items-center gap-3">
                                                <Input type="number" value={newCheerStart} onChange={(e) => setNewCheerStart(e.target.value)} className="h-12 rounded-xl text-center" />
                                                <span className="text-muted-foreground">~</span>
                                                <Input type="number" value={newCheerEnd} onChange={(e) => setNewCheerEnd(e.target.value)} className="h-12 rounded-xl text-center" />
                                            </div>
                                        </div>
                                        <div className="md:col-span-2 space-y-2">
                                            <label className="text-xs font-bold text-muted-foreground ml-1">메시지 내용</label>
                                            <div className="flex gap-2">
                                                <Input
                                                    placeholder="곰돌이가 전할 말을 입력해주세요..."
                                                    value={newCheerMsg}
                                                    onChange={(e) => setNewCheerMsg(e.target.value)}
                                                    className="h-12 rounded-xl"
                                                />
                                                <Button onClick={handleAddCheerMessage} className="shrink-0 h-12 px-6 gap-2 rounded-xl font-bold">
                                                    <Plus size={18} /> 추가
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                    {cheerMessages.map((msg) => (
                                        <div key={msg.id} className="group flex flex-col gap-3 rounded-2xl bg-secondary/20 p-5 border border-transparent hover:border-border/50 transition-all relative">
                                            <div className="flex justify-between items-start">
                                                <div className="flex gap-2">
                                                    <span className="text-[10px] font-bold px-3 py-1 bg-primary text-primary-foreground rounded-full">
                                                        {MOODS.find(m => m.type === msg.mood_type)?.label}
                                                    </span>
                                                    <span className="text-[10px] font-bold px-3 py-1 bg-accent/20 text-accent-foreground rounded-full">
                                                        에너지 {msg.energy_range_start}-{msg.energy_range_end}%
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={() => handleDeleteClick(msg.id, 'cheer')}
                                                    className="h-8 w-8 flex items-center justify-center rounded-lg bg-background shadow-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all opacity-0 group-hover:opacity-100"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                            <p className="text-sm font-medium text-foreground leading-relaxed break-keep">{msg.message}</p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
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

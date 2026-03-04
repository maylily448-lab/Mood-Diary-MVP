import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import bearGreat from '@/assets/bear-great.png';
import bearGood from '@/assets/bear-good.png';
import bearMeh from '@/assets/bear-meh.png';
import bearSad from '@/assets/bear-sad.png';
import bearAngry from '@/assets/bear-angry.png';
import bearHappy from '@/assets/bear-happy.png';
import type { User } from '@supabase/supabase-js';

export type MoodType = 'great' | 'good' | 'meh' | 'sad' | 'angry';

export interface MoodEntry {
  id: string;
  mood: MoodType;
  memo: string;
  date: string;
  activities: string[];
  energy_level?: number;
}

export interface UserProfile {
  id: string;
  email: string;
  nickname: string;
  age: number | null;
  gender: string | null;
  mood_level: number | null;
}

export const MOODS: { type: MoodType; image: string; label: string }[] = [
  { type: 'great', image: bearGreat, label: '최고' },
  { type: 'good', image: bearGood, label: '좋아' },
  { type: 'meh', image: bearMeh, label: '보통' },
  { type: 'sad', image: bearSad, label: '슬퍼' },
  { type: 'angry', image: bearAngry, label: '화나' },
];

export const BEAR_HAPPY = bearHappy;

export const CHEER_MESSAGES = [
  '오늘도 수고했어요! ☀️',
  '당신은 충분히 잘하고 있어요 💛',
  '감정을 기록하는 것만으로도 대단해요 🌸',
  '내일은 더 좋은 하루가 될 거예요 🌈',
  '지금 이 순간, 당신은 소중해요 💙',
  '한 걸음씩 나아가고 있어요 🌿',
];

export const ACTIVITY_TAGS: { id: string; emoji: string; label: string }[] = [
  { id: 'sleep', emoji: '💤', label: '수면' },
  { id: 'exercise', emoji: '🏃', label: '운동' },
  { id: 'cafe', emoji: '☕', label: '카페' },
  { id: 'work', emoji: '💻', label: '업무' },
  { id: 'food', emoji: '🍱', label: '맛집' },
  { id: 'reading', emoji: '📚', label: '독서' },
  { id: 'music', emoji: '🎵', label: '음악' },
  { id: 'shopping', emoji: '🛒', label: '쇼핑' },
];

export const MOOD_CHEER_BY_TYPE: Record<MoodType, string> = {
  great: '역시 오늘도 최고! 이 기분 오래오래 간직해요 🌟',
  good: '좋은 하루였네요! 내일도 이런 날이길 😊',
  meh: '평범한 하루도 소중해요. 푹 쉬어가세요 🌿',
  sad: '괜찮아, 내일은 더 나을 거야. 곁에 있을게 🤗',
  angry: '화가 날 수 있어요. 깊게 숨 쉬고 나를 토닥여줘요 💆',
};

export interface RecoveryGuide {
  id: string;
  emoji: string;
  title: string;
  description: string;
  durationSec: number;
}

export const RECOVERY_GUIDES: RecoveryGuide[] = [
  {
    id: 'eye-close',
    emoji: '😌',
    title: '60초 눈 감기',
    description: '잠시 화면에서 눈을 떼고 어둠 속에서 휴식해보세요.',
    durationSec: 60,
  },
  {
    id: 'neck-stretch',
    emoji: '🧘',
    title: '목 스트레칭',
    description: '목을 천천히 왼쪽으로, 그리고 오른쪽으로 5초씩 늘려주세요.',
    durationSec: 30,
  },
  {
    id: 'water-drink',
    emoji: '💧',
    title: '물 한 잔 마시기',
    description: '시원한 물 한 잔으로 몸에 생기를 불어넣어 주세요.',
    durationSec: 20,
  },
  {
    id: 'deep-breath',
    emoji: '🌬️',
    title: '심호흡 4-7-8',
    description: '4초 들이마시고, 7초 멈추고, 8초 내뱉어보세요.',
    durationSec: 40,
  },
  {
    id: 'window-view',
    emoji: '🪟',
    title: '창문 밖 보기',
    description: '먼 곳을 응시하며 눈의 피로를 풀어주세요.',
    durationSec: 60,
  },
  {
    id: 'palm-rub',
    emoji: '👐',
    title: '손바닥 비비기',
    description: '손바닥을 따뜻하게 비벼 눈 위에 살포시 올려보세요.',
    durationSec: 30,
  },
];

interface MoodStore {
  entries: MoodEntry[];
  isLoading: boolean;
  user: User | null;
  profile: UserProfile | null;
  setUser: (user: User | null) => void;
  fetchProfile: (userId: string) => Promise<void>;
  fetchEntries: () => Promise<void>;
  fetchCheerMessage: (mood: MoodType, energy: number) => Promise<string>;
  addEntry: (mood: MoodType, memo: string, activities?: string[], energyLevel?: number) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
}

export const useMoodStore = create<MoodStore>((set, get) => ({
  entries: [],
  isLoading: false,
  user: null,
  profile: null,

  setUser: (user) => {
    set({ user });
    if (user) {
      get().fetchProfile(user.id);
      get().fetchEntries(); // Fetch tailored to user
    } else {
      set({ profile: null, entries: [] });
    }
  },

  fetchProfile: async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (!error && data) {
      set({ profile: data as UserProfile });
    }
  },

  fetchEntries: async () => {
    set({ isLoading: true });

    // Auth Check
    const { user } = get();
    let query = supabase.from('mood_entries').select('*').order('created_at', { ascending: false });

    if (user) {
      query = query.eq('user_id', user.id);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching entries:', error);
      set({ isLoading: false });
      return;
    }

    if (data) {
      const formattedData: MoodEntry[] = data.map((d) => ({
        id: d.id,
        mood: d.emoji_type as MoodType,
        memo: d.memo || '',
        date: d.created_at,
        activities: [],
        energy_level: d.energy_level ?? undefined,
      }));
      set({ entries: formattedData, isLoading: false });
    }
  },

  fetchCheerMessage: async (mood: MoodType, energy: number): Promise<string> => {
    // Try to fetch from Supabase first
    const { data, error } = await supabase
      .from('cheer_messages')
      .select('message')
      .eq('mood_type', mood)
      .lte('energy_range_start', energy)
      .gte('energy_range_end', energy);

    if (!error && data && data.length > 0) {
      // Return a random message from the results
      const randomIndex = Math.floor(Math.random() * data.length);
      return data[randomIndex].message;
    }

    // Fallback if no specific message found or error
    return MOOD_CHEER_BY_TYPE[mood];
  },

  addEntry: async (mood, memo, activities = [], energyLevel?: number) => {
    set({ isLoading: true });

    // Auth Check
    const { user } = get();
    const insertData: any = {
      emoji_type: mood,
      memo: memo || null,
      energy_level: energyLevel ?? null
    };
    if (user) {
      insertData.user_id = user.id;
    }

    const { data, error } = await supabase
      .from('mood_entries')
      .insert([insertData])
      .select()
      .single();

    if (error) {
      console.error('Error saving entry:', error);
      set({ isLoading: false });
      return;
    }

    if (data) {
      const newEntry: MoodEntry = {
        id: data.id,
        mood: data.emoji_type as MoodType,
        memo: data.memo || '',
        date: data.created_at,
        activities,
      };
      set((state) => ({
        entries: [newEntry, ...state.entries],
        isLoading: false,
      }));
    }
  },

  deleteEntry: async (id: string) => {
    set({ isLoading: true });
    const { error } = await supabase
      .from('mood_entries')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting entry:', error);
      set({ isLoading: false });
      return;
    }

    set((state) => ({
      entries: state.entries.filter((entry) => entry.id !== id),
      isLoading: false,
    }));
  }
}));

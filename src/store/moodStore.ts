import { create } from 'zustand';
import bearGreat from '@/assets/bear-great.png';
import bearGood from '@/assets/bear-good.png';
import bearMeh from '@/assets/bear-meh.png';
import bearSad from '@/assets/bear-sad.png';
import bearAngry from '@/assets/bear-angry.png';
import bearHappy from '@/assets/bear-happy.png';

export type MoodType = 'great' | 'good' | 'meh' | 'sad' | 'angry';

export interface MoodEntry {
  id: string;
  mood: MoodType;
  memo: string;
  date: string;
  activities: string[];
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

export const DAILY_QUOTES = [
  '오늘 하루도 당신답게 빛나길 ✨',
  '작은 행복을 놓치지 마세요 🌼',
  '당신의 감정은 모두 소중해요 💕',
  '쉬어가도 괜찮아요, 충분히 잘하고 있어요 🍃',
  '오늘의 나에게 따뜻한 한마디를 건네보세요 🤗',
  '매일 조금씩 성장하고 있는 당신, 멋져요 🌱',
  '감정을 기록하는 건 나를 아끼는 첫걸음이에요 📝',
  '당신이 웃는 날이 더 많아지길 바라요 🌸',
  '지금 이 순간에 집중해보세요, 충분해요 🧘',
  '오늘도 무사히 하루를 보낸 당신, 대단해요 🌟',
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

interface MoodStore {
  entries: MoodEntry[];
  addEntry: (mood: MoodType, memo: string, activities?: string[]) => void;
}

const generateMockData = (): MoodEntry[] => {
  const moodTypes: MoodType[] = ['great', 'good', 'meh', 'sad', 'good', 'great', 'meh'];
  const memos = [
    '오늘 날씨가 좋았다',
    '친구와 맛있는 거 먹었다',
    '그냥 평범한 하루',
    '비가 와서 우울했다',
    '새 카페 발견!',
    '운동하고 기분 좋아짐',
    '집에서 푹 쉬었다',
  ];

  return moodTypes.map((mood, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return { id: `mock-${i}`, mood, memo: memos[i], date: date.toISOString(), activities: [] };
  });
};

export const useMoodStore = create<MoodStore>((set) => ({
  entries: generateMockData(),
  addEntry: (mood, memo, activities = []) =>
    set((state) => ({
      entries: [
        ...state.entries,
        { id: Date.now().toString(), mood, memo, date: new Date().toISOString(), activities },
      ],
    })),
}));

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

interface MoodStore {
  entries: MoodEntry[];
  addEntry: (mood: MoodType, memo: string) => void;
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
    return { id: `mock-${i}`, mood, memo: memos[i], date: date.toISOString() };
  });
};

export const useMoodStore = create<MoodStore>((set) => ({
  entries: generateMockData(),
  addEntry: (mood, memo) =>
    set((state) => ({
      entries: [
        ...state.entries,
        { id: Date.now().toString(), mood, memo, date: new Date().toISOString() },
      ],
    })),
}));



# Mood Diary 홈 페이지 대시보드 강화 계획

기존 홈 페이지의 빈 공간을 채우고, 사용자 경험을 풍부하게 만드는 4가지 위젯을 추가합니다.

---

## 변경 파일 및 내용

### 1. `src/store/moodStore.ts` — 데이터 확장

- **DAILY_QUOTES** 상수 추가: 따뜻한 격려 문구 배열 (8~10개)
- **ACTIVITY_TAGS** 상수 추가: `{ id, emoji, label }` 형태 (💤 수면, 🏃 운동, ☕ 카페, 💻 업무, 🍱 맛집, 📚 독서, 🎵 음악, 🛒 쇼핑)
- **MOOD_CHEER_BY_TYPE** 상수 추가: 무드별 개인화된 응원 메시지 맵 (예: `great` → "역시 오늘도 최고! 🌟", `sad` → "괜찮아, 내일은 더 나을 거야 🤗")
- `MoodEntry` 인터페이스에 `activities: string[]` 필드 추가 (선택 사항)
- `addEntry` 시그니처에 `activities` 파라미터 추가

### 2. `src/pages/Index.tsx` — 메인 페이지 위젯 추가

**A. Daily Quote Card** (제목 아래)
- 반투명 white 카드 (`bg-white/60 backdrop-blur-sm rounded-2xl`)
- `useMemo`로 매일 랜덤 문구 하나 선택
- 이탤릭/따옴표 스타일, 작은 🌸 장식

**B. Activity Tags** (감정 선택 후 메모 입력 위)
- 수평 스크롤 가능한 Badge 리스트
- 탭하면 색상 변경 (선택: `bg-primary text-white`, 미선택: `bg-secondary/50`)
- `selectedActivities` state 관리

**C. Weekly Mood Summary Widget** (감정 선택 영역 아래, 항상 표시)
- "나의 이번 주 날씨" 타이틀
- 이번 주 entries에서 가장 빈번한 mood 계산
- 대표 곰돌이 이미지 (작은 사이즈) + "이번 주는 대체로 '좋아'였어요! 🌤️" 텍스트
- `rounded-2xl bg-card shadow-md` 스타일

**D. Interaction Area** (저장 후 표시)
- 저장 완료 시 `savedMood` state에 마지막 저장 무드 보관
- 선택된 곰돌이의 큰 버전 (h-32 w-32) + 부드러운 floating 애니메이션 (`animate={{ y: [0, -8, 0] }}` 무한 반복)
- 말풍선 UI (`relative` 박스 + CSS 삼각형 꼬리)에 무드별 개인화 응원 메시지 표시
- 다음 기록 시 사라짐

### 3. 시각적 통일감

- 모든 새 위젯: `rounded-2xl`, 파스텔 톤 유지
- 곰돌이 floating 애니메이션: `transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}`
- Activity Tags 스크롤: `overflow-x-auto scrollbar-hide flex gap-2`

---

## 레이아웃 순서 (위→아래)

```text
┌─────────────────────────┐
│   "오늘 기분이 어때요?"    │
│   Daily Quote Card       │
├─────────────────────────┤
│   🐻 감정 선택 버튼 5개    │
├─────────────────────────┤
│   Weekly Mood Summary    │
├─────────────────────────┤
│ (감정 선택 시)             │
│   Activity Tags (스크롤)  │
│   메모 입력 + 저장 버튼    │
├─────────────────────────┤
│ (저장 후)                 │
│   🐻 큰 곰돌이 + 말풍선   │
│   (floating animation)   │
└─────────────────────────┘
```

---

## 기술 세부사항

- 새 의존성 없음 (Framer Motion, Zustand 기존 사용)
- Badge 컴포넌트는 기존 `src/components/ui/badge.tsx` 활용
- `scrollbar-hide` 유틸리티 클래스를 `index.css`에 추가
- 성공 다이얼로그는 기존 유지, Interaction Area는 별도 섹션으로 다이얼로그 닫은 후에도 표시


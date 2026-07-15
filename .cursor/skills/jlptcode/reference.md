# jlptcode Reference

## API Routes

**위치**: `src/app/api/{domain}/{action}/route.ts`

**공통 흐름**:
1. `await connectDB()` (`src/app/utils/database.ts`)
2. Mongoose model import
3. `GET` → `request.nextUrl.searchParams` / `POST` → `await request.json()`
4. `NextResponse.json(data)`

**POST body 형식** (관례):
```json
{ "params": { "level": "N1", "study": "..." } }
```

**list vs listAll**:
- `list/route.ts` — `$sample` 랜덤 (무료)
- `listAll/route.ts` — `find().sort()` 전체 (유료)

**예시**:
- Class metadata: `src/app/api/grammarToday/class/route.ts`
- Random quiz: `src/app/api/grammarToday/list/route.ts`

## SWR

**Provider**: `src/app/providers/SWRProvider.tsx`

**Fetcher key 형식**:
```typescript
{ url: '/api/grammarToday/class', params: { level: 'N1' }, method?: 'POST' }
```

**Hook 패턴** (`src/app/swr/useGrammarToday.ts`):
- `useSWR` / `useSWRImmutable` 반환: `{ data, error, isLoading, isValidating, mutate }`
- 목록 데이터는 `useSWRImmutable` 사용 (자동 revalidate 방지)

## Zustand

**패턴** (`src/app/store/grammarTodayStore.ts`):
```typescript
create<T>()(devtools(persist((set, get) => ({ ... }), { name: 'grammarTodayStore' })))
```

**역할**:
- 필터 state: `level`, `study`
- 목록 state + `get*List()` (직접 `fetch` 호출)
- UI: `setHideAllInfo`, `init`

## Mongoose Models

**패턴** (`src/app/models/grammarTodayModel.ts`):
```typescript
const schema = new Schema({ ... }, { timestamps: true, collection: 'grammar_today' });
const Model = models?.grammarToday || model('grammarToday', schema, 'grammar_today');
```

- collection명: snake_case
- hot-reload: `models?.name || model(...)` 패턴
- aggregation: `$match`, `$group`, `$sample`, `$sortArray`

**모델 목록**: `userModel`, `userPaymentModel`, `wordTodayModel`, `grammarTodayModel`, `readingTodayModel`, `levelUpModel`, `levelUpNewModel`, `jlptModel`, `jlptNewModel`, `jlptTestModel`, `jptModel`, `jptWordModel`, `wordModel`, `boardCommunityModel`, `boardReplyModel`, `codeModel`, `codeDetailModel`

## Auth & Payments

**설정**: `src/app/api/auth/[...nextauth]/options.ts`
- Providers: Kakao, Naver, Google OAuth + Credentials (bcrypt)
- JWT callback: `role` 포함
- Session callback: `UserPayment` aggregate → `paymentInfo`

**타입 확장**: `src/app/types/next-auth.d.ts`

**미들웨어**: `src/middleware.ts` — auth modify/delete, board write, member routes 보호

**유료 UI**: `src/app/components/Buttons/PaidButton.tsx`
```typescript
session?.paymentInfo?.isValid
```

**회원 API**: `src/app/api/user/route.ts` (Zod + bcrypt)

## i18n

**로케일**: `ko`, `ja`, `en`, `zh`, `my` — `src/i18n/config.ts`

**메시지**: `src/i18n/messages/{locale}.json`

**Provider**: `src/app/providers/I18nProvider.tsx`
- Cookie + localStorage: `jlptcode-locale`
- Hook: `useTranslations()` → `{ t, locale, setLocale }`
- 사용: `t('nav.speakToday')` (dot notation)

**새 문자열 추가 시**:
1. 5개 JSON 파일 모두 동일 키 추가
2. 컴포넌트에서 `t('section.key')` 사용
3. 네비/푸터: `NAV_LINKS` / `FOOTER_LINKS` 상수 + `key` 필드

**LanguageSwitcher**: `src/app/components/Navbars/LanguageSwitcher.tsx` (select + SVG 국기)

## Feature Modules

### *Today 계열 (동일 슬라이스)

| Feature | Route | Store | SWR | Layout |
|---------|-------|-------|-----|--------|
| grammarToday | `/grammarToday` | grammarTodayStore | useGrammarToday | GrammarTodayLayout |
| speakToday | `/speakToday` | speakTodayStore | useSpeakToday | SpeakTodayLayout |
| wordToday | `/wordToday` | wordTodayStore | useWordToday | WordTodayLayout |
| sentenceToday | `/sentenceToday` | sentenceTodayStore | useSentenceToday | SentenceTodayLayout |
| readingToday | `/readingToday` | readingTodayStore | useReadingToday | ReadingTodayLayout |

**페이지 구조**:
```tsx
"use client";
// useSession + useXxxStore + FeatureLayout + LevelList + *List
```

### 기타 기능군

- 시험: `jlpt/`, `jlptTest/`, `levelUp/`, `levelUpNew/`, `jptLevelUp/`, `strategy/`
- 단어: `word/`, `word/jpt/`, `word/jlpt/`
- 커뮤니티: `board/community/`
- 스피킹: `speakMaster/`, `speakTest/`

## Shared UI

| 폴더 | 용도 |
|------|------|
| `components/Layout/` | Feature별 Sidebar + Header 레이아웃 |
| `components/Cards/` | 카드 UI |
| `components/Navbars/` | MainNavbar, LanguageSwitcher |
| `components/Headers/` | HeaderTitle |
| `components/Modals/` | ModalConfirm 등 |
| `components/Buttons/` | PaidButton 등 |

## Env (추정)

`DATABASE_URL`, OAuth client secrets, `BCRYPT_SALT_ROUNDS`, OpenAI keys, `DEBUG_MODE`

## Build

- `output: 'standalone'` in `next.config.js`
- ESLint ignored during builds
- `/jlpt/*` → `/` redirect

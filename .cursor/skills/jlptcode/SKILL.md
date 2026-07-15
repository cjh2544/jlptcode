---
name: jlptcode
description: Guides development in the jlptcode Next.js Japanese learning app (MongoDB, SWR, Zustand, next-auth, i18n). Use when working in this repo on features, API routes, *Today modules, auth, payments, or translations.
---

# jlptcode 프로젝트 스킬

일본어 학습 앱(jlptcode) 작업 시 이 스킬을 따른다. `.cursorrules`와 함께 적용한다.

## 스킬 목록

| 스킬 | 용도 | 위치 |
|------|------|------|
| **jlptcode** (이 파일) | 프로젝트 전반 규칙, 작업 분기 | `.cursor/skills/jlptcode/` |
| **reference.md** | API / SWR / Store / i18n / Auth 상세 패턴 | [reference.md](reference.md) |
| **review-bugbot** | 로컬 변경 코드 리뷰 | Cursor 내장 (`/review-bugbot`) |
| **review-security** | 보안 리뷰 | Cursor 내장 (`/review-security`) |
| **create-rule** | `.cursorrules` 또는 규칙 추가 | Cursor 내장 |
| **babysit** | PR 머지 준비, CI 수정 | Cursor 내장 |

## 작업 분기

```
새 *Today 학습 모듈?     → reference.md "Feature Module" + grammarToday 복제
API 추가/수정?           → reference.md "API Routes"
UI 문구 다국어?          → reference.md "i18n"
로그인/유료 기능?        → reference.md "Auth & Payments"
공통 컴포넌트/레이아웃?   → src/app/components/ 기존 패턴 따르기
```

## 핵심 규칙

1. **스택**: Next.js 14 App Router, React 18, TypeScript, Tailwind, Material Tailwind
2. **경로 별칭**: `@/*` → `src/*`
3. **클라이언트 페이지**: `"use client"` 필수
4. **기능 단위 구조** (변경 시 동일 패턴 유지):

```
src/app/{feature}/
  page.tsx
  components/
src/app/api/{feature}/
  class/route.ts    # GET — 메타데이터
  study/route.ts      # GET — 학습 단위
  list/route.ts       # POST — 랜덤 샘플(무료)
  listAll/route.ts    # POST — 전체 목록(유료)
src/app/store/{feature}Store.ts
src/app/swr/use{Feature}.ts
src/app/components/Layout/{Feature}Layout.tsx
src/app/models/{feature}Model.ts   # 필요 시
```

5. **상태 분리**: SWR = 메타/탭 데이터, Zustand = 필터·목록·UI 토글
6. **유료 게이트**: `session?.paymentInfo?.isValid` + `PaidButton` 컴포넌트
7. **i18n**: 하드코딩 문자열 대신 `useTranslations()` + `src/i18n/messages/*.json`
8. **최소 변경**: 기존 파일·네이밍·패턴 재사용, 불필요한 추상화 금지

## Provider 순서 (layout.tsx)

`SessionProvider` → `I18nProvider` → `SWRProvider` → children

## 참고 구현 (골든 패턴)

| 영역 | 참고 파일 |
|------|-----------|
| *Today 페이지 | `src/app/grammarToday/page.tsx` |
| API 랜덤 목록 | `src/app/api/grammarToday/list/route.ts` |
| Zustand store | `src/app/store/grammarTodayStore.ts` |
| SWR hook | `src/app/swr/useGrammarToday.ts` |
| Layout | `src/app/components/Layout/GrammarTodayLayout.tsx` |
| i18n | `src/app/providers/I18nProvider.tsx`, `src/i18n/config.ts` |
| Auth | `src/app/api/auth/[...nextauth]/options.ts` |
| DB 연결 | `src/app/utils/database.ts` |

## 새 *Today 모듈 체크리스트

```
- [ ] grammarToday 기준으로 page / components / layout 복제·이름 변경
- [ ] api/{feature}/class, study, list, listAll route 추가
- [ ] models/{feature}Model.ts (collection명 snake_case)
- [ ] store + swr hook 추가
- [ ] 유료/무료 분기 확인 (list vs listAll)
- [ ] i18n 키 추가 (5개 locale JSON 모두)
- [ ] MainNavbar / Footer NAV_LINKS 키 추가 (필요 시)
```

## 추가 리소스

상세 패턴은 [reference.md](reference.md) 참고.

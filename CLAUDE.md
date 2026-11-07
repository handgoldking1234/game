# 민왕게임월드 (game) — 작업 안내서

## 한 줄 요약
설치·로그인 없이 브라우저에서 하는 웹게임 모음 원페이지. 초5 2학기 「자원과 에너지」, 「날씨와 우리 생활」 단원 연계 게임.

- 주소: https://game.iux.kr (Vercel, main 푸시 시 자동 배포)

## 확정된 결정
| 항목 | 결정 |
|---|---|
| 구조 | 원페이지 `index.html` + 게임마다 단일 HTML(`games/*.html`) |
| 온라인 대전 | 카트·브롤·블록 마을·라이벌즈 4종. 방 목록은 Supabase(iux-cloud) Realtime Presence(`mwg-lobby-<게임>`), 게임 통신은 PeerJS(막히면 MQTT 중계) |
| 규모 | 동시 접속 최대 25명, 한 판 최대 40분 기준 |
| 비용 | 최소. Supabase 무료 + keepalive 워크플로(3일마다 깨움) |
| 통계 | `mwt.js` → `/api/t`(Vercel 함수) → `mw_events`. 원래 IP는 저장 안 함 |

## 파일
```
index.html                원페이지 (GAMES 목록, 썸네일 내장)
games/*.html              게임 18종 (+ backrooms-pc 고화질판)
thumbs/, hero/            썸네일·배경 원본
mwt.js                    방문·플레이 통계, 좋아요
api/t.js                  통계 수집 서버 함수
admin.html                관리자(통계)
supabase/*.sql            통계·기기·관리 함수 SQL
.github/workflows/supabase-keepalive.yml
```

## 게임 목록 (index.html `GAMES`의 id → 파일)
pangpang 웨더팡팡 · garden 날씨 정원 · kart 날씨 카트 레이스 · wrivals 날씨 라이벌즈 · wisland 날씨 생존 섬 · dad 엄격한 에너지 아빠 · hospital 한밤의 동물병원 · brawl 에너지 브롤 · blocks 에너지 블록 마을 · park 한밤의 에너지 공원 · keycap 키캡 타워 · forest 에너지 숲의 밤 · backrooms 백룸 방탈출 · rivals 에너지 라이벌즈 · spy 탄소 스파이를 찾아라 · hero 에너지 히어로 · front 에너지 전선 · jump 에너지 점프 · town 에너지 마을 시장 · wing 탄소 제로 비행단 · world 에너지 월드

## 자주 하는 수정
- **게임 추가:** `games/`에 파일 → `thumbs/`에 썸네일 → `index.html`의 `GAMES`에 한 줄 → `sitemap.xml`
- 3D 게임은 three.js·PeerJS를 CDN에서 불러오므로 인터넷 필요

## 브랜치
- `wip/blocks-expansion` — 에너지 블록 마을 확장(작업 중, 검증 전)
- `wip/rivals-devlobby` — 에너지 라이벌즈 개발자 모드·3D 로비·스킨(작업 중, 검증 전)
- `claude/iux-kr-domains` — 도메인 변경, main에 반영된 것으로 보임

---

## 공통 작업 원칙 (IUX 프로젝트 전체)
- **언어:** 화면 문구·문서·커밋 메시지는 한국어. 쉬운 말, 기술 용어 최소화.
- **퍼블리싱 시안:** 순수 HTML/CSS + 간단한 스크립트만 넣는다. 서버·DB 연동 코드는 개발 단계에서 따로 붙인다.
- **아이콘:** Lucide. 디자인 시스템을 따로 정하지 않았으면 스포티파이 스타일(다크/화이트 + 포인트 컬러)을 기본으로 쓴다.
- **배포:** GitHub `main` → Vercel 자동 배포. 도메인은 가비아 `iux.kr`의 서브도메인(`*.iux.kr` CNAME → Vercel)을 쓴다.
- **DB:** Supabase 무료 플랜은 활성 프로젝트 2개까지라, 새 프로젝트를 만들지 말고 기존 `iux-cloud`(studio) 프로젝트에 테이블을 얹는 것을 먼저 검토한다.
- **비밀값:** 공개 저장소다. 서비스 키·AI 키·비밀번호는 절대 커밋하지 않는다. 키는 Vercel 환경 변수나 Supabase secrets에 둔다. Supabase anon(public) 키만 코드에 넣을 수 있다.
- **확인:** 고친 뒤에는 브라우저 콘솔 오류 0개, 모바일(390px)과 PC 화면을 눈으로 확인하고 나서 완료라고 한다.
- **브랜치:** `main`은 배포 중인 상태. 큰 작업이나 검증 전 작업은 브랜치(`wip/…`, `claude/…`)에 올리고, `main`을 강제 푸시(-f)로 덮어쓰지 않는다.
- **전체 프로젝트 목록:** https://github.com/handgoldking1234/iux-app/blob/main/docs/PROJECTS.md

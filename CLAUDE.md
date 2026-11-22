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
games/*.html              게임 28종 (+ backrooms-pc 고화질판)
star/index.html           잿빛 전선(실시간 전략) → https://game.iux.kr/star · 원페이지 목록에는 없음
                          웹판은 <html data-noasset="1">: 원작 그림·소리 폴더를 찾지 않고 자체 그래픽으로 실행
thumbs/, hero/            썸네일·배경 원본
mwt.js                    방문·플레이 통계, 좋아요
api/t.js                  통계 수집 서버 함수
admin.html                관리자(통계)
supabase/*.sql            통계·기기·관리 함수 SQL
.github/workflows/supabase-keepalive.yml
```

## 게임 목록 (index.html `GAMES`의 id → 파일)
fest 무궁화 운동회(최대 24명) · egg 에그 대작전 · cham 카멜레온 숨바꼭질 · op38 새벽 작전 38 · halmae 할매 특공대 · halmae2 할매 특공대 2 · halmae3 할매 특공대 3 · halmae4 할매 특공대 4 · halmae5 할매 특공대 5 · pangpang 웨더팡팡 · garden 날씨 정원 · kart 날씨 카트 레이스 · wrivals 날씨 라이벌즈 · wisland 날씨 생존 섬 · dad 엄격한 에너지 아빠 · hospital 한밤의 동물병원 · brawl 에너지 브롤 · blocks 에너지 블록 마을 · park 한밤의 에너지 공원 · keycap 키캡 타워 · forest 에너지 숲의 밤 · backrooms 백룸 방탈출 · rivals 에너지 라이벌즈 · spy 탄소 스파이를 찾아라 · hero 에너지 히어로 · front 에너지 전선 · jump 에너지 점프 · town 에너지 마을 시장 · wing 탄소 제로 비행단 · world 에너지 월드

## 거인 토벌전(titan.html) — 2026-11-19 민왕게임에서 제외(파일·썸네일 삭제, 원본은 git 기록 4f72d7c에 있음)
- 3D 모델·three.js를 파일 안에 넣은 단일 HTML(약 8MB). 인체 메쉬는 MakeHuman 기본 메쉬(CC0), 뼈대·걷기 동작은 three.js 예제 Xbot.
- 배경 음악: `games/titan-music/`에 `feuer.mp3`·`march.mp3`·`void.mp3`·`final.mp3`(챕터 1~4 순서)를 넣으면 그 곡이 나온다. 파일이 없으면 게임이 자체 연주 음악을 튼다. 2026-11-19 브랜치 `claude/titan-quiz`에 4곡 넣음(직접 만든 Suno 곡, 합쳐서 약 18MB).
- 2026-11-19 브랜치 `claude/titan-quiz`: 주인공 리온 머리 금발, 보급(R)에서 초5 과학 문제(36개)를 맞히면 보급+아이템(폭뢰창 +3·체력 회복·칼날 세트 +2, 3연속 정답 보너스), 틀리면 가스만 조금·10초 뒤 재도전. 거리에 중세 집 모델(“Medieval House 4” by Olosta, CC BY 4.0, 시작 화면에 출처 표기). 모바일에서 챕터 안내 문구 줄바꿈. 마우스는 우클릭=와이어, 좌클릭=베기. 거인은 건물 밖으로 밀려나며 돌아간다. 집 텍스처는 data 주소로 내장(미리보기 창에서도 보임). 2026-11-22 애니메이션 추가: 챕터 시작 장면(카메라가 돌며 내려옴, 클릭하면 건너뛰기), 주인공 동작(공중 자세·와이어 쏠 때 팔·베기·착지 웅크림·망토 날림, 동료 병사도 공중 자세), 거인 동작(처음 마주치면 포효, 걸을 때 몸 흔들림, 베이면 뒤로 젖혀졌다 쓰러짐), 토벌 연출(칼로 잡으면 느린 화면+옆에서 보는 카메라+흰 칼자국). 아직 원페이지 목록에는 다시 넣지 않음.
- 원본(game.js·모델 변환 스크립트)은 저장소에 없다. 고칠 때는 Claude 대화에서 다시 빌드해 파일을 통째로 바꾼다.

## 자주 하는 수정
- **게임 추가:** `games/`에 파일 → `thumbs/`에 썸네일 → `index.html`의 `GAMES`에 한 줄 → `sitemap.xml`
- 과학 게임(fest·egg·cham·op38)은 별도 작업 폴더의 공용 틀(kit)로 만든 단일 HTML. 같이 하기는 4자리 방 번호(PeerJS, 방장이 위치를 묶어 전달)
- 3D 게임은 three.js·PeerJS를 CDN에서 불러오므로 인터넷 필요

## 브랜치
- `wip/blocks-expansion` — 에너지 블록 마을 확장(작업 중, 검증 전)
- `wip/rivals-devlobby` — 에너지 라이벌즈 개발자 모드·3D 로비·스킨(작업 중, 검증 전)
- `claude/iux-kr-domains` — 도메인 변경, main에 반영된 것으로 보임
- `claude/science-six-src` — 과학 게임 6종 원본(`science-six/`: kit, g1~g6, 빌드·시험 도구, 완성 파일). main에 합치지 않고 보관용

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

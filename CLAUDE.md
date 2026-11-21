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
games/*.html              게임 29종 (+ backrooms-pc 고화질판)
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
titan 거인 토벌전(진격의 거인 팬 게임, 3D 와이어 액션, 단원 연계 없음) · fest 무궁화 운동회(최대 24명) · egg 에그 대작전 · cham 카멜레온 숨바꼭질 · op38 새벽 작전 38 · halmae 할매 특공대 · halmae2 할매 특공대 2 · halmae3 할매 특공대 3 · halmae4 할매 특공대 4 · halmae5 할매 특공대 5 · pangpang 웨더팡팡 · garden 날씨 정원 · kart 날씨 카트 레이스 · wrivals 날씨 라이벌즈 · wisland 날씨 생존 섬 · dad 엄격한 에너지 아빠 · hospital 한밤의 동물병원 · brawl 에너지 브롤 · blocks 에너지 블록 마을 · park 한밤의 에너지 공원 · keycap 키캡 타워 · forest 에너지 숲의 밤 · backrooms 백룸 방탈출 · rivals 에너지 라이벌즈 · spy 탄소 스파이를 찾아라 · hero 에너지 히어로 · front 에너지 전선 · jump 에너지 점프 · town 에너지 마을 시장 · wing 탄소 제로 비행단 · world 에너지 월드

## 거인 토벌전(titan.html) — 2026-11-21 다시 추가
- 3D 모델·three.js를 파일 안에 넣은 단일 HTML(약 54MB). 캐릭터 7명 선택(사샤 추가), 스토리 모드 12개 챕터(훈련병단 입대 ~ 땅울림)와 엔딩, 캐릭터별 대사, 난이도(쉬움 기본/보통), 아이템, 과학 퀴즈 60문제, 동료 거인화.
- 2026-11-21 추가 모델(모두 Sketchfab CC BY 4.0, 출처는 시작 화면 아래 표기): “AOTWA Fat Titan”·“Aot sasha braus rig”(Prime Slayer3D), “Aot City 3”(damr.optimus2008). 도시 모델은 트로스트·오르부드·시간시나 탈환·레벨리오·파라디 챕터에서 쓴다.
- 캐릭터·장비·건물 모델은 Sketchfab CC BY 4.0 모델(출처는 게임 시작 화면 아래에 표기). 일반 거인은 MakeHuman 기본 메쉬(CC0), 뼈대·걷기 동작은 three.js 예제 Xbot.
- 거인 모델 5종(진격·갑옷·짐승·초대형 2호·여성형)은 파일에 출처·라이선스 정보가 없다(Blender에서 내보낸 glb). 문제가 생기면 이 5종만 빼고 기본 거인 모델로 다시 빌드할 수 있다.
- 배경 음악: `games/titan-music/`의 `feuer.mp3`·`march.mp3`·`void.mp3`·`final.mp3`(직접 만든 Suno 곡). 챕터 1~12 순서로 march·feuer·march·march·void·void·void·march·feuer·march·feuer·final. 파일을 못 불러오면 게임이 자체 연주 음악을 튼다.
- 같이 하기: '방 만들기'(4자리 방 코드 자동 생성) 또는 방 코드 입력 후 '입장' → 대기방(참가자·준비 상태·채팅). 방장이 챕터를 고르고 모두 준비되면 함께 시작한다. 같은 방에서는 같은 캐릭터를 고를 수 없고, 거인화한 친구는 거인으로 보인다. 통신은 Supabase(iux-cloud) Realtime broadcast(`titan_<방 코드>`). 적 거인은 공유하지 않는다. 실제 두 기기 접속 확인은 아직 안 됨(한 컴퓨터의 창 두 개로만 시험).
- 그 밖에 2026-11-21 추가: 동료 지령(H)·거점 건설·구조 신호·기습/훅 드라이브·우정·장비 강화, 스토리 전투 뒤 쉬는 시간 대화(선택지), 뇌창은 챕터 9부터, 갑옷 거인은 칼날이 튕김. 대사 음성 기능은 넣었다가 뺐다.
- 엔딩(땅울림 뒤): 캐릭터별 엔딩 장면 → 세 장면(아르민의 배·리바이의 사탕·미카사의 목도리) → 제작(민왕 게임 월드)·음악(핸드골드킹) → 2편 예고 → 캐릭터 전원이 손 흔드는 THE END. 캐릭터·거인은 애니풍 외곽선과 두 단계 음영. 거인 올라타기(C), 전투 중 동료 대사, 쉬는 시간 대화 36가지.
- 원본(패치 스크립트·모델 변환 도구)은 저장소에 없다. 고칠 때는 Claude 대화에서 다시 빌드해 파일을 통째로 바꾼다.

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

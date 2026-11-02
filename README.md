# 👑 민왕게임월드 (Minwang Game World)

설치·로그인 없이 브라우저에서 바로 하는 웹게임 모음 원페이지 사이트예요.
5학년 2학기 「자원과 에너지」 단원과 연계된 게임 15개와 「날씨와 우리 생활」 단원 게임 3개가 들어 있어요.

## 구성
- `index.html` — 원페이지 사이트 (썸네일·배경 이미지가 파일 안에 들어 있음)
- `games/` — 게임 파일 18개 (+ 백룸 방탈출 PC 고화질판)
- `thumbs/`, `hero/` — 썸네일·첫 화면 배경 원본 이미지

## 실행
`index.html`을 열면 돼요. 3D 게임은 three.js·PeerJS를 인터넷에서 불러오므로 인터넷 연결이 필요해요.

GitHub Pages로 공개하려면: 저장소 Settings → Pages → Branch `main` / `(root)` 를 선택하면 돼요.

## 게임 추가
`index.html`의 `GAMES` 목록에 한 줄 추가하고 `games/`에 게임 파일, `thumbs/`에 썸네일을 넣어요.
(썸네일을 파일 안에 넣는 빌드 스크립트를 쓰지 않는 경우 `IMG` 대신 `thumbs/` 경로를 써도 돼요.)

## Vercel 배포
1. vercel.com → **Add New… → Project** → GitHub의 `handgoldking1234/game` **Import**
2. Framework Preset: **Other** (빌드 없음, 그대로 두고) → **Deploy**
3. 완료되면 `https://<프로젝트이름>.vercel.app` 주소로 열려요. 이후 `main`에 푸시할 때마다 자동으로 다시 배포돼요.

## 온라인 대전 (빠른 시작 · 방 목록)
카트 레이스 · 에너지 브롤 · 에너지 블록 마을 · 에너지 라이벌즈에는 처음 화면에 **⚡ 빠른 시작 / 📋 방 목록** 막대가 있어요.
- 방 목록·접속 인원은 Supabase(iux-cloud) Realtime Presence 채널 `mwg-lobby-<게임>`으로 주고받아요. 테이블은 필요 없어요.
- 게임 중 통신은 방장과 직접 연결(PeerJS, 막히면 MQTT 중계)이라 Supabase 사용량이 아주 적어요.
- `.github/workflows/supabase-keepalive.yml`이 3일마다 Supabase를 깨워 둬요(무료 프로젝트 7일 잠듦 방지).

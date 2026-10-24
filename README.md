# 👑 민왕게임월드 (Minwang Game World)

설치·로그인 없이 브라우저에서 바로 하는 웹게임 모음 원페이지 사이트예요.
5학년 2학기 「자원과 에너지」 단원과 연계된 게임 15개가 들어 있어요.

## 구성
- `index.html` — 원페이지 사이트 (썸네일·배경 이미지가 파일 안에 들어 있음)
- `games/` — 게임 파일 15개 (+ 백룸 방탈출 PC 고화질판)
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

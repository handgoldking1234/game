# 5학년 과학 게임 6종 (12세 이용가)

공용 틀(`kit.html`)에 게임별 코드(`g/g1~g6.js`)를 끼워 단일 HTML을 만듭니다.

| 번호 | 게임 | 단원 | 완성 파일 | 사이트 |
|---|---|---|---|---|
| 1 | 에그 대작전 | 자원과 에너지 | out/egg-mission.html | games/egg.html |
| 2 | 무궁화 운동회 (최대 24명) | 혼합물의 분리·열·날씨·자원과 에너지 | out/speed-festival.html | games/fest.html |
| 3 | 새벽 작전 38 | 날씨와 우리 생활 | out/dawn-op-38.html | games/op38.html |
| 4 | 카멜레온 숨바꼭질 | 열의 이동 | out/chameleon-hide.html | games/cham.html |
| 5 | 와이어 기동대 | 자원과 에너지 | out/wall-defenders.html | 올리지 않음 |
| 6 | 달빛 검사단 RPG | 날씨와 우리 생활 | out/moonlight-blades.html | 올리지 않음 |

## 만들기
```
bash build.sh        # out/*.html (배포용) + test/t1~t6.html (로컬 시험용) 생성
```
- 사이트에 올릴 때는 `out/*.html` 맨 위 `<head>` 다음 줄에 `<script src="../mwt.js" defer></script>`를 넣어 `games/`에 복사합니다.
- 같이 하기: 4자리 방 번호(PeerJS, 막히면 MQTT 중계 `netfix.js`). 방장이 모두의 위치를 묶어서 전달합니다. 게임마다 최대 인원은 `GAME.maxP`(기본 8명, 무궁화 운동회 24명).

## 시험 (tools/)
`test/`에서 `python3 -m http.server 8765`를 켜고, three.min.js를 `test/`에 둔 뒤 실행합니다.
- `node tools/bot.js <번호> <ms>` 자동 플레이로 끝까지 깨기
- `node tools/multi.js` / `tools/multiN.js` 같이 하기 접속·인원 초과 시험
- `node tools/shot9.js <번호> "<상태 코드>"` PC·휴대폰 화면 찍기

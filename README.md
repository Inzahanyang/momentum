# Momentum Clone

바닐라 JS로 만든 크롬 새 탭 앱. 시계 · 로그인 · 투두 · 랜덤 배경 · 날씨.

## 실행 전 준비: 날씨 API 키

날씨 기능은 무료 OpenWeather API 키가 필요해요.

1. https://openweathermap.org/api 가입 → API keys에서 키 복사
2. `js/app.js`의 아래 부분을 본인 키로 교체:

```js
const API_KEY = "PUT_YOUR_OPENWEATHER_API_KEY_HERE";
```

> 키를 안 넣어도 시계·로그인·투두·배경은 정상 작동하고, 날씨 칸만 "API 키 확인"으로 표시됩니다.
> 새로 발급한 키는 활성화까지 최대 몇 시간 걸릴 수 있어요.

## GitHub Pages 배포

`13-momentum` 폴더 안에서:

```bash
git init
git add .
git commit -m "Momentum clone"
git branch -M main
git remote add origin https://github.com/(내아이디)/momentum.git
git push -u origin main
```

저장소 → **Settings → Pages** → Source: `main` / `/(root)` → Save.
1~2분 뒤 나오는 링크를 제출:

```
https://(내아이디).github.io/momentum/
```

## 기능 체크리스트

- ✅ 실시간 시계 (시:분:초 + 날짜)
- ✅ localStorage 로그인 (이름 저장, 로그아웃)
- ✅ localStorage 투두 (추가/완료/삭제)
- ✅ 랜덤 배경 이미지 (새로고침마다 변경)
- ✅ 날씨 + 위치 (Geolocation + OpenWeather)
- ✅ 외부 라이브러리 없이 순수 바닐라 JS

## 배경 이미지를 로컬 파일로 바꾸려면

`img/` 폴더에 이미지를 넣고 `js/app.js`의 `IMAGES` 배열을 파일 경로로 교체하세요.

```js
const IMAGES = ["img/0.jpg", "img/1.jpg", "img/2.jpg"];
```

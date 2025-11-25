# Expo 실행 가이드 🚀

## 📱 빠른 실행

터미널을 열고 다음 명령어를 입력하세요:

```bash
cd /Users/hamzzi/Documents/vibecoding/vibe-today
npm start
```

그러면 다음과 같은 화면이 나타납니다:

```
› Metro waiting on exp://192.168.x.x:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)

┌──────────────────────────────────────────────────────────────┐
│                                                              │
│   ██████████████  ████  ██    ████  ██████████████          │
│   ██          ██  ██████  ████  ██  ██          ██          │
│   ██  ██████  ██    ██  ██  ██      ██  ██████  ██          │
│   ██  ██████  ██  ██████████████    ██  ██████  ██          │
│   ██  ██████  ██    ████████████    ██  ██████  ██          │
│   ██          ██  ████  ████    ██  ██          ██          │
│   ██████████████  ██  ██  ██  ██  ██████████████           │
│                   ██████████████                             │
│                                                              │
└──────────────────────────────────────────────────────────────┘

› Press i │ open iOS simulator
› Press a │ open Android emulator  
› Press w │ open web
```

## 🎯 실행 방법

### 방법 1: Expo Go 앱 사용 (추천)

1. **스마트폰에 Expo Go 설치**
   - iOS: [App Store에서 다운로드](https://apps.apple.com/app/expo-go/id982107779)
   - Android: [Play Store에서 다운로드](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. **QR 코드 스캔**
   - iOS: 카메라 앱으로 QR 코드 스캔
   - Android: Expo Go 앱에서 QR 코드 스캔

3. **앱 자동 실행!** 🎉

### 방법 2: 시뮬레이터 사용

터미널에서 키보드 단축키:

- **`i`** - iOS 시뮬레이터 (Mac만 가능, Xcode 필요)
- **`a`** - Android 에뮬레이터 (Android Studio 필요)
- **`w`** - 웹 브라우저

### 방법 3: 직접 명령어로 실행

```bash
# iOS 시뮬레이터
npm run ios

# Android 에뮬레이터
npm run android

# 웹 브라우저
npm run web
```

## ⚠️ 문제 해결

### QR 코드가 안 보여요

**원인**: Metro 번들러가 시작되는 중이거나 오류가 발생했을 수 있습니다.

**해결 방법**:
```bash
# 1. 서버 중지 (Ctrl + C)
# 2. 캐시 클리어 후 재시작
npm start -c
```

### "Something went wrong" 오류

```bash
# 캐시 클리어
npm start -c

# 또는 node_modules 재설치
rm -rf node_modules
npm install
npm start
```

### "Module not found" 오류

```bash
# 의존성 재설치
npm install

# 그래도 안되면
npm start -c
```

### 포트가 사용 중입니다

```bash
# 포트를 사용하는 프로세스 종료
lsof -ti:8081 | xargs kill -9

# 다시 시작
npm start
```

### Metro 번들러가 느려요

```bash
# 워치맨 캐시 클리어 (Mac)
watchman watch-del-all

# Metro 캐시 클리어
npm start -- --reset-cache
```

## 🎨 개발 중 유용한 기능

### 핫 리로딩

파일을 저장하면 자동으로 앱이 새로고침됩니다!

### 디버그 메뉴

앱 실행 중:
- iOS: `Cmd + D`
- Android: `Cmd + M` 또는 기기 흔들기

### 터미널 단축키

- `r` - 앱 새로고침
- `m` - 개발자 메뉴 토글
- `j` - Chrome 디버거 열기

## 📱 첫 실행 시 보게 될 화면

1. **로딩 화면** - 앱이 시작됩니다
2. **로그인 화면** - Google 로그인 버튼이 있습니다 (아직 기능 구현 전)
3. **홈 화면** - 오늘의 키워드와 일기 작성 UI
4. **하단 탭** - 홈, 갤러리, 프로필 탭

## 🔍 현재 구현 상태

- ✅ UI/UX 디자인
- ✅ 화면 레이아웃
- ✅ 네비게이션
- ✅ Firebase 설정
- ⏳ Google 로그인 (구현 필요)
- ⏳ AI 이미지 생성 (구현 필요)
- ⏳ 데이터 저장/불러오기 (구현 필요)

---

**Happy Coding! 🎉**


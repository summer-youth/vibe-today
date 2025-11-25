# 바이브투데이 빠른 시작 가이드 ⚡

프로젝트를 빠르게 시작하기 위한 간단한 가이드입니다.

## 1️⃣ 의존성 설치 (1분)

```bash
npm install
```

## 2️⃣ 환경 변수 설정 (2분)

```bash
# .env 파일 생성
cp .env.example .env
```

`.env` 파일을 열고 다음 값들을 입력하세요:

```env
# Firebase 설정 (Firebase Console에서 확인)
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123

# Google Sign-In (Firebase Console > Authentication > Sign-in method)
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your_client_id.apps.googleusercontent.com

# Gemini API (Google AI Studio에서 발급)
EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
```

## 3️⃣ 개발 서버 실행 (즉시)

```bash
npm start
```

그러면 QR 코드가 나타납니다:

- **iOS**: Expo Go 앱으로 QR 코드 스캔
- **Android**: Expo Go 앱으로 QR 코드 스캔
- **시뮬레이터**: `i` (iOS) 또는 `a` (Android) 키 입력

## 📱 Expo Go 앱 설치

- [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
- [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

## 🔥 Firebase 빠른 설정

### 1. Firebase 프로젝트 생성

1. [Firebase Console](https://console.firebase.google.com/) 접속
2. "프로젝트 추가" 클릭
3. 프로젝트 이름 입력 후 생성

### 2. Authentication 활성화

1. Authentication > Sign-in method
2. Google 활성화
3. 프로젝트 지원 이메일 입력

### 3. Firestore 생성

1. Firestore Database > 데이터베이스 만들기
2. 테스트 모드로 시작
3. 위치: asia-northeast3 선택

### 4. Storage 생성

1. Storage > 시작하기
2. 테스트 모드로 시작

### 5. 앱 등록

1. 프로젝트 설정 > 앱 추가 > 웹
2. 앱 닉네임 입력
3. Firebase SDK 설정 정보를 `.env`에 복사

## 🎨 Gemini API 키 발급

1. [Google AI Studio](https://makersuite.google.com/app/apikey) 접속
2. "Create API Key" 클릭
3. API 키를 `.env`에 복사

## 🚀 다음 단계

프로젝트가 실행되면:

1. **로그인 화면**이 나타납니다 (Google 로그인 버튼은 아직 구현 전)
2. **홈 화면**에서 오늘의 키워드와 텍스트 입력 UI를 볼 수 있습니다
3. **갤러리 탭**에서 목 데이터를 확인할 수 있습니다
4. **프로필 탭**에서 사용자 정보를 볼 수 있습니다

## 📝 구현해야 할 기능

현재는 **UI 스켈레톤**만 구현되어 있습니다. 다음 기능들을 구현해야 합니다:

- [ ] Google 로그인 구현
- [ ] Gemini API 이미지 생성 연동
- [ ] Firebase Storage 이미지 업로드
- [ ] Firestore 데이터 저장/불러오기
- [ ] 실제 데이터 연동

## 🔍 프로젝트 구조 이해하기

```
src/
├── features/      # 기능별 모듈 (auth, vibe)
├── pages/         # 화면 (Login, Home, Gallery, Profile)
├── ui/            # 공통 컴포넌트 (Button, Card, Input)
├── navigation/    # 네비게이션 설정
├── services/      # Firebase, Gemini 연동
├── constants/     # 키워드, 테마
├── utils/         # 유틸리티 함수
└── types/         # TypeScript 타입
```

## 💡 유용한 명령어

```bash
# 개발 서버 시작
npm start

# iOS 시뮬레이터
npm run ios

# Android 에뮬레이터
npm run android

# 타입 체크
npm run type-check

# Lint 체크
npm run lint

# 캐시 클리어 후 시작
expo start -c
```

## 📚 더 알아보기

- [SETUP.md](./SETUP.md) - 상세한 설정 가이드
- [ARCHITECTURE.md](./ARCHITECTURE.md) - 아키텍처 설명
- [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) - 프로젝트 구조
- [CONTRIBUTING.md](./CONTRIBUTING.md) - 기여 가이드

## ❓ 문제 해결

### Metro Bundler 오류

```bash
expo start -c
```

### TypeScript 오류

```bash
npm run type-check
```

### 의존성 문제

```bash
rm -rf node_modules
npm install
```

---

**Happy Coding! 🎉**


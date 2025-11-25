# 바이브투데이 설정 가이드

이 문서는 "바이브투데이" 프로젝트를 처음 설정하는 방법을 안내합니다.

## 1. 개발 환경 준비

### 필수 요구사항

- Node.js 18 이상
- npm 또는 yarn
- Expo CLI
- iOS 개발: Xcode (macOS)
- Android 개발: Android Studio

### Expo CLI 설치

```bash
npm install -g expo-cli
```

## 2. 프로젝트 설치

```bash
# 의존성 설치
npm install

# 또는 yarn 사용
yarn install
```

## 3. Firebase 설정

### 3.1. Firebase 프로젝트 생성

1. [Firebase Console](https://console.firebase.google.com/)에 접속
2. "프로젝트 추가" 클릭
3. 프로젝트 이름 입력 (예: vibe-today)
4. Google Analytics 설정 (선택사항)

### 3.2. Firebase 서비스 활성화

#### Authentication 설정

1. Firebase Console > Authentication > Sign-in method
2. Google 로그인 활성화
3. 프로젝트 지원 이메일 설정

#### Firestore Database 설정

1. Firebase Console > Firestore Database
2. "데이터베이스 만들기" 클릭
3. 테스트 모드로 시작 (나중에 보안 규칙 설정)
4. 위치 선택 (asia-northeast3 권장)

#### Storage 설정

1. Firebase Console > Storage
2. "시작하기" 클릭
3. 테스트 모드로 시작
4. 위치 선택 (Firestore와 동일한 위치 권장)

### 3.3. Firebase 앱 등록

#### iOS 앱 등록

1. Firebase Console > 프로젝트 설정 > 앱 추가 > iOS
2. iOS 번들 ID 입력: `com.vibecoding.vibetoday`
3. `GoogleService-Info.plist` 다운로드
4. 프로젝트 루트에 파일 배치

#### Android 앱 등록

1. Firebase Console > 프로젝트 설정 > 앱 추가 > Android
2. Android 패키지 이름 입력: `com.vibecoding.vibetoday`
3. `google-services.json` 다운로드
4. 프로젝트 루트에 파일 배치

### 3.4. 환경 변수 설정

1. `.env.example` 파일을 `.env`로 복사

```bash
cp .env.example .env
```

2. Firebase Console > 프로젝트 설정 > 일반 탭에서 Firebase 설정 정보 확인
3. `.env` 파일에 값 입력

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key_here
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id_here
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id_here
```

## 4. Google Sign-In 설정

### 4.1. OAuth 클라이언트 ID 생성

1. [Google Cloud Console](https://console.cloud.google.com/)
2. Firebase 프로젝트와 연결된 프로젝트 선택
3. API 및 서비스 > 사용자 인증 정보
4. "사용자 인증 정보 만들기" > "OAuth 클라이언트 ID"
5. 애플리케이션 유형: 웹 애플리케이션
6. 생성된 클라이언트 ID를 `.env`에 추가

```env
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your_google_web_client_id_here
```

### 4.2. iOS 추가 설정

1. OAuth 클라이언트 ID 추가 생성 (iOS 유형)
2. 번들 ID: `com.vibecoding.vibetoday`

### 4.3. Android 추가 설정

1. OAuth 클라이언트 ID 추가 생성 (Android 유형)
2. 패키지 이름: `com.vibecoding.vibetoday`
3. SHA-1 인증서 지문 입력 (디버그 키스토어)

디버그 SHA-1 확인:

```bash
# macOS/Linux
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android

# Windows
keytool -list -v -keystore "%USERPROFILE%\.android\debug.keystore" -alias androiddebugkey -storepass android -keypass android
```

## 5. Gemini API 설정

1. [Google AI Studio](https://makersuite.google.com/app/apikey)에서 API 키 발급
2. `.env` 파일에 추가

```env
EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
```

## 6. 프로젝트 실행

```bash
# 개발 서버 시작
npm start

# iOS 시뮬레이터
npm run ios

# Android 에뮬레이터
npm run android

# 웹 브라우저
npm run web
```

## 7. Firestore 보안 규칙 설정

프로덕션 배포 전에 보안 규칙을 설정해야 합니다.

Firebase Console > Firestore Database > 규칙:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Vibes 컬렉션
    match /vibes/{vibeId} {
      // 인증된 사용자만 자신의 데이터 읽기/쓰기 가능
      allow read, write: if request.auth != null 
        && request.auth.uid == resource.data.userId;
      
      // 새 문서 생성 시
      allow create: if request.auth != null 
        && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

Firebase Console > Storage > 규칙:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /vibes/{userId}/{allPaths=**} {
      // 인증된 사용자만 자신의 이미지 업로드/읽기 가능
      allow read, write: if request.auth != null 
        && request.auth.uid == userId;
    }
  }
}
```

## 8. 문제 해결

### Metro Bundler 캐시 문제

```bash
expo start -c
```

### iOS 빌드 문제

```bash
cd ios
pod install
cd ..
```

### Android 빌드 문제

```bash
cd android
./gradlew clean
cd ..
```

## 9. 다음 단계

- [ ] Google Sign-In 구현 완료
- [ ] Gemini API 이미지 생성 연동
- [ ] Firebase Storage 이미지 업로드 구현
- [ ] 실제 데이터 연동 테스트
- [ ] UI/UX 개선
- [ ] 아이콘 및 스플래시 이미지 추가

---

문제가 발생하면 [GitHub Issues](https://github.com/your-repo/issues)에 문의해주세요.


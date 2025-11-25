# Firebase 설정 체크리스트 ✅

## 📋 단계별 체크리스트

### ☑️ 1단계: Firebase 프로젝트 생성
- [ ] [Firebase Console](https://console.firebase.google.com/) 접속
- [ ] "프로젝트 추가" 클릭
- [ ] 프로젝트 이름 입력: `vibe-today` (또는 원하는 이름)
- [ ] Google Analytics 설정 (선택사항)
- [ ] 프로젝트 생성 완료

### ☑️ 2단계: 웹 앱 등록
- [ ] Firebase Console > ⚙️ 설정 아이콘 > "프로젝트 설정"
- [ ] 아래로 스크롤하여 "내 앱" 섹션 찾기
- [ ] 웹 아이콘(`</>`) 클릭
- [ ] 앱 닉네임 입력: `vibe-today-web`
- [ ] "앱 등록" 클릭
- [ ] Firebase SDK 설정 정보 복사 (다음 단계에서 사용)

### ☑️ 3단계: Authentication 설정
- [ ] Firebase Console > Authentication 메뉴
- [ ] "시작하기" 또는 "Sign-in method" 탭 클릭
- [ ] Google 로그인 선택
- [ ] "사용 설정" 토글 ON
- [ ] 프로젝트 지원 이메일 입력
- [ ] "저장" 클릭
- [ ] **중요**: "웹 SDK 구성" 섹션에서 **웹 클라이언트 ID** 복사

### ☑️ 4단계: Firestore Database 설정
- [ ] Firebase Console > Firestore Database 메뉴
- [ ] "데이터베이스 만들기" 클릭
- [ ] **테스트 모드로 시작** 선택
- [ ] 위치 선택: **asia-northeast3 (서울)** 권장
- [ ] "사용 설정" 클릭
- [ ] 데이터베이스 생성 완료 대기

### ☑️ 5단계: Storage 설정
- [ ] Firebase Console > Storage 메뉴
- [ ] "시작하기" 클릭
- [ ] **테스트 모드로 시작** 선택
- [ ] 위치: Firestore와 동일 위치 선택
- [ ] "완료" 클릭

### ☑️ 6단계: .env 파일 생성 및 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 입력:

```env
# Firebase Configuration (2단계에서 복사한 값)
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSy...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=vibe-today.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=vibe-today
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=vibe-today.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123

# Google Sign-In (3단계에서 복사한 웹 클라이언트 ID)
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=123456789-abc...apps.googleusercontent.com

# Gemini API (선택사항 - 나중에 추가 가능)
EXPO_PUBLIC_GEMINI_API_KEY=
```

**체크리스트:**
- [ ] `.env` 파일 생성 완료
- [ ] Firebase API Key 입력
- [ ] Firebase Auth Domain 입력
- [ ] Firebase Project ID 입력
- [ ] Firebase Storage Bucket 입력
- [ ] Firebase Messaging Sender ID 입력
- [ ] Firebase App ID 입력
- [ ] Google Web Client ID 입력

## 🧪 설정 테스트

### 방법 1: 프로젝트 실행 후 콘솔 확인

```bash
npm start
```

실행 후 에러 없이 시작되면 Firebase 설정이 제대로 된 것입니다.

### 방법 2: Firebase 연결 테스트 (선택사항)

임시로 테스트 코드를 추가해볼 수 있습니다:

```typescript
// App.tsx에 임시로 추가
import { db, auth, storage } from './src/services/firebase';

console.log('Firebase 초기화 완료!');
console.log('Firestore:', db ? '✅' : '❌');
console.log('Auth:', auth ? '✅' : '❌');
console.log('Storage:', storage ? '✅' : '❌');
```

## 🔒 보안 규칙 설정 (프로덕션 배포 전 필수)

### Firestore 보안 규칙

Firebase Console > Firestore Database > 규칙:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // vibes 컬렉션
    match /vibes/{vibeId} {
      // 인증된 사용자만 읽기 가능
      allow read: if request.auth != null 
        && request.auth.uid == resource.data.userId;
      
      // 인증된 사용자만 자신의 데이터 생성 가능
      allow create: if request.auth != null 
        && request.auth.uid == request.resource.data.userId
        && request.resource.data.keys().hasAll(['userId', 'keyword', 'text', 'imageUrl', 'createdAt']);
      
      // 인증된 사용자만 자신의 데이터 수정/삭제 가능
      allow update, delete: if request.auth != null 
        && request.auth.uid == resource.data.userId;
    }
  }
}
```

### Storage 보안 규칙

Firebase Console > Storage > 규칙:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // vibes/{userId}/ 경로
    match /vibes/{userId}/{allPaths=**} {
      // 인증된 사용자만 자신의 이미지 읽기/쓰기 가능
      allow read, write: if request.auth != null 
        && request.auth.uid == userId;
    }
  }
}
```

**체크리스트:**
- [ ] Firestore 보안 규칙 설정
- [ ] Storage 보안 규칙 설정
- [ ] 규칙 게시 완료

## 📱 네이티브 빌드 시 추가 설정 (나중에)

Expo Go가 아닌 네이티브 빌드를 할 때 필요:

### iOS
- [ ] Firebase Console에서 iOS 앱 추가
- [ ] Bundle ID: `com.vibecoding.vibetoday`
- [ ] `GoogleService-Info.plist` 다운로드
- [ ] 프로젝트 루트에 배치

### Android
- [ ] Firebase Console에서 Android 앱 추가
- [ ] Package name: `com.vibecoding.vibetoday`
- [ ] SHA-1 인증서 지문 등록 (디버그 + 릴리즈)
- [ ] `google-services.json` 다운로드
- [ ] 프로젝트 루트에 배치

## ❓ 문제 해결

### Firebase 설정 값을 찾을 수 없어요
➡️ Firebase Console > ⚙️ > 프로젝트 설정 > 일반 > 내 앱 > SDK 설정 및 구성

### Google 웹 클라이언트 ID를 찾을 수 없어요
➡️ Firebase Console > Authentication > Sign-in method > Google > 웹 SDK 구성

### .env 파일이 작동하지 않아요
➡️ 서버 재시작: `expo start -c` (캐시 클리어)

### "Missing API Key" 에러
➡️ `.env` 파일의 환경 변수 이름이 정확한지 확인 (`EXPO_PUBLIC_` 접두사 필수)

## ✅ 설정 완료!

모든 체크리스트를 완료했다면:

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm start
```

축하합니다! Firebase 설정이 완료되었습니다! 🎉

---

**다음 단계**: Google 로그인 기능 구현하기


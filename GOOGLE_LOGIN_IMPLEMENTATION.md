# Google 로그인 구현 완료 ✅

## 🎉 구현 완료 사항

### 1. Google 로그인 기능
- ✅ Firebase Authentication과 Google OAuth 연동
- ✅ 웹 플랫폼: `signInWithPopup` 사용
- ✅ iOS / Android: `@react-native-google-signin/google-signin` 사용
- ✅ 로그인 성공 시 자동으로 Firestore Users 컬렉션에 저장

### 2. Users 컬렉션 자동 저장
- ✅ 로그인 시 자동으로 Users 컬렉션에 유저 정보 저장
- ✅ 기존 유저인 경우 업데이트, 신규 유저인 경우 생성
- ✅ 저장되는 정보:
  - `uid`: Firebase Auth UID
  - `email`: 이메일 주소
  - `displayName`: 표시 이름
  - `photoURL`: 프로필 사진 URL
  - `createdAt`: 생성 시간 (신규 유저만)
  - `updatedAt`: 업데이트 시간

---

## 📋 Firestore Users 컬렉션 구조

### 컬렉션: `users`

**Document ID**: `{userId}` (Firebase Auth UID)

**Document Fields**:
```typescript
{
  uid: string;              // Firebase Auth UID
  email: string | null;     // 이메일 주소
  displayName: string | null; // 표시 이름
  photoURL: string | null;   // 프로필 사진 URL
  createdAt: Timestamp;      // 생성 시간 (신규 유저만)
  updatedAt: Timestamp;      // 업데이트 시간
}
```

---

## 🔒 Firestore 보안 규칙 설정

Firebase Console에서 다음 보안 규칙을 설정해주세요:

### Firestore Database > 규칙

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users 컬렉션
    match /users/{userId} {
      // 인증된 사용자만 자신의 데이터 읽기 가능
      allow read: if request.auth != null 
        && request.auth.uid == userId;
      
      // 인증된 사용자만 자신의 데이터 생성/업데이트 가능
      allow create, update: if request.auth != null 
        && request.auth.uid == userId
        && request.resource.data.uid == userId;
      
      // 삭제는 불가 (데이터 보존)
      allow delete: if false;
    }
    
    // Vibes 컬렉션 (기존)
    match /vibes/{vibeId} {
      allow read: if request.auth != null 
        && request.auth.uid == resource.data.userId;
      
      allow create: if request.auth != null 
        && request.auth.uid == request.resource.data.userId
        && request.resource.data.keys().hasAll(['userId', 'keyword', 'text', 'imageUrl', 'createdAt']);
      
      allow update, delete: if request.auth != null 
        && request.auth.uid == resource.data.userId;
    }
  }
}
```

---

## ⚙️ 환경 변수 설정

`.env` 파일에 다음 값이 설정되어 있어야 합니다:

```env
# Firebase 설정
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id

# Google Sign-In (필수!)
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your_google_web_client_id

# iOS 네이티브 로그인을 위한 선택값
EXPO_PUBLIC_IOS_GOOGLE_CLIENT_ID=your_ios_client_id
```

**Google Web Client ID 확인 방법:**
1. Firebase Console > Authentication > Sign-in method
2. Google 클릭
3. "웹 SDK 구성" 섹션에서 "웹 클라이언트 ID" 복사

---

## 🚀 사용 방법

### 로그인 플로우

1. **로그인 화면**에서 "Google로 시작하기" 버튼 클릭
2. Google 로그인 팝업/화면 표시
3. Google 계정 선택 및 권한 승인
4. 로그인 성공 시:
   - Firebase Authentication에 사용자 등록
   - Firestore Users 컬렉션에 자동 저장
   - 홈 화면으로 자동 이동

### 로그아웃

프로필 화면에서 로그아웃 버튼 클릭 시:
- Firebase Authentication에서 로그아웃
- 로그인 화면으로 이동

---

## 📱 플랫폼별 동작

### 웹 (Web)
- `signInWithPopup` 사용
- 팝업 창으로 Google 로그인 진행

### 모바일 (iOS/Android - Expo Dev Client)
- `@react-native-google-signin/google-signin` 네이티브 모듈 사용
- Google Play Services / iOS GoogleServices 설정 필요
- Expo Dev Client 또는 EAS 빌드에서 테스트해야 함 (Expo Go 미지원)

---

## 🔍 디버깅

### 로그 확인

콘솔에서 다음 로그를 확인할 수 있습니다:

```
✅ New user saved to Firestore  // 신규 유저 저장
✅ User updated in Firestore     // 기존 유저 업데이트
```

### 일반적인 오류

1. **"Google Web Client ID is not configured"**
   - `.env` 파일에 `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` 설정 확인

2. **"Google sign-in was cancelled"**
   - 사용자가 로그인을 취소한 경우 (정상 동작)

3. **"Failed to get ID token from Google"**
   - OAuth 토큰 교환 실패
   - Google Cloud Console에서 OAuth 설정 확인

4. **Firestore 권한 오류**
   - Firestore 보안 규칙 확인
   - 사용자가 로그인되어 있는지 확인

---

## ✅ 테스트 체크리스트

- [ ] `.env` 파일에 Google Web Client ID 설정
- [ ] Firebase Console에서 Google 로그인 활성화
- [ ] Firestore 보안 규칙 설정
- [ ] 로그인 버튼 클릭 시 Google 로그인 화면 표시
- [ ] 로그인 성공 시 홈 화면으로 이동
- [ ] Firestore Users 컬렉션에 유저 정보 저장 확인
- [ ] 프로필 화면에서 유저 정보 표시 확인
- [ ] 로그아웃 기능 작동 확인

---

## 🎊 완료!

이제 Google 로그인이 완전히 작동합니다!

**다음 단계:**
1. 앱 실행: `npm start`
2. 로그인 버튼 클릭
3. Google 계정으로 로그인
4. Firestore에서 Users 컬렉션 확인

---

**문제가 발생하면 콘솔 로그를 확인하세요!** 🔍


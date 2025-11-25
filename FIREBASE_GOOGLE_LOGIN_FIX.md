# Firebase Google 로그인 오류 해결 가이드 🔧

Firebase를 통한 Google 로그인에서 "Access blocked: Authorization Error" 오류를 해결하는 방법입니다.

## 🔍 문제 원인

Firebase Authentication을 사용할 때는:
1. Firebase Console에서 Google Sign-in이 활성화되어 있어야 함
2. Firebase가 자동으로 OAuth 클라이언트를 생성하지만, 리디렉션 URI 설정이 필요함
3. Google Cloud Console에서 Firebase 프로젝트와 연결된 OAuth 클라이언트 ID를 확인해야 함

---

## ✅ 해결 방법 (단계별)

### 1단계: Firebase Console에서 Google Sign-in 확인

1. **[Firebase Console](https://console.firebase.google.com/)** 접속
2. 프로젝트 선택 (vibe-today)
3. **Authentication** > **Sign-in method** 이동
4. **Google** 클릭
5. **사용 설정** 토글이 **ON**인지 확인
6. **웹 SDK 구성** 섹션에서 **웹 클라이언트 ID** 복사
   - 예: `542053200020-xxxxxxxxxxxxx.apps.googleusercontent.com`
7. 이 클라이언트 ID가 `.env` 파일의 `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`와 일치하는지 확인

### 2단계: Google Cloud Console에서 OAuth 클라이언트 ID 확인

1. **[Google Cloud Console](https://console.cloud.google.com/)** 접속
2. **프로젝트 선택기**에서 Firebase 프로젝트와 동일한 프로젝트 선택
   - 프로젝트 이름: `vibe-today` (또는 Firebase 프로젝트 이름)
3. **API 및 서비스** > **사용자 인증 정보** 이동
4. **OAuth 2.0 클라이언트 ID** 목록에서 Firebase Console에서 복사한 **웹 클라이언트 ID** 찾기
5. 해당 클라이언트 ID 클릭하여 편집

### 3단계: 리디렉션 URI 추가 (가장 중요!)

**OAuth 클라이언트 ID 편집 화면에서:**

1. **승인된 리디렉션 URI** 섹션으로 이동
2. **+ URI 추가** 클릭
3. 다음 URI들을 **하나씩** 추가:

```
https://auth.expo.io/@your-expo-username/vibe-today
exp://127.0.0.1:8081
http://localhost:8081
http://localhost:19000
http://localhost:19001
http://localhost:19002
```

**참고:** 
- `@your-expo-username`은 실제 Expo 사용자명으로 변경하세요
- 앱을 실행하고 로그인을 시도하면 콘솔에 실제 리디렉션 URI가 출력됩니다
- 그 URI를 정확히 복사해서 추가하세요

### 4단계: OAuth 동의 화면 설정

1. **API 및 서비스** > **OAuth 동의 화면** 이동
2. **사용자 유형** 확인:
   - **외부** (일반 사용자에게 공개) - 개발 중에는 이 옵션 사용
3. **앱 정보** 확인:
   - 앱 이름: 바이브투데이 (또는 원하는 이름)
   - 사용자 지원 이메일: 본인 이메일
4. **범위 (Scopes)** 확인:
   - `openid`
   - `profile`
   - `email`
5. **테스트 사용자 추가** (중요!):
   - **테스트 사용자** 섹션으로 이동
   - **+ ADD USERS** 클릭
   - 로그인할 Google 계정 이메일 입력
   - 여러 계정을 테스트하려면 모두 추가
6. **게시 상태** 확인:
   - **테스트 중** 상태로 설정되어 있는지 확인
   - 개발 중에는 프로덕션으로 게시하지 마세요

### 5단계: 실제 리디렉션 URI 확인

앱을 실행하고 로그인을 시도하면 콘솔에 다음과 같은 메시지가 출력됩니다:

```
🔗 리디렉션 URI: https://auth.expo.io/@your-username/vibe-today
💡 이 URI를 Google Cloud Console > API 및 서비스 > 사용자 인증 정보 >
   OAuth 2.0 클라이언트 ID > 승인된 리디렉션 URI에 추가하세요.
```

**이 URI를 정확히 복사해서 Google Cloud Console에 추가하세요!**

### 6단계: 설정 저장 및 확인

1. Google Cloud Console에서 **저장** 클릭
2. Firebase Console에서 설정이 올바른지 다시 확인
3. `.env` 파일의 `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`가 올바른지 확인

### 7단계: 앱 재시작

설정 변경 후 앱을 완전히 재시작하세요:

```bash
# 캐시 클리어하고 재시작
npm start -- --clear
```

---

## 🔧 빠른 체크리스트

다음 사항들을 확인하세요:

- [ ] Firebase Console > Authentication > Sign-in method > Google이 **사용 설정**됨
- [ ] Firebase Console의 **웹 클라이언트 ID**가 `.env` 파일과 일치함
- [ ] Google Cloud Console에서 해당 **웹 클라이언트 ID**를 찾았음
- [ ] **승인된 리디렉션 URI**에 Expo URI가 추가됨 (앱 실행 시 콘솔에 출력된 URI)
- [ ] OAuth 동의 화면에서 **테스트 사용자**로 본인 이메일 추가됨
- [ ] OAuth 동의 화면의 **게시 상태**가 **테스트 중**으로 설정됨
- [ ] 앱을 재시작했음 (`npm start -- --clear`)

---

## 🚨 여전히 오류가 발생하는 경우

### 1. 리디렉션 URI 재확인

앱을 실행하고 로그인을 시도하면 콘솔에 실제 리디렉션 URI가 출력됩니다. 이 URI를 정확히 복사해서 Google Cloud Console에 추가하세요.

**중요:** 리디렉션 URI는 정확히 일치해야 합니다 (대소문자, 슬래시, 프로토콜 등).

### 2. Firebase 프로젝트 확인

Firebase Console과 Google Cloud Console에서 **같은 프로젝트**를 사용하고 있는지 확인하세요.

### 3. 클라이언트 ID 확인

`.env` 파일의 `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`가:
- Firebase Console > Authentication > Sign-in method > Google > 웹 SDK 구성의 클라이언트 ID와 일치하는지
- Google Cloud Console의 OAuth 클라이언트 ID 목록에 있는지

### 4. 테스트 사용자 확인

- OAuth 동의 화면의 테스트 사용자 목록에 추가된 계정으로 로그인하는지 확인
- 다른 Google 계정으로 시도해보기

### 5. 캐시 클리어

```bash
# Expo 캐시 클리어
npm start -- --clear

# 브라우저 캐시도 클리어
# Chrome/Edge: Ctrl+Shift+Delete (Windows) 또는 Cmd+Shift+Delete (Mac)
```

### 6. 설정 반영 대기

Google Cloud Console에서 설정을 변경한 후 **몇 분 정도 기다려야** 반영될 수 있습니다.

---

## 📝 Firebase vs Google Cloud Console

**Firebase Console:**
- Google Sign-in 활성화/비활성화
- 웹 클라이언트 ID 확인
- Firebase Authentication 설정

**Google Cloud Console:**
- OAuth 클라이언트 ID 관리
- 리디렉션 URI 추가
- OAuth 동의 화면 설정
- 테스트 사용자 추가

**중요:** Firebase Console과 Google Cloud Console은 **같은 프로젝트**를 사용해야 합니다!

---

## 💡 팁

1. **리디렉션 URI는 정확히 일치해야 합니다**
   - 앱 실행 시 콘솔에 출력된 URI를 그대로 복사해서 사용하세요

2. **테스트 모드로 설정하세요**
   - 개발 중에는 OAuth 동의 화면을 **테스트 중** 상태로 유지하세요
   - 프로덕션 배포 전에 Google 검증을 받아야 합니다

3. **테스트 사용자를 추가하세요**
   - 테스트 모드에서는 테스트 사용자 목록에 추가된 계정으로만 로그인할 수 있습니다

4. **설정 변경 후 대기하세요**
   - Google Cloud Console에서 설정을 변경한 후 몇 분 정도 기다려야 반영될 수 있습니다

---

## 🔗 참고 자료

- [Firebase Authentication 가이드](https://firebase.google.com/docs/auth)
- [Google OAuth 2.0 정책](https://developers.google.com/identity/protocols/oauth2/policies)
- [Expo AuthSession 문서](https://docs.expo.dev/guides/authentication/#google)


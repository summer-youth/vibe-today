# exp:// 스킴 문제 해결 가이드 🔧

`exp://10.0.0.41:8081` 같은 URI는 Google OAuth에서 허용되지 않습니다. Google은 `https://` 또는 `http://` 스킴만 허용합니다.

## ✅ 해결 방법

코드를 수정하여 `exp://` 스킴이 나와도 자동으로 `https://auth.expo.io/...` 형식으로 변환하도록 했습니다.

### 1. 앱 재시작

```bash
npm start -- --clear
```

### 2. 로그인 시도 후 콘솔 확인

앱을 실행하고 로그인을 시도하면 콘솔에 다음과 같은 메시지가 출력됩니다:

```
⚠️ exp:// 스킴이 감지되었습니다. Expo 프록시 URI로 변경합니다.
💡 사용된 URI: https://auth.expo.io/@anonymous/vibe-today
🔗 리디렉션 URI: https://auth.expo.io/@anonymous/vibe-today
```

### 3. Google Cloud Console에 URI 추가

콘솔에 출력된 `https://auth.expo.io/...` 형식의 URI를 Google Cloud Console에 추가하세요:

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 프로젝트 선택 (vibe-today)
3. **API 및 서비스** > **사용자 인증 정보** 이동
4. OAuth 2.0 클라이언트 ID 목록에서 다음 클라이언트 ID 찾기:
   ```
   542053200020-rl1urbg2t2sr0eke9d3vo2qtpmsnnjad.apps.googleusercontent.com
   ```
5. 클라이언트 ID 클릭하여 편집
6. **승인된 리디렉션 URI** 섹션으로 이동
7. **+ URI 추가** 클릭
8. 다음 URI들을 추가:

```
https://auth.expo.io/@anonymous/vibe-today
https://auth.expo.io/@your-expo-username/vibe-today
```

**참고:** 
- `@anonymous`는 Expo 계정에 로그인하지 않은 경우 사용됩니다
- Expo 계정에 로그인하면 `@your-expo-username` 형식이 됩니다

### 4. Expo 계정에 로그인 (선택사항, 권장)

더 정확한 URI를 사용하려면 Expo 계정에 로그인하세요:

```bash
npx expo login
```

로그인 후 앱을 재시작하면 `https://auth.expo.io/@your-username/vibe-today` 형식의 URI가 생성됩니다.

### 5. OAuth 동의 화면 설정 확인

1. **API 및 서비스** > **OAuth 동의 화면** 이동
2. **테스트 사용자** 섹션으로 이동
3. **+ ADD USERS** 클릭
4. 로그인할 Google 계정 이메일 추가
5. **게시 상태**가 **테스트 중**으로 설정되어 있는지 확인

### 6. 앱 재시작 및 테스트

```bash
npm start -- --clear
```

이제 로그인을 시도하면 `https://auth.expo.io/...` 형식의 URI가 사용되며, Google Cloud Console에 추가한 URI와 일치합니다.

---

## 🔍 문제 원인

- `exp://` 스킴은 커스텀 URL 스킴으로, Google OAuth에서 허용되지 않습니다
- Google OAuth는 `https://` 또는 `http://` 스킴만 허용합니다
- Expo의 프록시 서버(`https://auth.expo.io/...`)를 사용해야 합니다

---

## 💡 팁

1. **Expo 계정에 로그인하세요**
   - 더 정확한 URI를 사용할 수 있습니다
   - `@anonymous` 대신 실제 사용자명이 사용됩니다

2. **리디렉션 URI는 정확히 일치해야 합니다**
   - 콘솔에 출력된 URI를 그대로 복사해서 사용하세요
   - 대소문자, 슬래시, 프로토콜까지 정확히 일치해야 합니다

3. **여러 URI를 추가하세요**
   - `@anonymous`와 실제 사용자명 모두 추가하면 더 안전합니다

---

## ✅ 체크리스트

- [ ] 앱을 재시작했음 (`npm start -- --clear`)
- [ ] 콘솔에 `https://auth.expo.io/...` 형식의 URI가 출력됨
- [ ] Google Cloud Console에 해당 URI를 추가했음
- [ ] OAuth 동의 화면에서 테스트 사용자 추가했음
- [ ] 게시 상태가 테스트 중으로 설정됨
- [ ] 로그인 테스트 성공

---

이제 `exp://` 스킴 대신 `https://auth.expo.io/...` 형식이 사용되므로 Google Cloud Console에 추가할 수 있습니다!


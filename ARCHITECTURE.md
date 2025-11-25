# 바이브투데이 아키텍처 문서

## 프로젝트 구조

이 프로젝트는 **Screaming Architecture** 패턴을 따릅니다. 이는 프로젝트 구조를 보는 것만으로도 애플리케이션이 무엇을 하는지 알 수 있도록 하는 아키텍처입니다.

```
vibe-today/
├── src/
│   ├── features/              # 기능별 모듈 (도메인 중심)
│   │   ├── auth/             # 인증 기능
│   │   │   ├── components/   # 인증 관련 컴포넌트
│   │   │   ├── hooks/        # 인증 관련 커스텀 훅
│   │   │   ├── services/     # 인증 API 서비스
│   │   │   ├── store/        # 인증 상태 관리
│   │   │   └── validation/   # 인증 유효성 검사
│   │   ├── vibe/             # 바이브 생성 및 관리
│   │   └── gallery/          # 갤러리 기능
│   ├── pages/                # 화면 컴포넌트
│   │   ├── LoginScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── GalleryScreen.tsx
│   │   └── ProfileScreen.tsx
│   ├── navigation/           # 네비게이션 설정
│   ├── ui/                   # 공통 UI 컴포넌트
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   └── Loading.tsx
│   ├── hooks/                # 공통 커스텀 훅
│   ├── utils/                # 유틸리티 함수
│   │   ├── date.ts
│   │   └── validation.ts
│   ├── constants/            # 상수 정의
│   │   ├── keywords.ts
│   │   └── theme.ts
│   ├── services/             # 외부 서비스 연동
│   │   ├── firebase.ts
│   │   └── gemini.ts
│   └── types/                # TypeScript 타입 정의
│       ├── vibe.ts
│       └── user.ts
├── assets/                   # 정적 리소스
├── App.tsx                   # 앱 진입점
├── package.json
├── tsconfig.json
└── app.json
```

## 아키텍처 원칙

### 1. Feature-First Organization (기능 우선 구조)

각 기능(feature)은 독립적인 모듈로 구성되며, 해당 기능에 필요한 모든 것을 포함합니다:

- **components**: 해당 기능에서만 사용되는 UI 컴포넌트
- **hooks**: 해당 기능의 로직을 캡슐화한 커스텀 훅
- **services**: 외부 API 또는 서비스와의 통신
- **store**: 상태 관리 (Zustand 사용)
- **validation**: 데이터 유효성 검사 로직

### 2. Separation of Concerns (관심사의 분리)

- **Pages**: 화면 레이아웃과 네비게이션만 담당
- **Features**: 비즈니스 로직과 도메인 로직
- **UI**: 재사용 가능한 프레젠테이션 컴포넌트
- **Services**: 외부 시스템과의 통신

### 3. Dependency Rule (의존성 규칙)

```
Pages → Features → Services
  ↓         ↓
  UI    ← Utils/Constants
```

- Pages는 Features와 UI를 사용
- Features는 Services, Utils, Constants를 사용
- UI는 Constants만 사용 (독립적)
- 역방향 의존성 금지

## 주요 기술 스택

### Frontend

- **React Native**: 크로스 플랫폼 모바일 앱 프레임워크
- **Expo**: React Native 개발 플랫폼
- **TypeScript**: 타입 안정성
- **React Navigation**: 네비게이션

### State Management

- **Zustand**: 경량 상태 관리 라이브러리
  - 간단한 API
  - TypeScript 완벽 지원
  - 보일러플레이트 최소화

### Backend & Services

- **Firebase Authentication**: 사용자 인증
- **Firestore**: NoSQL 데이터베이스
- **Firebase Storage**: 이미지 저장
- **Gemini API**: AI 이미지 생성

### Styling

- **StyleSheet API**: React Native 기본 스타일링
- **Theme System**: 일관된 디자인 시스템

## 데이터 흐름

### 1. 인증 플로우

```
LoginScreen
    ↓
authService.signInWithGoogle()
    ↓
Firebase Authentication
    ↓
authStore.setUser()
    ↓
AppNavigator (리다이렉트)
    ↓
MainTabs (HomeScreen)
```

### 2. Vibe 생성 플로우

```
HomeScreen (사용자 입력)
    ↓
useVibe.createNewVibe()
    ↓
geminiService.generateVibeImage()
    ↓
vibeService.createVibe()
    ↓
Firestore 저장
    ↓
vibeStore.addVibe()
    ↓
UI 업데이트
```

### 3. 갤러리 로드 플로우

```
GalleryScreen (마운트)
    ↓
useVibe.loadVibes()
    ↓
vibeService.getVibes()
    ↓
Firestore 쿼리
    ↓
vibeStore.setVibes()
    ↓
UI 렌더링
```

## 상태 관리 전략

### Global State (Zustand)

- **authStore**: 사용자 인증 상태
- **vibeStore**: Vibe 데이터 및 UI 상태

### Local State (useState)

- 폼 입력값
- UI 상태 (로딩, 에러 등)
- 임시 데이터

### Server State

- Firebase Firestore (실시간 동기화)
- 낙관적 업데이트 패턴 사용

## 에러 처리

### 1. Try-Catch 패턴

모든 비동기 작업은 try-catch로 래핑:

```typescript
try {
  const result = await someAsyncOperation();
  return result;
} catch (error) {
  console.error('Error:', error);
  throw error;
}
```

### 2. Store 레벨 에러 상태

```typescript
interface Store {
  error: string | null;
  setError: (error: string | null) => void;
}
```

### 3. UI 레벨 에러 표시

- Toast 메시지
- 인라인 에러 메시지
- 에러 바운더리 (추후 추가)

## 성능 최적화

### 1. 이미지 최적화

- 적절한 이미지 크기 사용
- 캐싱 전략
- Lazy Loading

### 2. 리스트 최적화

- FlatList 사용
- windowSize 설정
- getItemLayout 구현

### 3. 메모이제이션

- React.memo for components
- useMemo for expensive calculations
- useCallback for event handlers

## 보안

### 1. Firebase Security Rules

- 사용자별 데이터 접근 제어
- 읽기/쓰기 권한 분리

### 2. 환경 변수

- API 키는 환경 변수로 관리
- `.env` 파일은 git에서 제외

### 3. 데이터 유효성 검사

- 클라이언트 측 유효성 검사
- 서버 측 유효성 검사 (Firebase Rules)

## 테스트 전략 (추후 구현)

### 1. Unit Tests

- Utils 함수
- Validation 로직
- Store 로직

### 2. Integration Tests

- Feature 모듈
- API 서비스

### 3. E2E Tests

- 주요 사용자 플로우
- 인증 플로우
- Vibe 생성 플로우

## 배포 전략 (추후 구현)

### 1. 개발 환경

- Expo Go 앱으로 테스트
- 개발용 Firebase 프로젝트

### 2. 스테이징 환경

- TestFlight (iOS)
- Google Play Internal Testing (Android)
- 스테이징 Firebase 프로젝트

### 3. 프로덕션 환경

- App Store
- Google Play Store
- 프로덕션 Firebase 프로젝트

## 향후 개선 사항

- [ ] 오프라인 지원 (Firebase Offline Persistence)
- [ ] 푸시 알림
- [ ] 다크 모드
- [ ] 다국어 지원 (i18n)
- [ ] 애니메이션 개선
- [ ] 접근성 개선
- [ ] 성능 모니터링 (Firebase Performance)
- [ ] 크래시 리포팅 (Firebase Crashlytics)
- [ ] A/B 테스팅 (Firebase Remote Config)

---

이 문서는 프로젝트가 진행됨에 따라 지속적으로 업데이트됩니다.


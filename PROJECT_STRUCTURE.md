# 바이브투데이 프로젝트 구조

## 📁 전체 디렉토리 구조

```
vibe-today/
├── 📄 설정 파일
│   ├── package.json              # 프로젝트 의존성 및 스크립트
│   ├── tsconfig.json             # TypeScript 설정
│   ├── app.json                  # Expo 설정
│   ├── babel.config.js           # Babel 설정 (경로 별칭 포함)
│   ├── metro.config.js           # Metro 번들러 설정
│   ├── .eslintrc.js              # ESLint 설정
│   ├── .prettierrc               # Prettier 설정
│   ├── .editorconfig             # 에디터 설정
│   ├── .gitignore                # Git 무시 파일
│   └── .env.example              # 환경 변수 템플릿
│
├── 📚 문서
│   ├── README.md                 # 프로젝트 소개
│   ├── SETUP.md                  # 설정 가이드
│   ├── ARCHITECTURE.md           # 아키텍처 문서
│   └── PROJECT_STRUCTURE.md      # 이 파일
│
├── 🎨 assets/                    # 정적 리소스
│   └── .gitkeep
│
├── 📱 App.tsx                    # 앱 진입점
│
└── 🗂️ src/                       # 소스 코드
    │
    ├── 🎯 features/              # 기능별 모듈 (Screaming Architecture)
    │   │
    │   ├── auth/                 # 인증 기능
    │   │   ├── hooks/
    │   │   │   └── useAuth.ts           # 인증 커스텀 훅
    │   │   ├── services/
    │   │   │   └── authService.ts       # Firebase Auth 연동
    │   │   └── store/
    │   │       └── authStore.ts         # 인증 상태 관리 (Zustand)
    │   │
    │   └── vibe/                 # 바이브 생성 및 관리
    │       ├── hooks/
    │       │   └── useVibe.ts           # Vibe 커스텀 훅
    │       ├── services/
    │       │   └── vibeService.ts       # Firestore CRUD
    │       └── store/
    │           └── vibeStore.ts         # Vibe 상태 관리 (Zustand)
    │
    ├── 📱 pages/                 # 화면 컴포넌트
    │   ├── LoginScreen.tsx       # 로그인 화면
    │   ├── HomeScreen.tsx        # 홈 화면 (바이브 생성)
    │   ├── GalleryScreen.tsx     # 갤러리 화면
    │   ├── ProfileScreen.tsx     # 프로필 화면
    │   └── index.ts              # 페이지 export
    │
    ├── 🧭 navigation/            # 네비게이션 설정
    │   └── AppNavigator.tsx      # 앱 네비게이터 (Stack + Tabs)
    │
    ├── 🎨 ui/                    # 공통 UI 컴포넌트
    │   ├── Button.tsx            # 버튼 컴포넌트
    │   ├── Card.tsx              # 카드 컴포넌트
    │   ├── Input.tsx             # 입력 컴포넌트
    │   ├── Loading.tsx           # 로딩 컴포넌트
    │   └── index.ts              # UI 컴포넌트 export
    │
    ├── 🔧 utils/                 # 유틸리티 함수
    │   ├── date.ts               # 날짜 관련 유틸
    │   ├── validation.ts         # 유효성 검사
    │   └── index.ts              # 유틸 export
    │
    ├── 📦 constants/             # 상수 정의
    │   ├── keywords.ts           # 키워드 목록 및 함수
    │   ├── theme.ts              # 디자인 시스템 (색상, 타이포그래피 등)
    │   └── index.ts              # 상수 export
    │
    ├── 🌐 services/              # 외부 서비스 연동
    │   ├── firebase.ts           # Firebase 초기화
    │   ├── gemini.ts             # Gemini API 연동
    │   └── index.ts              # 서비스 export
    │
    └── 📝 types/                 # TypeScript 타입 정의
        ├── vibe.ts               # Vibe 관련 타입
        ├── user.ts               # 사용자 관련 타입
        └── index.ts              # 타입 export
```

## 📊 파일 통계

- **총 파일 수**: 35개
- **TypeScript/TSX 파일**: 28개
- **설정 파일**: 7개
- **문서 파일**: 4개

## 🎯 주요 디렉토리 설명

### `/src/features/` - 기능별 모듈

각 기능은 독립적인 모듈로 구성되며, 다음을 포함합니다:

- **hooks/**: 비즈니스 로직을 캡슐화한 커스텀 훅
- **services/**: 외부 API 통신 로직
- **store/**: Zustand를 사용한 상태 관리
- **components/**: 해당 기능에서만 사용되는 컴포넌트 (필요시 추가)
- **validation/**: 데이터 유효성 검사 (필요시 추가)

### `/src/pages/` - 화면 컴포넌트

각 화면은 다음 역할을 수행합니다:

- 레이아웃 구성
- features의 hooks 사용
- ui 컴포넌트 조합
- 네비게이션 처리

### `/src/ui/` - 공통 UI 컴포넌트

재사용 가능한 프레젠테이션 컴포넌트:

- 비즈니스 로직 없음
- Props를 통한 커스터마이징
- 일관된 디자인 시스템 적용

### `/src/services/` - 외부 서비스

- Firebase 초기화 및 설정
- Gemini API 연동
- 기타 외부 API 연동

## 🔗 경로 별칭 (Path Aliases)

TypeScript와 Babel에서 다음 경로 별칭을 사용할 수 있습니다:

```typescript
import { Button } from '@ui';                    // src/ui
import { useAuth } from '@features/auth/hooks';  // src/features
import { colors } from '@constants';             // src/constants
import { formatDate } from '@utils';             // src/utils
import { db } from '@services';                  // src/services
```

## 📝 명명 규칙

### 파일명

- **컴포넌트**: PascalCase (예: `Button.tsx`, `HomeScreen.tsx`)
- **훅**: camelCase with 'use' prefix (예: `useAuth.ts`, `useVibe.ts`)
- **서비스**: camelCase with 'Service' suffix (예: `authService.ts`)
- **스토어**: camelCase with 'Store' suffix (예: `authStore.ts`)
- **유틸**: camelCase (예: `validation.ts`, `date.ts`)
- **타입**: camelCase (예: `vibe.ts`, `user.ts`)

### 변수 및 함수

- **컴포넌트**: PascalCase (예: `Button`, `HomeScreen`)
- **함수**: camelCase (예: `formatDate`, `validateVibeText`)
- **상수**: UPPER_SNAKE_CASE (예: `KEYWORDS`, `API_ENDPOINT`)
- **타입/인터페이스**: PascalCase (예: `Vibe`, `User`, `AuthState`)

## 🚀 다음 단계

현재 프로젝트는 **초기 셋팅**이 완료된 상태입니다. 다음 단계로 진행할 수 있습니다:

1. **의존성 설치**: `npm install`
2. **환경 변수 설정**: `.env` 파일 생성 및 설정
3. **Firebase 설정**: Firebase 프로젝트 생성 및 연동
4. **개발 서버 실행**: `npm start`
5. **기능 구현**: 각 TODO 주석을 확인하고 구현

## 📌 TODO 주석 위치

코드 내에 `TODO:` 주석이 있는 위치들:

- `src/services/firebase.ts` - Firebase 설정 값 확인
- `src/services/gemini.ts` - Gemini API 실제 구현
- `src/features/auth/services/authService.ts` - Google Sign-In 구현
- `src/features/vibe/services/vibeService.ts` - 날짜 필터 추가
- `src/pages/LoginScreen.tsx` - Google Sign-In 버튼 구현
- `src/pages/HomeScreen.tsx` - Vibe 생성 로직 연동
- `src/pages/GalleryScreen.tsx` - 실제 데이터 로드
- `src/pages/ProfileScreen.tsx` - 로그아웃 구현
- `src/navigation/AppNavigator.tsx` - 탭 아이콘 추가

---

**Happy Coding! 🎨✨**


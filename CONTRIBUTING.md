# 바이브투데이 기여 가이드

이 프로젝트에 기여해주셔서 감사합니다! 이 문서는 프로젝트에 기여하는 방법을 안내합니다.

## 🎯 코딩 스타일

### TypeScript

- **타입 안정성**: `any` 사용 지양, 명시적 타입 정의
- **인터페이스 vs 타입**: 객체 구조는 `interface`, 유니온/교차 타입은 `type` 사용
- **Null 체크**: Optional chaining (`?.`)과 Nullish coalescing (`??`) 활용

```typescript
// Good
interface User {
  id: string;
  name: string;
  email?: string;
}

// Bad
const user: any = { id: '1', name: 'John' };
```

### React Native 컴포넌트

- **함수형 컴포넌트**: 클래스 컴포넌트 대신 함수형 컴포넌트 사용
- **Props 타입**: 명시적 인터페이스 정의
- **Export**: Named export 사용 (default export 지양)

```typescript
// Good
interface ButtonProps {
  title: string;
  onPress: () => void;
}

export const Button: React.FC<ButtonProps> = ({ title, onPress }) => {
  // ...
};

// Bad
export default function Button(props: any) {
  // ...
}
```

### 스타일링

- **StyleSheet API**: 인라인 스타일 대신 `StyleSheet.create()` 사용
- **테마 시스템**: `@constants/theme`의 값 사용
- **명명**: 의미 있는 스타일 이름 사용

```typescript
// Good
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  title: {
    ...typography.h1,
    color: colors.text.primary,
  },
});

// Bad
const styles = StyleSheet.create({
  view1: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});
```

## 📁 파일 구조 규칙

### 새 기능 추가

새로운 기능을 추가할 때는 `src/features/` 아래에 새 디렉토리를 만듭니다:

```
src/features/새기능/
├── components/      # 해당 기능 전용 컴포넌트
├── hooks/          # 커스텀 훅
├── services/       # API 서비스
├── store/          # 상태 관리
└── validation/     # 유효성 검사 (필요시)
```

### 새 화면 추가

새로운 화면은 `src/pages/`에 추가하고, `index.ts`에서 export:

```typescript
// src/pages/NewScreen.tsx
export const NewScreen: React.FC = () => {
  // ...
};

// src/pages/index.ts
export { NewScreen } from './NewScreen';
```

### 공통 컴포넌트 추가

재사용 가능한 UI 컴포넌트는 `src/ui/`에 추가:

```typescript
// src/ui/NewComponent.tsx
export const NewComponent: React.FC<Props> = (props) => {
  // ...
};

// src/ui/index.ts
export { NewComponent } from './NewComponent';
```

## 🔧 상태 관리

### Zustand Store 생성

```typescript
import { create } from 'zustand';

interface MyStore {
  // State
  data: string[];
  isLoading: boolean;
  
  // Actions
  setData: (data: string[]) => void;
  setLoading: (isLoading: boolean) => void;
  reset: () => void;
}

export const useMyStore = create<MyStore>((set) => ({
  data: [],
  isLoading: false,
  
  setData: (data) => set({ data }),
  setLoading: (isLoading) => set({ isLoading }),
  reset: () => set({ data: [], isLoading: false }),
}));
```

### 커스텀 훅 작성

```typescript
import { useMyStore } from '../store/myStore';
import { myService } from '../services/myService';

export const useMyFeature = () => {
  const { data, isLoading, setData, setLoading } = useMyStore();

  const loadData = async () => {
    try {
      setLoading(true);
      const result = await myService.getData();
      setData(result);
    } catch (error) {
      console.error('Error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    isLoading,
    loadData,
  };
};
```

## 🧪 테스트 (추후 추가)

현재는 테스트가 구현되어 있지 않지만, 추후 다음과 같은 테스트를 추가할 예정입니다:

- Unit Tests (Jest)
- Integration Tests
- E2E Tests (Detox)

## 📝 커밋 메시지

커밋 메시지는 다음 형식을 따릅니다:

```
<type>: <subject>

<body>
```

### Type

- `feat`: 새로운 기능
- `fix`: 버그 수정
- `docs`: 문서 변경
- `style`: 코드 포맷팅 (기능 변경 없음)
- `refactor`: 코드 리팩토링
- `test`: 테스트 추가/수정
- `chore`: 빌드 프로세스, 도구 설정 등

### 예시

```
feat: Google 로그인 기능 구현

- Firebase Authentication 연동
- Google Sign-In 버튼 추가
- 인증 상태 관리 구현
```

## 🔍 코드 리뷰

Pull Request를 생성하기 전에 다음을 확인하세요:

- [ ] 코드가 ESLint 규칙을 준수하는가?
- [ ] TypeScript 타입 에러가 없는가?
- [ ] 새로운 기능에 대한 문서가 작성되었는가?
- [ ] 기존 기능이 정상적으로 작동하는가?
- [ ] 불필요한 console.log가 제거되었는가?

## 🐛 버그 리포트

버그를 발견하면 다음 정보를 포함하여 이슈를 생성해주세요:

- **환경**: OS, 디바이스, React Native 버전
- **재현 방법**: 버그를 재현하는 단계
- **예상 동작**: 어떻게 동작해야 하는가?
- **실제 동작**: 실제로 어떻게 동작하는가?
- **스크린샷**: 가능하면 스크린샷 첨부

## 💡 기능 제안

새로운 기능을 제안하려면:

1. 이슈를 생성하여 아이디어를 공유
2. 기능의 목적과 사용 사례 설명
3. 가능하면 UI 목업이나 예시 제공
4. 팀의 피드백을 기다림

## 📞 문의

질문이나 도움이 필요하면:

- GitHub Issues에 질문 등록
- 이메일: your-email@example.com

---

다시 한번 기여해주셔서 감사합니다! 🙏


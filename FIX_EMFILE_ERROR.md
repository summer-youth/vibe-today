# "EMFILE: too many open files" 에러 해결 가이드 🔧

## 문제 설명

```
Error: EMFILE: too many open files, watch
```

이 에러는 macOS에서 파일 시스템이 감시할 수 있는 파일 수 제한을 초과했을 때 발생합니다.
React Native/Expo 프로젝트는 많은 파일을 감시해야 하므로 이 문제가 자주 발생합니다.

---

## 🚀 빠른 해결 방법 (3가지)

### 방법 1: Watchman 설치 (가장 권장)

**Watchman**은 Facebook에서 만든 파일 감시 서비스로, 이 문제를 근본적으로 해결합니다.

```bash
# Homebrew로 Watchman 설치
brew install watchman

# 설치 확인
watchman --version

# 캐시 정리
watchman watch-del-all

# Expo 재시작
cd /Users/hamzzi/Documents/vibecoding/vibe-today
npm start
```

### 방법 2: 시스템 파일 디스크립터 제한 증가

```bash
# 현재 제한 확인
ulimit -n

# 임시로 제한 증가 (터미널 세션 동안만 유효)
ulimit -n 65536

# Expo 실행
npm start
```

**영구적으로 적용하려면:**

```bash
# .zshrc 파일 편집
echo "ulimit -n 65536" >> ~/.zshrc

# 적용
source ~/.zshrc
```

### 방법 3: node_modules 정리 후 재설치

```bash
# 프로젝트 디렉토리로 이동
cd /Users/hamzzi/Documents/vibecoding/vibe-today

# node_modules 삭제
rm -rf node_modules

# 캐시 정리
npm cache clean --force

# 재설치
npm install

# Expo 실행
npm start
```

---

## 🎯 권장 순서

### Step 1: Watchman 설치 (필수)

```bash
# Homebrew가 없다면 먼저 설치
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Watchman 설치
brew install watchman

# 확인
watchman --version
```

### Step 2: 파일 제한 증가

```bash
# .zshrc에 추가
echo "ulimit -n 65536" >> ~/.zshrc
source ~/.zshrc
```

### Step 3: Expo 재시작

```bash
cd /Users/hamzzi/Documents/vibecoding/vibe-today

# 캐시 클리어하고 시작
npm start -- --clear
```

---

## 🔍 문제가 계속되면

### 1. Metro 번들러 수동 재시작

```bash
# 프로세스 종료
pkill -f "react-native"
pkill -f "expo"

# 포트 정리
npx kill-port 8081 19000 19001

# 재시작
npm start
```

### 2. Watchman 상태 확인 및 정리

```bash
# Watchman 상태 확인
watchman watch-list

# 모든 watch 삭제
watchman watch-del-all

# Watchman 서버 종료
watchman shutdown-server

# Watchman 재시작 (자동)
watchman version
```

### 3. 시스템 전체 정리

```bash
# Expo 캐시 정리
rm -rf ~/.expo

# Metro 캐시 정리
rm -rf /tmp/metro-*
rm -rf /tmp/haste-map-*

# npm 캐시 정리
npm cache clean --force

# 프로젝트 정리
cd /Users/hamzzi/Documents/vibecoding/vibe-today
rm -rf node_modules
rm -rf .expo
npm install

# 재시작
npm start
```

---

## 💡 예방 팁

### 1. .gitignore 확인

불필요한 파일이 감시되지 않도록 `.gitignore`에 추가:

```gitignore
node_modules/
.expo/
.expo-shared/
dist/
npm-debug.*
*.jks
*.p8
*.p12
*.key
*.mobileprovision
*.orig.*
web-build/
```

### 2. Watchman 정기적으로 정리

```bash
# 주기적으로 실행
watchman watch-del-all
```

### 3. VS Code 설정

VS Code의 파일 감시 제한 증가:

```json
// settings.json
{
  "files.watcherExclude": {
    "**/node_modules/**": true,
    "**/.expo/**": true,
    "**/.expo-shared/**": true,
    "**/dist/**": true
  }
}
```

---

## ✅ 확인 체크리스트

- [ ] Watchman 설치됨 (`watchman --version`)
- [ ] ulimit 증가됨 (`ulimit -n` → 65536 이상)
- [ ] node_modules 재설치
- [ ] 캐시 정리 완료
- [ ] 불필요한 프로세스 종료
- [ ] Expo 정상 실행 확인

---

## 🎉 정상 실행 확인

Expo가 정상적으로 시작되면:

```
Starting Metro Bundler
› Metro waiting on exp://192.168.x.x:8081

┌──────────────────────────────────────┐
│                                      │
│   QR 코드가 여기 표시됩니다          │
│                                      │
└──────────────────────────────────────┘

› Press i │ open iOS simulator
› Press a │ open Android emulator
```

이렇게 QR 코드와 함께 정상적으로 시작됩니다!

---

**문제가 해결되지 않으면 알려주세요!** 🙋‍♂️


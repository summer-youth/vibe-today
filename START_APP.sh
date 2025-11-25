#!/bin/bash

# 바이브투데이 앱 시작 스크립트

echo "🚀 바이브투데이 앱 시작 중..."
echo ""

# 프로젝트 디렉토리로 이동
cd /Users/hamzzi/Documents/vibecoding/vibe-today

# 기존 프로세스 종료
echo "📦 기존 프로세스 정리 중..."
pkill -f "expo" 2>/dev/null || true
pkill -f "react-native" 2>/dev/null || true

# 포트 정리
npx kill-port 8081 19000 19001 2>/dev/null || true

echo ""
echo "✨ Expo 개발 서버 시작 중..."
echo ""
echo "───────────────────────────────────────"
echo "  QR 코드가 나타나면:"
echo "  - Expo Go 앱으로 스캔하세요"
echo "  - 또는 'i' (iOS), 'a' (Android), 'w' (Web)"
echo "───────────────────────────────────────"
echo ""

# Expo 시작 (캐시 클리어)
npm start -- --clear


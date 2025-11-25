/**
 * Firebase 초기화 및 설정
 * 
 * 사용 전 .env 파일에 Firebase 설정 값을 입력해야 합니다.
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase 설정
// EXPO_PUBLIC_ 환경 변수는 process.env에서 직접 접근 가능
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Firebase 앱 초기화 (중복 초기화 방지)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Firebase 서비스 인스턴스
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;


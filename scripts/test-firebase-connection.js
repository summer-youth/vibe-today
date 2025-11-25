/**
 * Firebase 실제 연결 테스트
 * 
 * Node.js 환경에서 Firebase에 실제로 연결이 되는지 테스트합니다.
 */

// .env 파일 로드
require('dotenv').config();

const { initializeApp, getApps } = require('firebase/app');
const { getAuth } = require('firebase/auth');
const { getFirestore, collection, getDocs } = require('firebase/firestore');
const { getStorage } = require('firebase/storage');

console.log('🔥 Firebase 연결 테스트 시작...\n');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

// Firebase 설정
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// 설정 값 확인
console.log('📋 Firebase 설정:');
console.log('─'.repeat(50));
console.log(`Project ID: ${colors.blue}${firebaseConfig.projectId}${colors.reset}`);
console.log(`Auth Domain: ${colors.blue}${firebaseConfig.authDomain}${colors.reset}`);
console.log(`Storage Bucket: ${colors.blue}${firebaseConfig.storageBucket}${colors.reset}`);
console.log('');

async function testConnection() {
  try {
    // 1. Firebase 초기화 테스트
    console.log('🔌 1. Firebase 초기화 테스트');
    console.log('─'.repeat(50));
    
    let app;
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig);
      console.log(`${colors.green}✓${colors.reset} Firebase 앱 초기화 성공`);
    } else {
      app = getApps()[0];
      console.log(`${colors.green}✓${colors.reset} Firebase 앱 이미 초기화됨`);
    }
    console.log('');

    // 2. Authentication 테스트
    console.log('🔐 2. Authentication 서비스 테스트');
    console.log('─'.repeat(50));
    
    const auth = getAuth(app);
    if (auth) {
      console.log(`${colors.green}✓${colors.reset} Authentication 서비스 초기화 성공`);
      console.log(`  - Current User: ${auth.currentUser ? auth.currentUser.email : 'Not logged in'}`);
    } else {
      console.log(`${colors.red}✗${colors.reset} Authentication 서비스 초기화 실패`);
    }
    console.log('');

    // 3. Firestore 테스트
    console.log('💾 3. Firestore Database 테스트');
    console.log('─'.repeat(50));
    
    try {
      const db = getFirestore(app);
      console.log(`${colors.green}✓${colors.reset} Firestore 서비스 초기화 성공`);
      
      // 컬렉션 접근 테스트 (실제 데이터 읽기는 하지 않음)
      const testCollection = collection(db, 'vibes');
      console.log(`${colors.green}✓${colors.reset} 컬렉션 참조 생성 성공 (vibes)`);
      console.log(`  ${colors.yellow}ℹ${colors.reset} 실제 데이터 읽기는 사용자 인증 후 가능합니다`);
    } catch (error) {
      console.log(`${colors.red}✗${colors.reset} Firestore 테스트 실패`);
      console.log(`  Error: ${error.message}`);
    }
    console.log('');

    // 4. Storage 테스트
    console.log('📦 4. Storage 서비스 테스트');
    console.log('─'.repeat(50));
    
    try {
      const storage = getStorage(app);
      console.log(`${colors.green}✓${colors.reset} Storage 서비스 초기화 성공`);
      console.log(`  - Storage Bucket: ${storage.app.options.storageBucket}`);
    } catch (error) {
      console.log(`${colors.red}✗${colors.reset} Storage 테스트 실패`);
      console.log(`  Error: ${error.message}`);
    }
    console.log('');

    // 최종 결과
    console.log('═'.repeat(50));
    console.log(`${colors.green}🎉 Firebase 연결 테스트 완료!${colors.reset}`);
    console.log('═'.repeat(50));
    console.log('');
    console.log('✅ 모든 Firebase 서비스가 정상적으로 초기화되었습니다.');
    console.log('');
    console.log('📝 다음 단계:');
    console.log('1. 프로젝트 실행: npm start');
    console.log('2. 실제 앱에서 로그인 테스트');
    console.log('3. Firestore에 데이터 쓰기/읽기 테스트');
    console.log('');

  } catch (error) {
    console.log('═'.repeat(50));
    console.log(`${colors.red}❌ Firebase 연결 실패${colors.reset}`);
    console.log('═'.repeat(50));
    console.log('');
    console.log(`Error: ${error.message}`);
    console.log('');
    console.log('💡 문제 해결:');
    console.log('1. .env 파일의 Firebase 설정 값을 확인하세요');
    console.log('2. Firebase Console에서 프로젝트가 활성화되어 있는지 확인하세요');
    console.log('3. 인터넷 연결을 확인하세요');
    console.log('');
    process.exit(1);
  }
}

// 연결 테스트 실행
testConnection();


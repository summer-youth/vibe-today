/**
 * Expo AuthSession 리디렉션 URI 확인 스크립트
 * 
 * 사용법: node scripts/check-redirect-uri.js
 */

const { makeRedirectUri } = require('expo-auth-session');

console.log('🔍 리디렉션 URI 확인\n');

// Expo 프록시 사용 시
const proxyUri = makeRedirectUri({
  useProxy: true,
});

// Expo 프록시 미사용 시
const directUri = makeRedirectUri({
  useProxy: false,
});

console.log('📱 Expo 프록시 사용 (useProxy: true):');
console.log(`   ${proxyUri}\n`);

console.log('📱 Expo 프록시 미사용 (useProxy: false):');
console.log(`   ${directUri}\n`);

console.log('📝 Google Cloud Console에 추가할 URI:');
console.log(`   1. ${proxyUri}`);
console.log(`   2. ${directUri}`);
console.log(`   3. exp://127.0.0.1:8081`);
console.log(`   4. http://localhost:8081`);
console.log(`   5. http://localhost:19000`);
console.log(`   6. http://localhost:19001`);
console.log(`   7. http://localhost:19002\n`);

console.log('✅ 위 URI들을 Google Cloud Console > API 및 서비스 > 사용자 인증 정보 >');
console.log('   OAuth 2.0 클라이언트 ID > 승인된 리디렉션 URI에 추가하세요.\n');


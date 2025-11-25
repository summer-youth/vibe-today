/**
 * Firebase 설정 검증 스크립트
 * 
 * 이 스크립트는 Firebase 설정이 올바른지 확인합니다.
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Firebase 설정 검증 시작...\n');

// 색상 코드
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

let errors = 0;
let warnings = 0;

// 1. 설정 파일 존재 확인
console.log('📁 1. 설정 파일 확인');
console.log('─'.repeat(50));

const files = [
  { path: '.env', required: true, name: '환경 변수 파일' },
  { path: 'GoogleService-Info.plist', required: false, name: 'iOS 설정 파일' },
  { path: 'google-services.json', required: false, name: 'Android 설정 파일' },
  { path: 'app.json', required: true, name: 'Expo 설정 파일' },
];

files.forEach(file => {
  const exists = fs.existsSync(path.join(__dirname, '..', file.path));
  if (exists) {
    console.log(`${colors.green}✓${colors.reset} ${file.name}: ${file.path}`);
  } else {
    if (file.required) {
      console.log(`${colors.red}✗${colors.reset} ${file.name}: ${file.path} (필수)`);
      errors++;
    } else {
      console.log(`${colors.yellow}⚠${colors.reset} ${file.name}: ${file.path} (선택)`);
      warnings++;
    }
  }
});

console.log('');

// 2. .env 파일 검증
console.log('🔐 2. 환경 변수 검증');
console.log('─'.repeat(50));

try {
  const envContent = fs.readFileSync(path.join(__dirname, '..', '.env'), 'utf8');
  const requiredVars = [
    'EXPO_PUBLIC_FIREBASE_API_KEY',
    'EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'EXPO_PUBLIC_FIREBASE_PROJECT_ID',
    'EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'EXPO_PUBLIC_FIREBASE_APP_ID',
  ];

  const optionalVars = [
    'EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID',
    'EXPO_PUBLIC_GEMINI_API_KEY',
  ];

  requiredVars.forEach(varName => {
    const regex = new RegExp(`${varName}=(.+)`);
    const match = envContent.match(regex);
    
    if (match && match[1] && match[1].trim() && !match[1].includes('여기에')) {
      console.log(`${colors.green}✓${colors.reset} ${varName}`);
    } else {
      console.log(`${colors.red}✗${colors.reset} ${varName} - 값이 설정되지 않음`);
      errors++;
    }
  });

  console.log('');
  console.log('선택 항목:');
  optionalVars.forEach(varName => {
    const regex = new RegExp(`${varName}=(.+)`);
    const match = envContent.match(regex);
    
    if (match && match[1] && match[1].trim() && !match[1].includes('여기에')) {
      console.log(`${colors.green}✓${colors.reset} ${varName}`);
    } else {
      console.log(`${colors.yellow}⚠${colors.reset} ${varName} - 미설정 (선택사항)`);
      warnings++;
    }
  });
} catch (error) {
  console.log(`${colors.red}✗${colors.reset} .env 파일을 읽을 수 없습니다`);
  errors++;
}

console.log('');

// 3. GoogleService-Info.plist 검증 (iOS)
console.log('📱 3. iOS 설정 검증');
console.log('─'.repeat(50));

try {
  const plistPath = path.join(__dirname, '..', 'GoogleService-Info.plist');
  if (fs.existsSync(plistPath)) {
    const plistContent = fs.readFileSync(plistPath, 'utf8');
    
    const checks = [
      { key: 'API_KEY', name: 'API Key' },
      { key: 'PROJECT_ID', name: 'Project ID' },
      { key: 'BUNDLE_ID', name: 'Bundle ID' },
      { key: 'GOOGLE_APP_ID', name: 'Google App ID' },
    ];

    checks.forEach(check => {
      if (plistContent.includes(`<key>${check.key}</key>`)) {
        console.log(`${colors.green}✓${colors.reset} ${check.name} 존재`);
      } else {
        console.log(`${colors.red}✗${colors.reset} ${check.name} 없음`);
        errors++;
      }
    });

    // Bundle ID 확인
    const bundleIdMatch = plistContent.match(/<key>BUNDLE_ID<\/key>\s*<string>(.+)<\/string>/);
    if (bundleIdMatch && bundleIdMatch[1] === 'com.vibecoding.vibetoday') {
      console.log(`${colors.green}✓${colors.reset} Bundle ID 일치: ${bundleIdMatch[1]}`);
    } else if (bundleIdMatch) {
      console.log(`${colors.yellow}⚠${colors.reset} Bundle ID: ${bundleIdMatch[1]} (확인 필요)`);
      warnings++;
    }
  } else {
    console.log(`${colors.yellow}⚠${colors.reset} GoogleService-Info.plist 없음 (iOS 빌드 시 필요)`);
    warnings++;
  }
} catch (error) {
  console.log(`${colors.red}✗${colors.reset} iOS 설정 파일 검증 실패`);
  errors++;
}

console.log('');

// 4. google-services.json 검증 (Android)
console.log('🤖 4. Android 설정 검증');
console.log('─'.repeat(50));

try {
  const jsonPath = path.join(__dirname, '..', 'google-services.json');
  if (fs.existsSync(jsonPath)) {
    const jsonContent = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    
    if (jsonContent.project_info) {
      console.log(`${colors.green}✓${colors.reset} Project Info 존재`);
      console.log(`  - Project ID: ${jsonContent.project_info.project_id}`);
      console.log(`  - Project Number: ${jsonContent.project_info.project_number}`);
    } else {
      console.log(`${colors.red}✗${colors.reset} Project Info 없음`);
      errors++;
    }

    if (jsonContent.client && jsonContent.client.length > 0) {
      console.log(`${colors.green}✓${colors.reset} Client 설정 존재`);
      const packageName = jsonContent.client[0]?.client_info?.android_client_info?.package_name;
      if (packageName === 'com.vibecoding.vibetoday') {
        console.log(`${colors.green}✓${colors.reset} Package Name 일치: ${packageName}`);
      } else {
        console.log(`${colors.yellow}⚠${colors.reset} Package Name: ${packageName} (확인 필요)`);
        warnings++;
      }
    } else {
      console.log(`${colors.red}✗${colors.reset} Client 설정 없음`);
      errors++;
    }
  } else {
    console.log(`${colors.yellow}⚠${colors.reset} google-services.json 없음 (Android 빌드 시 필요)`);
    warnings++;
  }
} catch (error) {
  console.log(`${colors.red}✗${colors.reset} Android 설정 파일 검증 실패`);
  errors++;
}

console.log('');

// 5. app.json 검증
console.log('⚙️  5. Expo 설정 검증');
console.log('─'.repeat(50));

try {
  const appJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'app.json'), 'utf8'));
  
  if (appJson.expo?.plugins?.includes('@react-native-firebase/app')) {
    console.log(`${colors.green}✓${colors.reset} Firebase 플러그인 설정됨`);
  } else {
    console.log(`${colors.red}✗${colors.reset} Firebase 플러그인 미설정`);
    errors++;
  }

  if (appJson.expo?.ios?.googleServicesFile) {
    console.log(`${colors.green}✓${colors.reset} iOS googleServicesFile: ${appJson.expo.ios.googleServicesFile}`);
  } else {
    console.log(`${colors.yellow}⚠${colors.reset} iOS googleServicesFile 미설정`);
    warnings++;
  }

  if (appJson.expo?.android?.googleServicesFile) {
    console.log(`${colors.green}✓${colors.reset} Android googleServicesFile: ${appJson.expo.android.googleServicesFile}`);
  } else {
    console.log(`${colors.yellow}⚠${colors.reset} Android googleServicesFile 미설정`);
    warnings++;
  }
} catch (error) {
  console.log(`${colors.red}✗${colors.reset} app.json 검증 실패`);
  errors++;
}

console.log('');

// 최종 결과
console.log('═'.repeat(50));
console.log('📊 검증 결과');
console.log('═'.repeat(50));

if (errors === 0 && warnings === 0) {
  console.log(`${colors.green}🎉 모든 검증 통과!${colors.reset}`);
  console.log('Firebase 설정이 올바르게 되어 있습니다.');
  process.exit(0);
} else {
  if (errors > 0) {
    console.log(`${colors.red}✗ 오류: ${errors}개${colors.reset}`);
  }
  if (warnings > 0) {
    console.log(`${colors.yellow}⚠ 경고: ${warnings}개${colors.reset}`);
  }
  
  console.log('');
  console.log('다음 단계:');
  if (errors > 0) {
    console.log('1. 위의 오류를 수정해주세요.');
  }
  if (warnings > 0) {
    console.log('2. 경고 항목을 확인해주세요 (선택사항).');
  }
  console.log('3. 수정 후 다시 검증: npm run verify-firebase');
  
  process.exit(errors > 0 ? 1 : 0);
}


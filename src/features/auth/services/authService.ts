/**
 * 인증 서비스
 * 
 * Firebase Authentication을 사용한 사용자 인증 로직
 */

import {
  signInWithCredential,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { Platform } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { auth, db } from '@services/firebase';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { User } from '@/types';

/**
 * Firebase User를 앱 User 타입으로 변환
 */
const mapFirebaseUser = (firebaseUser: FirebaseUser): User => ({
  uid: firebaseUser.uid,
  email: firebaseUser.email,
  displayName: firebaseUser.displayName,
  photoURL: firebaseUser.photoURL,
});

/**
 * Users 컬렉션에 유저 정보 저장 또는 업데이트
 */
const saveUserToFirestore = async (firebaseUser: FirebaseUser): Promise<void> => {
  try {
    const userRef = doc(db, 'users', firebaseUser.uid);
    const userDoc = await getDoc(userRef);

    const userData = {
      uid: firebaseUser.uid,
      email: firebaseUser.email || null,
      displayName: firebaseUser.displayName || null,
      photoURL: firebaseUser.photoURL || null,
      updatedAt: serverTimestamp(),
    };

    if (!userDoc.exists()) {
      // 새 유저인 경우
      await setDoc(userRef, {
        ...userData,
        createdAt: serverTimestamp(),
      });
      console.log('✅ New user saved to Firestore');
    } else {
      // 기존 유저인 경우 업데이트
      await setDoc(userRef, userData, { merge: true });
      console.log('✅ User updated in Firestore');
    }
  } catch (error) {
    console.error('Error saving user to Firestore:', error);
    // Firestore 저장 실패해도 로그인은 계속 진행
  }
};

let isGoogleConfigured = false;

const configureGoogleSignIn = () => {
  if (isGoogleConfigured) {
    return;
  }

  const googleWebClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
  const iosClientId = process.env.EXPO_PUBLIC_IOS_GOOGLE_CLIENT_ID;

  if (!googleWebClientId) {
    throw new Error('Google Web Client ID is not configured. Please set EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID in .env file');
  }

  GoogleSignin.configure({
    webClientId: googleWebClientId,
    iosClientId: iosClientId || undefined,
    offlineAccess: true,
    forceCodeForRefreshToken: false,
  });

  isGoogleConfigured = true;
};

/**
 * Google 로그인
 */
export const signInWithGoogle = async (): Promise<User> => {
  try {
    // 웹 플랫폼인 경우
    if (Platform.OS === 'web') {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Users 컬렉션에 저장
      await saveUserToFirestore(result.user);
      
      return mapFirebaseUser(result.user);
    }

    // 네이티브(iOS/Android) 환경
    configureGoogleSignIn();

    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const signInResult = await GoogleSignin.signIn();

    if (!signInResult.idToken) {
      throw new Error('Google ID token not found');
    }

    const credential = GoogleAuthProvider.credential(signInResult.idToken);
    const firebaseUserCredential = await signInWithCredential(auth, credential);

    // Users 컬렉션에 저장
    await saveUserToFirestore(firebaseUserCredential.user);

    return mapFirebaseUser(firebaseUserCredential.user);
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

/**
 * 로그아웃
 */
export const signOut = async (): Promise<void> => {
  try {
    if (Platform.OS !== 'web') {
      try {
        await GoogleSignin.signOut();
      } catch (googleError) {
        console.warn('Google Sign-Out warning:', googleError);
      }
    }
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

/**
 * 인증 상태 변경 리스너
 */
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      // Firestore에 유저 정보가 있는지 확인하고 없으면 저장
      try {
        const userRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userRef);
        
        if (!userDoc.exists()) {
          await saveUserToFirestore(firebaseUser);
        }
      } catch (error) {
        console.error('Error checking user in Firestore:', error);
      }
      
      callback(mapFirebaseUser(firebaseUser));
    } else {
      callback(null);
    }
  });
};

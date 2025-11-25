import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { onAuthStateChange, signOut as authSignOut } from '../services/authService';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@services/firebase';

/**
 * 인증 관련 커스텀 훅
 */
export const useAuth = () => {
  const { user, nickname, isLoading, isAuthenticated, setUser, setNickname, setLoading } = useAuthStore();

  useEffect(() => {
    // 인증 상태 변경 리스너 등록
    const unsubscribe = onAuthStateChange(async (user) => {
      setUser(user);
      
      // 로그인된 경우 Firestore에서 닉네임 정보 가져오기
      if (user) {
        try {
          const userRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userRef);
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setNickname(userData.nickname || null);
          } else {
            setNickname(null);
          }
        } catch (error) {
          console.error('Error fetching user nickname:', error);
          setNickname(null);
        }
      } else {
        setNickname(null);
      }
    });

    return () => unsubscribe();
  }, [setUser, setNickname]);

  const signOut = async () => {
    try {
      await authSignOut();
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  return {
    user,
    nickname,
    isLoading,
    isAuthenticated,
    signOut,
  };
};


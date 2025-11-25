import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing } from '@constants/theme';
import { signInWithGoogle } from '@features/auth/services/authService';
import { useAuth } from '@features/auth/hooks/useAuth';

export const LoginScreen: React.FC = () => {
  const navigation = useNavigation();
  const { isAuthenticated, nickname } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // 로그인 성공 후 닉네임 상태에 따라 화면 전환
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      if (!nickname) {
        // 닉네임이 없으면 온보딩 화면으로
        navigation.navigate('Onboarding' as never);
      } else {
        // 닉네임이 있으면 홈 화면으로
        navigation.navigate('Main' as never);
      }
    }
  }, [isAuthenticated, nickname, isLoading, navigation]);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      await signInWithGoogle();
      // 로그인 성공 시 authStore가 자동으로 업데이트되고
      // useEffect에서 화면 전환이 처리됩니다
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);
      Alert.alert(
        '로그인 실패',
        error.message || 'Google 로그인 중 오류가 발생했습니다. 다시 시도해주세요.',
        [{ text: '확인' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* 상단 영역 */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoEmoji}>✨</Text>
          </View>
          <Text style={styles.title}>바이브투데이</Text>
          <Text style={styles.subtitle}>
            당신의 하루를{'\n'}
            특별한 그림 일기로
          </Text>
        </View>

        {/* 중앙 일러스트 */}
        <View style={styles.illustration}>
          <View style={styles.illustrationCircle1} />
          <View style={styles.illustrationCircle2} />
          <View style={styles.illustrationCircle3} />
          <Text style={styles.illustrationEmoji}>🎨</Text>
        </View>

        {/* 하단 버튼 */}
        <View style={styles.footer}>
          <TouchableOpacity 
            style={[styles.googleButton, isLoading && styles.googleButtonDisabled]}
            onPress={handleGoogleSignIn}
            activeOpacity={0.8}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <ActivityIndicator size="small" color={colors.primary.main} style={{ marginRight: 12 }} />
                <Text style={styles.googleButtonText}>로그인 중...</Text>
              </>
            ) : (
              <>
                <Text style={styles.googleIcon}>G</Text>
                <Text style={styles.googleButtonText}>Google로 시작하기</Text>
              </>
            )}
          </TouchableOpacity>
          
          <Text style={styles.termsText}>
            시작하기를 누르면 서비스 약관에 동의하게 됩니다
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFBFF',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    padding: spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginTop: spacing.xxl * 2,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    shadowColor: colors.primary.main,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  logoEmoji: {
    fontSize: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.primary.main,
    marginBottom: spacing.md,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 20,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 32,
    fontWeight: '500',
  },
  illustration: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  illustrationCircle1: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: colors.primary.light,
    opacity: 0.15,
  },
  illustrationCircle2: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: colors.secondary.light,
    opacity: 0.2,
  },
  illustrationCircle3: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primary.main,
    opacity: 0.1,
  },
  illustrationEmoji: {
    fontSize: 80,
  },
  footer: {
    marginBottom: spacing.xl,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  googleIcon: {
    fontSize: 24,
    fontWeight: '700',
    marginRight: 12,
    color: colors.primary.main,
  },
  googleButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  googleButtonDisabled: {
    opacity: 0.6,
  },
  termsText: {
    fontSize: 12,
    color: colors.text.disabled,
    textAlign: 'center',
    marginTop: spacing.md,
  },
});


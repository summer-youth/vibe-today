import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing } from '@constants/theme';
import { useAuth } from '@features/auth/hooks/useAuth';

export const SplashScreen: React.FC = () => {
  const navigation = useNavigation();
  const { isAuthenticated, isLoading, nickname } = useAuth();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const dot1Anim = useRef(new Animated.Value(0)).current;
  const dot2Anim = useRef(new Animated.Value(0)).current;
  const dot3Anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 페이드인 애니메이션
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // 로딩 도트 애니메이션
    const createDotAnimation = (anim: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      );
    };

    Animated.parallel([
      createDotAnimation(dot1Anim, 0),
      createDotAnimation(dot2Anim, 200),
      createDotAnimation(dot3Anim, 400),
    ]).start();
  }, []);

  useEffect(() => {
    // 로딩이 완료되면 로그인 상태에 따라 화면 전환
    if (!isLoading) {
      const timer = setTimeout(() => {
        if (isAuthenticated) {
          // 닉네임이 없으면 온보딩 화면으로, 있으면 홈 화면으로
          if (!nickname) {
            navigation.navigate('Onboarding' as never);
          } else {
            navigation.navigate('Main' as never);
          }
        } else {
          navigation.navigate('Login' as never);
        }
      }, 1500); // 스플래시 화면을 최소 1.5초간 표시

      return () => clearTimeout(timer);
    }
  }, [isLoading, isAuthenticated, nickname, navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.logoCircle}>
            <Text style={styles.logoEmoji}>✨</Text>
          </View>
          <Text style={styles.title}>바이브투데이</Text>
          <Text style={styles.subtitle}>
            당신의 하루를 특별한 그림으로
          </Text>
        </Animated.View>

        <View style={styles.loadingContainer}>
          <Animated.View
            style={[
              styles.loadingDot,
              {
                opacity: dot1Anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.3, 1],
                }),
                transform: [
                  {
                    scale: dot1Anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.2],
                    }),
                  },
                ],
              },
            ]}
          />
          <Animated.View
            style={[
              styles.loadingDot,
              {
                opacity: dot2Anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.3, 1],
                }),
                transform: [
                  {
                    scale: dot2Anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.2],
                    }),
                  },
                ],
              },
            ]}
          />
          <Animated.View
            style={[
              styles.loadingDot,
              {
                opacity: dot3Anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.3, 1],
                }),
                transform: [
                  {
                    scale: dot3Anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.2],
                    }),
                  },
                ],
              },
            ]}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary.main,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  logoEmoji: {
    fontSize: 64,
  },
  title: {
    fontSize: 42,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: spacing.sm,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontWeight: '500',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xxl,
  },
  loadingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    marginHorizontal: 6,
  },
});


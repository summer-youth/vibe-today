import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing } from '@constants/theme';
import { useAuth } from '@features/auth/hooks/useAuth';
import { useAuthStore } from '@features/auth/store/authStore';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@services/firebase';

export const OnboardingScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [nickname, setNickname] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleComplete = async () => {
    if (!nickname.trim()) {
      Alert.alert('닉네임을 입력해주세요', '2자 이상의 닉네임을 입력해주세요.');
      return;
    }

    if (nickname.trim().length < 2) {
      Alert.alert('닉네임이 너무 짧아요', '2자 이상의 닉네임을 입력해주세요.');
      return;
    }

    if (nickname.trim().length > 20) {
      Alert.alert('닉네임이 너무 길어요', '20자 이하의 닉네임을 입력해주세요.');
      return;
    }

    if (!user) {
      Alert.alert('오류', '로그인 정보를 찾을 수 없습니다.');
      return;
    }

    try {
      setIsSaving(true);

      // Firestore Users 컬렉션에 닉네임 저장
      const userRef = doc(db, 'users', user.uid);
      await setDoc(
        userRef,
        {
          nickname: nickname.trim(),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      // authStore에 닉네임 업데이트
      useAuthStore.getState().setNickname(nickname.trim());

      // 홈 화면으로 이동
      navigation.navigate('Main' as never);
    } catch (error: any) {
      console.error('Error saving nickname:', error);
      Alert.alert('오류', '닉네임 저장 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          {/* 헤더 */}
          <View style={styles.header}>
            <Text style={styles.emoji}>👋</Text>
            <Text style={styles.title}>반가워요!</Text>
            <Text style={styles.subtitle}>
              바이브투데이에서 사용할{'\n'}
              닉네임을 입력해주세요
            </Text>
          </View>

          {/* 닉네임 입력 */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>닉네임</Text>
            <TextInput
              style={styles.input}
              placeholder="예) 바이버, 일기작성자, 오늘의나 등"
              placeholderTextColor="#9CA3AF"
              value={nickname}
              onChangeText={setNickname}
              maxLength={20}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={handleComplete}
            />
            <View style={styles.inputFooter}>
              <Text style={styles.charCount}>{nickname.length}/20</Text>
            </View>
            <Text style={styles.inputHint}>
              💡 나중에 프로필에서 변경할 수 있어요
            </Text>
          </View>

          {/* 완료 버튼 */}
          <TouchableOpacity
            style={[
              styles.completeButton,
              (isSaving || nickname.trim().length < 2) && styles.completeButtonDisabled,
            ]}
            onPress={handleComplete}
            disabled={isSaving || nickname.trim().length < 2}
          >
            {isSaving ? (
              <Text style={styles.completeButtonText}>저장 중...</Text>
            ) : (
              <Text style={styles.completeButtonText}>시작하기 ✨</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFBFF',
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  emoji: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.text.primary,
    marginBottom: spacing.md,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 18,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 28,
    fontWeight: '500',
  },
  inputContainer: {
    marginBottom: spacing.xl,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: spacing.md,
    fontSize: 18,
    color: colors.text.primary,
    borderWidth: 2,
    borderColor: colors.divider,
    marginBottom: spacing.xs,
  },
  inputFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: spacing.sm,
  },
  charCount: {
    fontSize: 13,
    color: colors.text.disabled,
  },
  inputHint: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  completeButton: {
    backgroundColor: colors.primary.main,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: colors.primary.main,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  completeButtonDisabled: {
    backgroundColor: '#D1D5DB',
    shadowOpacity: 0,
  },
  completeButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});


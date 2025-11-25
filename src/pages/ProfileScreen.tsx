import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '@constants/theme';
import { useAuth } from '@features/auth/hooks/useAuth';
import { signOut } from '@features/auth/services/authService';

export const ProfileScreen: React.FC = () => {
  const { user } = useAuth();

  const handleSignOut = async () => {
    Alert.alert(
      '로그아웃',
      '정말 로그아웃 하시겠어요?',
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '로그아웃',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              // authStore가 자동으로 업데이트되고 로그인 화면으로 이동합니다
            } catch (error) {
              console.error('Sign out error:', error);
              Alert.alert('오류', '로그아웃 중 오류가 발생했습니다.');
            }
          },
        },
      ]
    );
  };

  if (!user) {
    return null; // 로그인되지 않은 경우 (이론적으로는 발생하지 않음)
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={styles.title}>프로필</Text>
        </View>

        {/* 프로필 카드 */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            {user.photoURL ? (
              <Image
                source={{ uri: user.photoURL }}
                style={styles.avatarImage}
              />
            ) : (
              <Text style={styles.avatarEmoji}>
                {user.displayName?.charAt(0)?.toUpperCase() || '👤'}
              </Text>
            )}
          </View>
          <Text style={styles.displayName}>
            {user.displayName || '사용자'}
          </Text>
          <Text style={styles.email}>{user.email || '이메일 없음'}</Text>
        </View>

        {/* 통계 카드 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>내 활동</Text>
          <View style={styles.statsCard}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>총 바이브</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>연속 기록</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>이번 달</Text>
            </View>
          </View>
        </View>

        {/* 설정 메뉴 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>설정</Text>
          <View style={styles.menuCard}>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuEmoji}>🔔</Text>
              <Text style={styles.menuText}>알림 설정</Text>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
            <View style={styles.menuDivider} />
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuEmoji}>📤</Text>
              <Text style={styles.menuText}>데이터 내보내기</Text>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
            <View style={styles.menuDivider} />
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuEmoji}>ℹ️</Text>
              <Text style={styles.menuText}>앱 정보</Text>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 로그아웃 버튼 */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
          <Text style={styles.logoutButtonText}>로그아웃</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>바이브투데이 v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFBFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  header: {
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text.primary,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary.light,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarEmoji: {
    fontSize: 40,
  },
  displayName: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  email: {
    fontSize: 15,
    color: colors.text.secondary,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.primary.main,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: 13,
    color: colors.text.secondary,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.divider,
  },
  menuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  menuEmoji: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: colors.text.primary,
  },
  menuArrow: {
    fontSize: 24,
    color: colors.text.disabled,
  },
  menuDivider: {
    height: 1,
    backgroundColor: colors.divider,
    marginLeft: spacing.md * 4,
  },
  logoutButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: spacing.md,
    alignItems: 'center',
    marginTop: spacing.lg,
    borderWidth: 1,
    borderColor: colors.error,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.error,
  },
  footer: {
    alignItems: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
  },
  footerText: {
    fontSize: 13,
    color: colors.text.disabled,
  },
});

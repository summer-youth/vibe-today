import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, spacing } from '@constants/theme';
import { getKeywordForDate } from '@constants/keywords';

const LAST_ENTRY_KEY = '@vibe_today_last_entry';

export const HomeScreen: React.FC = () => {
  const [keyword, setKeyword] = useState('');
  const [text, setText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [lastEntry, setLastEntry] = useState<{ text: string; date: string } | null>(null);
  const [isLastEntryExpanded, setIsLastEntryExpanded] = useState(false);

  useEffect(() => {
    // 오늘의 키워드 설정
    const todayKeyword = getKeywordForDate(new Date());
    setKeyword(todayKeyword);
    
    // 직전 작성 내용 불러오기
    loadLastEntry();
  }, []);

  const loadLastEntry = async () => {
    try {
      const saved = await AsyncStorage.getItem(LAST_ENTRY_KEY);
      if (saved) {
        const entry = JSON.parse(saved);
        setLastEntry(entry);
      }
    } catch (error) {
      console.error('Error loading last entry:', error);
    }
  };

  const saveLastEntry = async (entryText: string) => {
    try {
      const entry = {
        text: entryText,
        date: new Date().toISOString(),
      };
      await AsyncStorage.setItem(LAST_ENTRY_KEY, JSON.stringify(entry));
      setLastEntry(entry);
    } catch (error) {
      console.error('Error saving last entry:', error);
    }
  };

  const handleGenerateVibe = async () => {
    if (text.trim().length < 10) {
      Alert.alert('알림', '최소 10자 이상 입력해주세요.');
      return;
    }

    setIsGenerating(true);

    // 직전 작성 내용 저장
    await saveLastEntry(text);

    // 임시: 2초 후 랜덤 이미지 표시
    setTimeout(() => {
      const randomSeed = Date.now();
      setGeneratedImage(`https://picsum.photos/seed/${randomSeed}/800/600`);
      setIsGenerating(false);
    }, 2000);
  };

  const handleReset = () => {
    setText('');
    setGeneratedImage(null);
  };

  const formatDate = (date: Date) => {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayName = days[date.getDay()];
    return `${month}월 ${day}일 (${dayName})`;
  };

  const formatLastEntryDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return '오늘';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return '어제';
    } else {
      return formatDate(date);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* 헤더 */}
          <View style={styles.header}>
            <Text style={styles.date}>{formatDate(new Date())}</Text>
          </View>

          {/* 직전 작성 내용 카드 */}
          {lastEntry && !generatedImage && (
            <View style={styles.lastEntryCard}>
              <View style={styles.lastEntryHeader}>
                <View>
                  <Text style={styles.lastEntryTitle}>어제의 나</Text>
                  <Text style={styles.lastEntryDate}>
                    {formatLastEntryDate(lastEntry.date)}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.lastEntryToggle}
                  onPress={() => setIsLastEntryExpanded((prev) => !prev)}
                >
                  <Text style={styles.lastEntryToggleText}>
                    {isLastEntryExpanded ? '접기' : '펼치기'}
                  </Text>
                </TouchableOpacity>
              </View>
              {isLastEntryExpanded ? (
                <>
                  <Text style={styles.lastEntryText}>
                    {lastEntry.text}
                  </Text>
                  <Text style={styles.lastEntryMotivation}>
                    오늘도 멋진 하루를 만들어보세요! ✨
                  </Text>
                </>
              ) : (
                <Text style={styles.lastEntryCollapsedText}>
                  어제를 잘 보냈으니 오늘도 멋진 하루를 만들어봐요! 💪
                </Text>
              )}
            </View>
          )}

          {/* 오늘의 키워드 카드 */}
          <View style={styles.keywordCard}>
            <View style={styles.keywordBadge}>
              <Text style={styles.keywordBadgeText}>오늘의 키워드</Text>
            </View>
            <Text style={styles.keyword}>{keyword}</Text>
          </View>

          {/* AI 이미지 생성 결과 */}
          {generatedImage && (
            <View style={styles.resultCard}>
              <Text style={styles.resultTitle}>✨ 당신의 바이브</Text>
              <Image
                source={{ uri: generatedImage }}
                style={styles.generatedImage}
                resizeMode="cover"
              />
              <TouchableOpacity
                style={styles.resetButton}
                onPress={handleReset}
              >
                <Text style={styles.resetButtonText}>새로 작성하기</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* 일기 작성 영역 */}
          {!generatedImage && (
            <View style={styles.diaryCard}>
              <Text style={styles.diaryTitle}>오늘 하루는 어땠나요?</Text>
              <Text style={styles.diarySubtitle}>
                당신의 생각과 느낌을 자유롭게 적어보세요
              </Text>

              <TextInput
                style={styles.textInput}
                placeholder="예) 오늘은 새로운 도전을 시작했어. 떨리지만 설레는 하루였다..."
                placeholderTextColor="#9CA3AF"
                multiline
                value={text}
                onChangeText={setText}
                maxLength={500}
                textAlignVertical="top"
              />

              <View style={styles.inputFooter}>
                <Text style={styles.charCount}>{text.length}/500</Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.generateButton,
                  (isGenerating || text.length < 10) && styles.generateButtonDisabled,
                  { width: '100%', marginTop: spacing.lg },
                ]}
                onPress={handleGenerateVibe}
                disabled={isGenerating || text.length < 10}
              >
                {isGenerating ? (
                  <Text style={styles.generateButtonText}>✨ 그림일기 만드는 중...</Text>
                ) : (
                  <Text style={styles.generateButtonText}>🎨 그림일기 만들기</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  header: {
    marginBottom: spacing.xl,
  },
  date: {
    fontSize: 18,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  lastEntryCard: {
    backgroundColor: '#FFF4E6',
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary.main,
  },
  lastEntryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  lastEntryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
  },
  lastEntryDate: {
    fontSize: 13,
    color: colors.text.secondary,
  },
  lastEntryText: {
    fontSize: 15,
    color: colors.text.primary,
    lineHeight: 22,
    marginBottom: spacing.xs,
  },
  lastEntryCollapsedText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  lastEntryToggle: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FFE0B2',
  },
  lastEntryToggleText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary.main,
  },
  lastEntryMotivation: {
    fontSize: 14,
    color: colors.primary.main,
    fontWeight: '600',
  },
  keywordCard: {
    backgroundColor: colors.primary.main,
    borderRadius: 20,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.lg,
    alignItems: 'center',
    shadowColor: colors.primary.main,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  keywordBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: spacing.md,
  },
  keywordBadgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  keyword: {
    fontSize: 48,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: spacing.sm,
  },
  resultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  resultTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  generatedImage: {
    width: '100%',
    height: 300,
    borderRadius: 16,
    marginBottom: spacing.md,
  },
  resetButton: {
    backgroundColor: colors.background.paper,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary.main,
  },
  diaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  diaryTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  diarySubtitle: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: spacing.lg,
  },
  textInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: spacing.md,
    fontSize: 16,
    color: colors.text.primary,
    minHeight: 200,
    textAlignVertical: 'top',
    lineHeight: 24,
  },
  inputFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: spacing.sm,
  },
  charCount: {
    fontSize: 13,
    color: colors.text.disabled,
  },
  generateButton: {
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
  generateButtonDisabled: {
    backgroundColor: '#D1D5DB',
    shadowOpacity: 0,
  },
  generateButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

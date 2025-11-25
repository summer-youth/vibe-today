import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  Modal,
  ScrollView,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '@constants/theme';

const { width, height } = Dimensions.get('window');
const ITEM_SIZE = (width - spacing.lg * 3) / 2;

// 임시 데이터
const MOCK_VIBES = [
  {
    id: '1',
    imageUrl: 'https://picsum.photos/seed/1/400/400',
    keyword: '#설렘',
    date: '2024-03-15',
    text: '오늘은 새로운 시작을 했다. 떨리지만 설레는 하루였다. 새로운 사람들을 만나고, 새로운 경험을 하면서 내가 조금씩 성장하고 있다는 걸 느꼈다.',
  },
  {
    id: '2',
    imageUrl: 'https://picsum.photos/seed/2/400/400',
    keyword: '#도전',
    date: '2024-03-14',
    text: '어려운 일에 도전했다. 처음에는 두려웠지만, 한 걸음씩 나아가니 할 수 있다는 자신감이 생겼다. 실패를 두려워하지 말고 계속 도전해야겠다.',
  },
  {
    id: '3',
    imageUrl: 'https://picsum.photos/seed/3/400/400',
    keyword: '#평온',
    date: '2024-03-13',
    text: '마음이 편안한 하루였다. 바쁜 일상 속에서도 잠시 멈춰서 내 마음을 돌아볼 수 있는 시간이었다. 이런 평온한 순간들이 소중하다.',
  },
  {
    id: '4',
    imageUrl: 'https://picsum.photos/seed/4/400/400',
    keyword: '#감사',
    date: '2024-03-12',
    text: '감사한 일들이 많았다. 주변 사람들의 따뜻함과 작은 도움들이 내 하루를 빛나게 했다. 나도 누군가에게 따뜻한 사람이 되고 싶다.',
  },
  {
    id: '5',
    imageUrl: 'https://picsum.photos/seed/5/400/400',
    keyword: '#성장',
    date: '2024-03-11',
    text: '한 걸음 성장한 날이었다. 어제보다 나은 오늘, 오늘보다 나은 내일을 위해 노력하고 있다. 작은 변화도 소중하다.',
  },
  {
    id: '6',
    imageUrl: 'https://picsum.photos/seed/6/400/400',
    keyword: '#행복',
    date: '2024-03-10',
    text: '행복한 순간들이 가득했던 하루였다. 사소한 것들에서도 기쁨을 찾을 수 있다는 걸 깨달았다. 매일이 특별한 하루다.',
  },
];

type Vibe = typeof MOCK_VIBES[0];

export const GalleryScreen: React.FC = () => {
  const [vibes, setVibes] = useState(MOCK_VIBES);
  const [selectedVibe, setSelectedVibe] = useState<Vibe | null>(null);
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const slideAnim = useState(new Animated.Value(height))[0];

  useEffect(() => {
    // TODO: 실제 Vibe 데이터 로드
    loadVibes();
  }, []);

  const loadVibes = async () => {
    try {
      console.log('Loading vibes...');
    } catch (error) {
      console.error('Error loading vibes:', error);
    }
  };

  const handleVibePress = (vibe: Vibe) => {
    setSelectedVibe(vibe);
    setIsBottomSheetVisible(true);
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 65,
      friction: 11,
    }).start();
  };

  const handleCloseBottomSheet = () => {
    Animated.timing(slideAnim, {
      toValue: height,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setIsBottomSheetVisible(false);
      setSelectedVibe(null);
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const renderVibeItem = ({ item }: { item: Vibe }) => (
    <TouchableOpacity
      style={styles.vibeItem}
      onPress={() => handleVibePress(item)}
      activeOpacity={0.9}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.vibeImage} />
      <View style={styles.vibeOverlay}>
        <Text style={styles.vibeKeyword}>{item.keyword}</Text>
        <Text style={styles.vibeDate} numberOfLines={1}>
          {new Date(item.date).toLocaleDateString('ko-KR', {
            month: 'short',
            day: 'numeric',
          })}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyEmoji}>📝</Text>
      <Text style={styles.emptyTitle}>아직 바이브가 없어요</Text>
      <Text style={styles.emptySubtitle}>
        첫 번째 바이브를 만들어보세요!
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>나의 바이브</Text>
          <Text style={styles.subtitle}>
            {vibes.length}개의 추억이 담겨있어요
          </Text>
        </View>
      </View>

      {/* Grid 리스트 */}
      {vibes.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={vibes}
          renderItem={renderVibeItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* 바텀시트 */}
      <Modal
        visible={isBottomSheetVisible}
        transparent
        animationType="none"
        onRequestClose={handleCloseBottomSheet}
      >
        <TouchableOpacity
          style={styles.bottomSheetOverlay}
          activeOpacity={1}
          onPress={handleCloseBottomSheet}
        >
          <Animated.View
            style={[
              styles.bottomSheet,
              {
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <TouchableOpacity
              activeOpacity={1}
              onPress={(e) => e.stopPropagation()}
            >
              {/* 핸들 */}
              <View style={styles.bottomSheetHandle} />

              {selectedVibe && (
                <ScrollView
                  style={styles.bottomSheetContent}
                  showsVerticalScrollIndicator={false}
                >
                  {/* 이미지 */}
                  <Image
                    source={{ uri: selectedVibe.imageUrl }}
                    style={styles.bottomSheetImage}
                    resizeMode="cover"
                  />

                  {/* 키워드 */}
                  <View style={styles.bottomSheetKeyword}>
                    <Text style={styles.bottomSheetKeywordText}>
                      {selectedVibe.keyword}
                    </Text>
                  </View>

                  {/* 날짜 */}
                  <Text style={styles.bottomSheetDate}>
                    {formatDate(selectedVibe.date)}
                  </Text>

                  {/* 텍스트 */}
                  <View style={styles.bottomSheetTextContainer}>
                    <Text style={styles.bottomSheetText}>
                      {selectedVibe.text}
                    </Text>
                  </View>
                </ScrollView>
              )}
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFBFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    paddingBottom: spacing.md,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 15,
    color: colors.text.secondary,
  },
  listContent: {
    padding: spacing.lg,
    paddingTop: spacing.md,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  vibeItem: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  vibeImage: {
    width: '100%',
    height: '100%',
  },
  vibeOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.sm,
    paddingTop: spacing.lg,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  vibeKeyword: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  vibeDate: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  emptySubtitle: {
    fontSize: 15,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  // 바텀시트 스타일
  bottomSheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: height * 0.85,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 16,
  },
  bottomSheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#D1D5DB',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  bottomSheetContent: {
    padding: spacing.lg,
  },
  bottomSheetImage: {
    width: '100%',
    height: 300,
    borderRadius: 16,
    marginBottom: spacing.lg,
  },
  bottomSheetKeyword: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary.main,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: spacing.md,
  },
  bottomSheetKeywordText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  bottomSheetDate: {
    fontSize: 16,
    color: colors.text.secondary,
    marginBottom: spacing.lg,
    fontWeight: '500',
  },
  bottomSheetTextContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.xl,
  },
  bottomSheetText: {
    fontSize: 16,
    color: colors.text.primary,
    lineHeight: 24,
  },
});

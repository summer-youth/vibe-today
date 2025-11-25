import { useState } from 'react';
import { useVibeStore } from '../store/vibeStore';
import { createVibe, getVibes, getTodayVibe } from '../services/vibeService';
import { generateVibeImage } from '@services/gemini';
import { CreateVibeData } from '@/types';

/**
 * Vibe 관련 커스텀 훅
 */
export const useVibe = () => {
  const {
    vibes,
    currentVibe,
    isLoading,
    error,
    setVibes,
    setCurrentVibe,
    addVibe,
    setLoading,
    setError,
  } = useVibeStore();

  const [isGenerating, setIsGenerating] = useState(false);

  /**
   * Vibe 생성
   */
  const createNewVibe = async (
    userId: string,
    data: Omit<CreateVibeData, 'imageUrl'>
  ) => {
    try {
      setIsGenerating(true);
      setError(null);

      // 1. AI 이미지 생성
      const imageUrl = await generateVibeImage({
        keyword: data.keyword,
        text: data.text,
      });

      // 2. Firestore에 저장
      const vibeId = await createVibe(userId, {
        ...data,
        imageUrl,
      });

      // 3. 스토어 업데이트
      const newVibe = {
        id: vibeId,
        userId,
        keyword: data.keyword,
        text: data.text,
        imageUrl,
        createdAt: { seconds: Date.now() / 1000, nanoseconds: 0 } as any,
      };

      addVibe(newVibe);
      return newVibe;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create vibe';
      setError(errorMessage);
      throw err;
    } finally {
      setIsGenerating(false);
    }
  };

  /**
   * Vibe 목록 불러오기
   */
  const loadVibes = async (userId: string) => {
    try {
      setLoading(true);
      setError(null);

      const loadedVibes = await getVibes({ userId });
      setVibes(loadedVibes);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load vibes';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * 오늘의 Vibe 불러오기
   */
  const loadTodayVibe = async (userId: string) => {
    try {
      setLoading(true);
      setError(null);

      const todayVibe = await getTodayVibe(userId);
      setCurrentVibe(todayVibe);
      return todayVibe;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load today vibe';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    vibes,
    currentVibe,
    isLoading,
    isGenerating,
    error,
    createNewVibe,
    loadVibes,
    loadTodayVibe,
  };
};


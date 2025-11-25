/**
 * Vibe 서비스
 * 
 * Firestore를 사용한 Vibe 데이터 CRUD 작업
 */

import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@services/firebase';
import { Vibe, CreateVibeData, VibeFilter } from '@/types';

const COLLECTION_NAME = 'vibes';

/**
 * Vibe 생성
 */
export const createVibe = async (
  userId: string,
  data: CreateVibeData
): Promise<string> => {
  try {
    const vibeData = {
      userId,
      keyword: data.keyword,
      text: data.text,
      imageUrl: data.imageUrl,
      createdAt: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, COLLECTION_NAME), vibeData);
    return docRef.id;
  } catch (error) {
    console.error('Error creating vibe:', error);
    throw error;
  }
};

/**
 * Vibe 목록 조회
 */
export const getVibes = async (filter: VibeFilter): Promise<Vibe[]> => {
  try {
    const { userId, startDate, endDate, limit: limitCount = 50 } = filter;

    let q = query(
      collection(db, COLLECTION_NAME),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    // TODO: 날짜 필터 추가 (startDate, endDate)

    const querySnapshot = await getDocs(q);
    const vibes: Vibe[] = [];

    querySnapshot.forEach((doc) => {
      vibes.push({
        id: doc.id,
        ...doc.data(),
      } as Vibe);
    });

    return vibes;
  } catch (error) {
    console.error('Error getting vibes:', error);
    throw error;
  }
};

/**
 * 오늘의 Vibe 조회
 */
export const getTodayVibe = async (userId: string): Promise<Vibe | null> => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTimestamp = Timestamp.fromDate(today);

    const q = query(
      collection(db, COLLECTION_NAME),
      where('userId', '==', userId),
      where('createdAt', '>=', todayTimestamp),
      orderBy('createdAt', 'desc'),
      limit(1)
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const doc = querySnapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data(),
    } as Vibe;
  } catch (error) {
    console.error('Error getting today vibe:', error);
    throw error;
  }
};


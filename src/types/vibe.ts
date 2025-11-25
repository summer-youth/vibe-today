import { Timestamp } from 'firebase/firestore';
import { Keyword } from '@constants/keywords';

/**
 * Vibe 엔트리 타입 정의
 */
export interface Vibe {
  id: string;
  userId: string;
  keyword: Keyword;
  text: string;
  imageUrl: string;
  createdAt: Timestamp;
}

/**
 * Vibe 생성 시 필요한 데이터
 */
export interface CreateVibeData {
  keyword: Keyword;
  text: string;
  imageUrl: string;
}

/**
 * Vibe 목록 조회 필터
 */
export interface VibeFilter {
  userId: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
}


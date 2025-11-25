import { format, isToday, isYesterday, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';

/**
 * 날짜를 한국어 형식으로 포맷팅
 */
export const formatDate = (date: Date | string, formatString: string = 'yyyy년 MM월 dd일'): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatString, { locale: ko });
};

/**
 * 상대적인 날짜 표시 (오늘, 어제, 날짜)
 */
export const getRelativeDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  
  if (isToday(dateObj)) {
    return '오늘';
  }
  
  if (isYesterday(dateObj)) {
    return '어제';
  }
  
  return formatDate(dateObj, 'M월 d일');
};

/**
 * 타임스탬프를 Date 객체로 변환
 */
export const timestampToDate = (timestamp: { seconds: number; nanoseconds: number }): Date => {
  return new Date(timestamp.seconds * 1000);
};

/**
 * 오늘 날짜의 시작 시간 (00:00:00)
 */
export const getStartOfToday = (): Date => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

/**
 * 오늘 날짜의 끝 시간 (23:59:59)
 */
export const getEndOfToday = (): Date => {
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return today;
};


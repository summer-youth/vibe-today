/**
 * 바이브투데이 키워드 목록
 * 매일 랜덤하게 하나의 키워드가 사용자에게 제시됩니다.
 */

export const KEYWORDS = [
  '#설렘',
  '#도전',
  '#평온',
  '#감사',
  '#성장',
  '#행복',
  '#위로',
  '#희망',
  '#용기',
  '#사랑',
  '#자유',
  '#열정',
  '#휴식',
  '#즐거움',
  '#성취',
  '#반성',
  '#기대',
  '#만족',
  '#여유',
  '#활력',
] as const;

export type Keyword = typeof KEYWORDS[number];

/**
 * 랜덤 키워드를 반환하는 함수
 */
export const getRandomKeyword = (): Keyword => {
  const randomIndex = Math.floor(Math.random() * KEYWORDS.length);
  return KEYWORDS[randomIndex];
};

/**
 * 특정 날짜에 대한 일관된 키워드를 반환하는 함수
 * 같은 날짜에는 항상 같은 키워드가 반환됩니다.
 */
export const getKeywordForDate = (date: Date): Keyword => {
  const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD
  let hash = 0;
  for (let i = 0; i < dateString.length; i++) {
    const char = dateString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  const index = Math.abs(hash) % KEYWORDS.length;
  return KEYWORDS[index];
};


/**
 * 텍스트 입력 유효성 검사
 */
export const validateVibeText = (text: string): { isValid: boolean; error?: string } => {
  if (!text || text.trim().length === 0) {
    return {
      isValid: false,
      error: '내용을 입력해주세요.',
    };
  }

  if (text.trim().length < 10) {
    return {
      isValid: false,
      error: '최소 10자 이상 입력해주세요.',
    };
  }

  if (text.length > 500) {
    return {
      isValid: false,
      error: '최대 500자까지 입력 가능합니다.',
    };
  }

  return { isValid: true };
};

/**
 * 이메일 유효성 검사
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};


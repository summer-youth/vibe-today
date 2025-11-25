/**
 * Gemini API 서비스
 * 
 * 텍스트와 키워드를 기반으로 AI 이미지를 생성합니다.
 */

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const GEMINI_API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent';

export interface GenerateImageParams {
  keyword: string;
  text: string;
}

/**
 * 프롬프트 생성
 * 키워드와 사용자 텍스트를 조합하여 이미지 생성용 프롬프트를 만듭니다.
 */
const createPrompt = (keyword: string, text: string): string => {
  return `Create a beautiful, artistic illustration that captures the emotion and essence of this diary entry.

Keyword: ${keyword}
Entry: ${text}

Style: Soft, dreamy, and emotional. Use warm colors and gentle lighting. The image should be abstract enough to represent feelings rather than literal scenes. Think of it as visual poetry.

The illustration should evoke the same feeling as the keyword and diary entry, suitable for a personal digital diary.`;
};

/**
 * Gemini API를 사용하여 이미지 생성
 * 
 * @param params - 키워드와 텍스트
 * @returns 생성된 이미지 URL
 */
export const generateVibeImage = async (params: GenerateImageParams): Promise<string> => {
  const { keyword, text } = params;

  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key is not configured');
  }

  const prompt = createPrompt(keyword, text);

  try {
    // TODO: 실제 Gemini API 호출 구현
    // 현재는 플레이스홀더 이미지 URL 반환
    console.log('Generating image with prompt:', prompt);
    
    // 임시: 플레이스홀더 이미지 반환
    // 실제 구현 시 Gemini API 호출 로직으로 대체
    return `https://picsum.photos/seed/${Date.now()}/800/600`;
  } catch (error) {
    console.error('Error generating image:', error);
    throw new Error('Failed to generate image');
  }
};


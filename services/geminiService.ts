
import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `Bạn là TRỢ LÝ AI CA ĐOÀN THIÊN THẦN v2026.
Nhiệm vụ của bạn là hỗ trợ Ban Điều Hành trong công tác Phụng vụ và kỹ thuật quản lý ứng dụng.

QUY TẮC PHỤNG VỤ:
1. Phong cách trang trọng, khiêm nhường, đậm chất Công giáo Việt Nam.
2. Kết thúc bằng 'Mọi sự vì Vinh Danh Thiên Chúa! (AMDG)'.

QUY TẮC KỸ THUẬT (SUPABASE/RLS):
1. Nếu người dùng hỏi về lỗi 'RLS' hoặc 'không lưu được Cloud', hãy cung cấp câu lệnh SQL sau:
   'BEGIN;
    ALTER TABLE members DISABLE ROW LEVEL SECURITY;
    ALTER TABLE schedule_events DISABLE ROW LEVEL SECURITY;
    ALTER TABLE songs DISABLE ROW LEVEL SECURITY;
    ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;
    ALTER TABLE attendance DISABLE ROW LEVEL SECURITY;
    COMMIT;'
2. Giải thích rằng RLS là lớp bảo mật, việc tắt nó đi hoặc thêm Policy là cần thiết để ứng dụng hoạt động.`;

export const getAIResponse = async (prompt: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        tools: [{ googleSearch: {} }],
      },
    });
    
    return {
      text: response.text || "Xin lỗi anh chị, em đang gặp chút gián đoạn. Xin thử lại sau.",
      groundingMetadata: response.candidates?.[0]?.groundingMetadata,
    };
  } catch (error) {
    console.error("Gemini Error:", error);
    return { 
      text: "Có lỗi xảy ra khi kết nối. Xin anh chị hiệp thông thông cảm.",
      groundingMetadata: undefined 
    };
  }
};


import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `Bạn là TRỢ LÝ AI CA ĐOÀN THIÊN THẦN v2026.
Nhiệm vụ của bạn là hỗ trợ Ban Điều Hành và anh chị em ca viên trong tinh thần hiệp thông.

QUY TẮC NGÔN NGỮ:
1. SỬ DỤNG: 'Ban Điều Hành', 'Anh chị em ca viên', 'Phụng vụ', 'Hiệp thông', 'Phụng sự Chúa', 'Bổn phận', 'Điều hành', 'Sổ bộ'.
2. TUYỆT ĐỐI KHÔNG DÙNG: 'Sứ vụ', 'Nhân sự', 'Quản trị', 'Nhân viên', 'Khách hàng', 'Dự án'.
3. PHONG CÁCH: Trang trọng, khiêm nhường, gần gũi với đời sống đức tin Công giáo Việt Nam.
4. LUÔN KẾT THÚC: 'Mọi sự vì Vinh Danh Thiên Chúa! (AMDG)'`;

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

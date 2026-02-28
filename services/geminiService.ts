import { GoogleGenAI } from "@google/genai";

export type ChatMessage = { role: 'user' | 'ai'; content: string };

const SYSTEM_INSTRUCTION = `Bạn là TRỢ LÝ AI BAN ĐIỀU HÀNH CA ĐOÀN THIÊN THẦN — một trợ lý thông minh, hữu ích và lịch sự.
Bạn có thể trả lời mọi câu hỏi (kiến thức chung, phụng vụ, thánh ca, Công giáo, kỹ thuật, v.v.) giống như ChatGPT.

NHIỆM VỤ:
- Trả lời chính xác, rõ ràng, có thể tra cứu thông tin mới nhất khi cần.
- Hỗ trợ Ban Điều Hành: lịch phụng vụ, gợi ý thánh ca theo mùa, giải thích nghi thức.
- Phong cách: trang trọng, khiêm nhường, đậm chất Công giáo Việt Nam. Có thể kết thúc bằng "Mọi sự vì Vinh Danh Thiên Chúa! (AMDG)" khi phù hợp.

KỸ THUẬT (Supabase/RLS):
- Nếu người dùng hỏi về lỗi RLS hoặc "không lưu được Cloud", gợi ý chạy SQL tắt RLS cho các bảng: members, schedule_events, songs, transactions, attendance (DISABLE ROW LEVEL SECURITY).
- Giải thích ngắn gọn RLS và cách khắc phục.`;

const getApiKey = () =>
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_KEY) ||
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.GEMINI_API_KEY) ||
  '';

export const getAIResponseWithHistory = async (messages: ChatMessage[]): Promise<{
  text: string;
  groundingMetadata?: any;
}> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    return {
      text: 'Chưa cấu hình API Key. Vui lòng thêm **VITE_API_KEY** vào file `.env.local`, sau đó khởi động lại.\n\nLấy key miễn phí tại: https://aistudio.google.com/apikey',
      groundingMetadata: undefined,
    };
  }

  const ai = new GoogleGenAI({ apiKey });

  const contents = messages.map((m) => ({
    role: m.role === 'ai' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        tools: [{ googleSearch: {} }],
      },
    });

    return {
      text: response.text || "Xin lỗi, tôi đang gặp chút gián đoạn. Xin thử lại sau.",
      groundingMetadata: response.candidates?.[0]?.groundingMetadata,
    };
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      text: "Có lỗi kết nối tới AI. Xin kiểm tra mạng hoặc API Key và thử lại.",
      groundingMetadata: undefined,
    };
  }
};

export const getAIResponse = async (
  prompt: string,
  history?: ChatMessage[]
): Promise<{ text: string; groundingMetadata?: any }> => {
  const messages: ChatMessage[] = history
    ? [...history, { role: 'user' as const, content: prompt }]
    : [{ role: 'user', content: prompt }];
  return getAIResponseWithHistory(messages);
};

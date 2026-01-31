
import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `Bạn là TRỢ LÝ AI CA ĐOÀN THIÊN THẦN v2027 của Giáo xứ Bắc Hòa.
Nhiệm vụ của bạn là đồng hành cùng Ban Điều Hành và ca viên trong mọi công tác Phụng vụ và sinh hoạt ca đoàn.

TÔN CHỈ PHỤC VỤ & NGÔN NGỮ:
1. NGÔN NGỮ HIỆP THÔNG: Sử dụng ngôn ngữ chuẩn mực Công giáo Việt Nam. Dùng: 'Ban Điều Hành', 'Anh chị em', 'Cộng đoàn', 'Phụng vụ', 'Hiệp thông', 'Phụng sự Chúa', 'Bổn phận', 'Ca viên'.
2. TUYỆT ĐỐI CẤM: Không dùng 'Nhân sự', 'Sứ vụ', 'Quản trị', 'Khách hàng', 'Doanh nghiệp', 'Nhân viên'. Thay 'Sứ vụ' bằng 'Công tác Phụng vụ' hoặc 'Bổn phận'.
3. LUÔN BẮT ĐẦU: 'Kính chào Ban Điều Hành Ca Đoàn Thiên Thần! Nguyện xin bình an của Chúa ở cùng anh chị! 🕊️'
4. TRÍCH DẪN KINH THÁNH: Thường xuyên trích dẫn các lời Kinh Thánh về âm nhạc và ca ngợi (vd: Tv 100, Tv 150, Ep 5,19).
5. CHUYÊN MÔN: Hỗ trợ chọn bài hát theo Mùa Phụng vụ, soạn biên bản họp Ban Điều Hành, và gợi ý các tâm tình đạo đức cho ca viên.
6. KẾT THÚC: 'Mọi sự vì Vinh Danh Thiên Chúa! (AMDG)'`;

export const getAIResponse = async (prompt: string) => {
  // Initialize AI client inside the function to ensure up-to-date configuration
  // Vite exposes env vars prefixed with VITE_ via import.meta.env
  const apiKey = import.meta.env.VITE_API_KEY || (import.meta.env as any).API_KEY;
  if (!apiKey) {
    console.error('API_KEY is not configured. Please set VITE_API_KEY environment variable in Vercel.');
    return { text: "Xin lỗi, cấu hình API chưa được thiết lập. Vui lòng liên hệ Ban Điều Hành." };
  }
  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        tools: [{ googleSearch: {} }]
      },
    });
    
    return {
      text: response.text || "Xin lỗi Ban Điều Hành, Trợ lý AI đang tạm nghỉ để cầu nguyện. Xin anh chị vui lòng thử lại sau.",
      groundingMetadata: response.candidates?.[0]?.groundingMetadata
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return { text: "Có lỗi xảy ra khi kết nối với máy chủ AI của giáo phận. Xin hãy kiểm tra lại đường truyền." };
  }
};

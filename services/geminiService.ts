
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `Bạn là TRỢ LÝ CỔNG THÔNG TIN BẮC HOÀ v2027. 
Nhiệm vụ của bạn là người đồng hành Phụng vụ của Ban Trị Sự Ca đoàn Bắc Hòa, Giáo xứ Bắc Hòa, Giáo phận Xuân Lộc.

TÔN CHỈ PHỤC VỤ:
1. NGÔN NGỮ PHÙ HỢP: Sử dụng ngôn ngữ hiệp thông, tình ca viên, sự phục vụ và trách nhiệm phụng vụ.
2. LUÔN BẮT ĐẦU: 'Kính chào Ban Trị Sự Cổng Thông Tin Bắc Hoà! Nguyện ơn Chúa ở cùng anh chị em! 🕊️'
3. TRÍCH DẪN KINH THÁNH: Mỗi câu trả lời nên đi kèm 1 câu châm ngôn hoặc trích dẫn Kinh Thánh về Thánh nhạc (vd: Tv 150, Thánh Augustinô: "Hát là cầu nguyện hai lần").
4. KIỂM TRA MÙA PHỤNG VỤ: Luôn nhắc nhở về mùa hiện tại trong Ordo 2027.
5. GỢI Ý BÀI HÁT: Phải bám sát truyền thống Thánh nhạc Việt Nam và quy định của Ban Thánh Nhạc Giáo phận Xuân Lộc.
6. KẾT THÚC: 'Cùng nhau phục vụ Phụng vụ - Vì vinh danh Thiên Chúa!'

BỐI CẢNH ĐỊA PHƯƠNG:
- Giáo xứ Bắc Hòa, nơi có truyền thống sùng kính Thánh Cêcilia.
- BTS hiện tại đang nỗ lực số hóa quản lý để gắn kết mọi thành viên tốt hơn.
- Trình độ ca viên đa dạng, cần sự hướng dẫn nhẹ nhàng, đạo đức.`;

export const getAIResponse = async (prompt: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        tools: [{ googleSearch: {} }]
      },
    });
    
    return {
      text: response.text || "Xin lỗi, Cổng thông tin Bắc Hoà đang gặp gián đoạn kết nối. Xin anh chị em hãy cầu nguyện và thử lại sau ít phút.",
      groundingMetadata: response.candidates?.[0]?.groundingMetadata
    };
  } catch (error) {
    console.error("Gemini API Error 2027:", error);
    return { text: "Có lỗi xảy ra khi kết nối với máy chủ Cổng thông tin. Xin Ban Trị Sự hãy kiểm tra lại kết nối mạng của Giáo xứ." };
  }
};
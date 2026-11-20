import fs from 'fs';
import path from 'path';
import { GoogleGenAI, Type } from '@google/genai';
import 'dotenv/config';

// =========================================================================
// 1. CẤU HÌNH ĐƯỜNG DẪN FILE DỮ LIỆU
// =========================================================================
const INPUT_FILE = path.resolve('./src/data/labs.json');
const OUTPUT_FILE = path.resolve('./src/data/labs-seo.json');
const EXISTING_SEO_FILE = path.resolve('./src/data/labsSeoData.json');

// Khởi tạo Gemini API
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error('❌ Lỗi: Chưa thiết lập biến môi trường GEMINI_API_KEY!');
  console.error('👉 Vui lòng tạo file .env tại thư mục gốc với nội dung:');
  console.error('   GEMINI_API_KEY=AIzaSy...');
  console.error('   (Lấy API Key miễn phí tại https://aistudio.google.com/)');
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

// Bảng chuẩn hóa tên môn học tiếng Việt
const SUBJECT_MAP = {
  'khtn': 'Khoa học Tự nhiên',
  'vat-li': 'Vật lí',
  'vat-ly': 'Vật lí',
  'hoa-hoc': 'Hóa học',
  'sinh-hoc': 'Sinh học',
  'toan': 'Toán học',
  'tieng-anh': 'Tiếng Anh',
  'tin-hoc': 'Tin học',
  'dia-li': 'Địa lí & Lịch sử',
  'dia-ly': 'Địa lí & Lịch sử',
  'cong-nghe': 'Công nghệ',
};

// =========================================================================
// 2. ĐỊNH NGHĨA CẤU TRÚC JSON ĐẦU RA BẮT BUỘC (STRUCTURED OUTPUT)
// =========================================================================
const seoResponseSchema = {
  type: Type.OBJECT,
  properties: {
    slug: {
      type: Type.STRING,
      description: 'URL slug chuẩn SEO tiếng Việt không dấu nối bằng gạch ngang, VD: mo-phong-dinh-luat-om-vat-li-9',
    },
    title: {
      type: Type.STRING,
      description: 'Tiêu đề chuẩn SEO 55-65 ký tự chứa tên bài, môn, lớp và GDPT 2018',
    },
    textbooks: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Các bộ SGK tương thích: Kết nối tri thức, Chân trời sáng tạo, Cánh diều',
    },
    description: {
      type: Type.STRING,
      description: 'Thẻ meta description chuẩn SEO từ 145-160 ký tự hấp dẫn học sinh',
    },
    seoContent: {
      type: Type.OBJECT,
      properties: {
        objective: {
          type: Type.STRING,
          description: 'Mục tiêu bài thí nghiệm & chuẩn đầu ra GDPT 2018 (2-3 câu ngắn gọn)',
        },
        variables: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: '2-4 biến số hoặc thông số mà học sinh có thể điều chỉnh trên mô phỏng',
        },
        phenomenon: {
          type: Type.STRING,
          description: 'Mô tả hiện tượng và giải thích bản chất khoa học hoặc ngữ pháp',
        },
        formulaOrGrammar: {
          type: Type.STRING,
          description: 'Công thức cốt lõi kèm giải thích ký hiệu hoặc cấu trúc ngữ pháp',
        },
        commonMistakes: {
          type: Type.STRING,
          description: '1-2 lưu ý & lỗi sai học sinh thường gặp trong bài học này',
        },
      },
      required: ['objective', 'variables', 'phenomenon', 'formulaOrGrammar', 'commonMistakes'],
    },
    quizzes: {
      type: Type.ARRAY,
      description: 'Đúng 3 câu hỏi trắc nghiệm khách quan 4 lựa chọn bám sát nội dung bài học',
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING, description: 'Nội dung câu hỏi trắc nghiệm' },
          options: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'Mảng gồm đúng 4 lựa chọn trả lời',
          },
          answer: {
            type: Type.STRING,
            description: 'Đáp án đúng, phải khớp chính xác 100% với 1 trong 4 lựa chọn ở options',
          },
          explanation: {
            type: Type.STRING,
            description: 'Giải thích ngắn gọn 1-2 câu tại sao đáp án đó là đúng',
          },
        },
        required: ['question', 'options', 'answer', 'explanation'],
      },
    },
  },
  required: ['slug', 'title', 'textbooks', 'description', 'seoContent', 'quizzes'],
};

// Hàm tạm dừng để bảo vệ Rate Limit
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function generateSeoForLab(labItem, allLabsSummary) {
  const prompt = `
Bạn là Chuyên gia Biên soạn Học liệu Chương trình GDPT 2018 (Lớp 6 - 12) kiêm Chuyên gia SEO Giáo dục Việt Nam.
Hãy viết nội dung học thuật chi tiết, chính xác theo chương trình của Bộ Giáo dục & Đào tạo Việt Nam và chuẩn SEO cho bài thí nghiệm/bài luyện tập sau:

Thông tin bài lab gốc:
${JSON.stringify(labItem, null, 2)}

Danh sách tóm tắt các bài khác trong hệ thống (để tham khảo tránh trùng lặp slug URL):
${allLabsSummary}

YÊU CẦU ĐẶC BIỆT:
1. "slug" phải duy nhất, không dấu, viết thường, ngăn cách bằng dấu gạch ngang (VD: mo-phong-dinh-luat-om-vat-li-9).
2. "title" chứa đầy đủ Tên bài học — Môn — Lớp — Chuẩn GDPT 2018 (dưới 70 ký tự).
3. "quizzes" phải có đúng 3 câu trắc nghiệm chất lượng cao, "answer" phải giống hệt một trong các chuỗi ở "options".
4. Nội dung tuyệt đối bám sát chương trình phổ thông Việt Nam (SGK Kết nối tri thức, Chân trời sáng tạo, Cánh diều).
`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: seoResponseSchema,
      temperature: 0.3, // Độ chính xác cao, ít bịa đặt
    },
  });

  return JSON.parse(response.text);
}

// =========================================================================
// 3. HÀM CHÍNH THỰC THI (MAIN RUNNER)
// =========================================================================
async function main() {
  console.log('🚀 Khởi động tiến trình Enrich Programmatic SEO với Gemini API...');

  if (!fs.existsSync(INPUT_FILE)) {
    console.error(`❌ Không tìm thấy file đầu vào tại: ${INPUT_FILE}`);
    process.exit(1);
  }

  // Đọc danh sách bài gốc
  const rawData = JSON.parse(fs.readFileSync(INPUT_FILE, 'utf-8'));
  console.log(`📋 Tổng số bài lab cần xử lý: ${rawData.length} bài.`);

  // Khởi tạo danh sách kết quả (Resume nếu đã có file cũ)
  let enrichedLabs = [];
  if (fs.existsSync(OUTPUT_FILE)) {
    try {
      enrichedLabs = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf-8'));
      console.log(`🔄 Tìm thấy file tiến độ cũ (${enrichedLabs.filter(Boolean).length}/${rawData.length} bài đã hoàn tất).`);
    } catch {
      enrichedLabs = [];
    }
  } else if (fs.existsSync(EXISTING_SEO_FILE)) {
    // Tự động kế thừa từ file labsSeoData.json đã có sẵn
    try {
      const existing = JSON.parse(fs.readFileSync(EXISTING_SEO_FILE, 'utf-8'));
      if (Array.isArray(existing) && existing.length > 0) {
        console.log(`📦 Tự động nạp ${existing.length} bài đã có sẵn từ labsSeoData.json để tránh gọi trùng lặp.`);
        enrichedLabs = [...existing];
      }
    } catch {
      // Bỏ qua nếu không đọc được
    }
  }

  // Tóm tắt danh sách để Gemini tham khảo slug
  const allLabsSummary = rawData.map((l, idx) => `${idx + 1}. ${l.title || l.name || l.id} (${l.subject} lớp ${l.grade})`).join('\n');

  for (let i = 0; i < rawData.length; i++) {
    const currentLab = rawData[i];

    // Kiểm tra xem bài này đã có dữ liệu SEO chưa
    const alreadyDone = enrichedLabs.find(
      (item) => item && (item.id === currentLab.id || (item.slug && item.slug.includes(currentLab.id)))
    );

    if (alreadyDone && alreadyDone.seoContent && alreadyDone.quizzes && alreadyDone.quizzes.length >= 3) {
      console.log(`⏭️ [${i + 1}/${rawData.length}] Đã có dữ liệu SEO, bỏ qua: ${currentLab.title || currentLab.id}`);
      // Đảm bảo vị trí này trong enrichedLabs có dữ liệu
      const existingIndex = enrichedLabs.findIndex((x) => x && x.id === currentLab.id);
      if (existingIndex === -1) {
        enrichedLabs.push(alreadyDone);
      }
      continue;
    }

    console.log(`⏳ [${i + 1}/${rawData.length}] Đang sinh SEO cho: "${currentLab.title || currentLab.id}" (Môn ${currentLab.subject}, Lớp ${currentLab.grade})...`);

    try {
      const seoData = await generateSeoForLab(currentLab, allLabsSummary);

      // Chuẩn hóa môn học và mã GDPT nếu thiếu
      const subjectName = currentLab.subjectName || SUBJECT_MAP[currentLab.subject] || 'STEM GDPT 2018';
      const curriculumCode = currentLab.curriculumCode || `GDPT2018-${(currentLab.subject || 'STEM').toUpperCase()}${currentLab.grade || ''}`;

      const mergedItem = {
        ...currentLab,
        ...seoData,
        subjectName,
        curriculumCode,
      };

      // Cập nhật hoặc đẩy vào danh sách
      const foundIdx = enrichedLabs.findIndex((x) => x && x.id === currentLab.id);
      if (foundIdx !== -1) {
        enrichedLabs[foundIdx] = mergedItem;
      } else {
        enrichedLabs.push(mergedItem);
      }

      // Lưu ngay sau mỗi bài để chống mất dữ liệu khi mất mạng / hết quota
      fs.writeFileSync(OUTPUT_FILE, JSON.stringify(enrichedLabs, null, 2), 'utf-8');
      console.log(`✅ [${i + 1}/${rawData.length}] Hoàn thành & Đã lưu vào file!`);

      // Nghỉ 2 giây giữa các request để tuân thủ Free Tier Rate Limit
      await sleep(2000);
    } catch (error) {
      console.error(`❌ Lỗi ở bài số ${i + 1} (${currentLab.title || currentLab.id}):`, error.message);
      console.log('⏸️ Tạm dừng 10 giây trước khi thử bài tiếp theo...');
      await sleep(10000);
    }
  }

  // =========================================================================
  // 4. TỰ ĐỘNG TẠO LIÊN KẾT NỘI BỘ (INTERNAL LINKING - relatedSlugs)
  // =========================================================================
  console.log('🔗 Đang tự động tạo mạng lưới liên kết nội bộ (relatedSlugs)...');
  const validLabs = enrichedLabs.filter(Boolean);

  const finalizedLabs = validLabs.map((lab) => {
    // Ưu tiên bài cùng môn, nếu không đủ lấy thêm bài cùng khối lớp
    const related = validLabs
      .filter((other) => other && other.slug !== lab.slug && (other.subject === lab.subject || other.grade === lab.grade))
      .slice(0, 4)
      .map((other) => other.slug);

    return {
      ...lab,
      relatedSlugs: related.length > 0 ? related : [validLabs[0]?.slug].filter(Boolean),
    };
  });

  // Ghi kết quả cuối cùng
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(finalizedLabs, null, 2), 'utf-8');
  console.log(`🎉 HOÀN TẤT TOÀN BỘ ${finalizedLabs.length} BÀI LAB!`);
  console.log(`📁 File kết quả: ${OUTPUT_FILE}`);
  console.log(`💡 Mẹo: Bạn có thể copy nội dung sang src/data/labsSeoData.json rồi chạy 'npm run build' để sinh toàn bộ trang tĩnh & sitemap mới.`);
}

main().catch((err) => {
  console.error('Lỗi nghiêm trọng:', err);
  process.exit(1);
});

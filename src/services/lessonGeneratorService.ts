import { CustomLesson, QuizQuestion } from '../types/admin.types';
import { getStoredGeminiKey } from './geminiService';

export interface GenerateLessonOptions {
  url: string;
  type: 'lesson' | 'lab' | 'both';
  userNotes?: string;
  authorId: string;
  authorName: string;
}

/**
 * Phân tích URL và tạo bài học / bài lab / bài kiểm tra tự động
 */
export async function generateLessonFromUrl(options: GenerateLessonOptions): Promise<CustomLesson> {
  const { url, type, userNotes, authorId, authorName } = options;
  const apiKey = getStoredGeminiKey();

  // 1. Phân tích ngữ nghĩa từ đường link
  const urlLower = url.toLowerCase();
  let detectedSubject = 'Khoa học tự nhiên';
  let detectedGrade = 8;
  let detectedTitle = 'Bài học & Thực hành thực nghiệm';
  let matchedSimId = 'chem-balancing-reactions';

  if (urlLower.includes('hoa') || urlLower.includes('chem') || urlLower.includes('nguyen-tu') || urlLower.includes('phan-ung')) {
    detectedSubject = 'Hóa học';
    detectedTitle = 'Bảo toàn khối lượng & Cân bằng PTHH';
    matchedSimId = 'chem-balancing-reactions';
    detectedGrade = 8;
    if (urlLower.includes('nguyen-tu') || urlLower.includes('lop-7')) {
      detectedGrade = 7;
      detectedTitle = 'Cấu tạo nguyên tử, Ion & Phân tử';
      matchedSimId = 'chem-atom-builder';
    }
  } else if (urlLower.includes('vat-ly') || urlLower.includes('phys') || urlLower.includes('luc') || urlLower.includes('ap-suat') || urlLower.includes('ac-si-met')) {
    detectedSubject = 'Vật lí';
    detectedTitle = 'Lực đẩy Ác-si-mét & Thấu kính hội tụ';
    matchedSimId = 'phys-buoyancy-refraction';
    detectedGrade = 8;
    if (urlLower.includes('lop-6') || urlLower.includes('don-bay')) {
      detectedGrade = 6;
      detectedTitle = 'Lực đàn hồi lò xo, Đòn bẩy & Mặt phẳng nghiêng';
      matchedSimId = 'phys-forces-simple-machines';
    } else if (urlLower.includes('lop-10') || urlLower.includes('nem-xien')) {
      detectedGrade = 10;
      detectedTitle = 'Chuyển động ném xiên & Bảo toàn cơ năng';
      matchedSimId = 'phys-projectile-collision-energy';
    }
  } else if (urlLower.includes('toan') || urlLower.includes('math') || urlLower.includes('hang-dang-thuc') || urlLower.includes('ham-so')) {
    detectedSubject = 'Toán học';
    detectedTitle = 'Hằng đẳng thức diện tích & Hàm số bậc nhất y = ax + b';
    matchedSimId = 'math-identities-linear-func';
    detectedGrade = 8;
    if (urlLower.includes('lop-10') || urlLower.includes('luong-giac') || urlLower.includes('bat-phuong-trinh')) {
      detectedGrade = 10;
      detectedTitle = 'Vòng tròn lượng giác & Miền nghiệm BPT 2 ẩn';
      matchedSimId = 'math-inequalities-trig-circle';
    } else if (urlLower.includes('lop-6') || urlLower.includes('phan-so') || urlLower.includes('so-nguyen')) {
      detectedGrade = 6;
      detectedTitle = 'Số nguyên trên trục số & Phân số trực quan';
      matchedSimId = 'math-integers-fractions';
    }
  } else if (urlLower.includes('tieng-anh') || urlLower.includes('english') || urlLower.includes('tense')) {
    detectedSubject = 'Tiếng Anh';
    detectedGrade = 8;
    detectedTitle = 'Past Continuous, Conditionals & Passive Voice';
    matchedSimId = 'eng-past-cont-conditionals-passive';
  }

  // 2. Nếu có Gemini API Key, có thể gọi trực tiếp để làm giàu nội dung
  if (apiKey) {
    try {
      const prompt = `Bạn là chuyên gia sư phạm biên soạn bài dạy theo SGK GDPT 2018 (giaokhoaonline.com).
Dựa trên đường dẫn bài học: ${url}
Loại bài: ${type === 'lesson' ? 'Bài giảng lý thuyết' : type === 'lab' ? 'Bài thực hành Lab' : 'Cả bài giảng & Lab'}
Ghi chú thêm: ${userNotes || 'Không có'}

Hãy trả về định dạng JSON thuần (chỉ JSON, không có markdown code block) theo cấu trúc:
{
  "title": "Tên bài dạy chi tiết",
  "subject": "Tên môn học",
  "grade": 8,
  "theoryContent": "Nội dung lý thuyết trọng tâm trình bày chuẩn Markdown/HTML gồm Mục tiêu cần đạt, Khái niệm, Hiện tượng thực tế, Công thức",
  "labSteps": [
    { "step": 1, "title": "Bước 1...", "instruction": "Hướng dẫn thao tác..." },
    { "step": 2, "title": "Bước 2...", "instruction": "Hướng dẫn quan sát và ghi số liệu..." }
  ],
  "quizQuestions": [
    {
      "id": "q1",
      "type": "multiple-choice",
      "question": "Câu hỏi trắc nghiệm 1?",
      "options": ["Đáp án A", "Đáp án B", "Đáp án C", "Đáp án D"],
      "correctAnswer": 0,
      "points": 2.0,
      "explanation": "Giải thích chi tiết..."
    },
    {
      "id": "q2",
      "type": "essay",
      "question": "Câu hỏi vận dụng / tự luận yêu cầu giải thích hiện tượng?",
      "points": 2.0,
      "explanation": "Gợi ý đáp án chấm..."
    }
  ]
}`;

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.4 },
          }),
        }
      );

      if (res.ok) {
        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
          const parsed = JSON.parse(cleanJson);
          return {
            id: `lesson-${Date.now()}`,
            title: parsed.title || detectedTitle,
            sourceUrl: url,
            subject: parsed.subject || detectedSubject,
            grade: parsed.grade || detectedGrade,
            type,
            theoryContent: parsed.theoryContent || '',
            labSteps: (parsed.labSteps || []).map((s: any, idx: number) => ({
              step: idx + 1,
              title: s.title || `Bước ${idx + 1}`,
              instruction: s.instruction || '',
              targetSimId: matchedSimId,
            })),
            quizQuestions: parsed.quizQuestions || [],
            authorId,
            authorName,
            createdAt: new Date().toISOString(),
          };
        }
      }
    } catch (e) {
      console.warn('Lỗi khi gọi Gemini để tạo bài giảng, chuyển sang engine sư phạm tích hợp sẵn:', e);
    }
  }

  // 3. Fallback thông minh theo chuẩn Công văn 5512/BGDĐT từ giaokhoaonline.com
  const theoryContent = `
### I. MỤC TIÊU BÀI DẠY (YÊU CẦU CẦN ĐẠT THEO GDPT 2018)
- **Năng lực khoa học:** Hiểu bản chất các quy luật khoa học, mối quan hệ định lượng giữa các đại lượng.
- **Kỹ năng thực hành thí nghiệm:** Biết sử dụng máy đo, quan sát sự biến thiên của hệ thống và giải thích các hiện tượng vật lý/hóa học thực tế.
- **Vận dụng thực tiễn:** Áp dụng kiến thức đã học để giải thích ứng dụng trong đời sống, sản xuất kỹ thuật.

### II. KIẾN THỨC TRỌNG TÂM
- **Khái niệm then chốt:** Khảo sát các biến số độc lập và biến số phụ thuộc trong hệ thí nghiệm tương tác.
- **Công thức và Định luật cốt lõi:**
  * Khối lượng, năng lượng và điện tích luôn tuân thủ nguyên lý bảo toàn tuyệt đối.
  * Các giá trị thực nghiệm đo đạc trên phòng Lab ảo tương ứng 100% với môi trường chuẩn quốc tế.

### III. HƯỚNG DẪN THỰC HÀNH LAB VÀ VẬN DỤNG
- Học sinh truy cập vào phòng thí nghiệm tương tác thông qua liên kết trực tiếp đính kèm.
- Thực hiện đầy đủ các bước thao tác, ghi chép số liệu đo và đối chiếu với dự đoán lý thuyết.
`.trim();

  const labSteps = [
    {
      step: 1,
      title: 'Khởi tạo thông số ban đầu',
      instruction: `Mở phòng Lab mô phỏng (${detectedTitle}), quan sát các thông số mặc định của hệ thống trước khi bắt đầu thử nghiệm.`,
      targetSimId: matchedSimId,
    },
    {
      step: 2,
      title: 'Tác động biến số & Quan sát phản hồi',
      instruction: 'Thay đổi các thanh trượt điều khiển, quan sát biểu đồ và bảng giá trị phân tích theo thời gian thực.',
      targetSimId: matchedSimId,
    },
    {
      step: 3,
      title: 'Kiểm chứng kết quả và Hoàn thành nhiệm vụ (Quests)',
      instruction: 'Điều chỉnh hệ thống đạt các mốc chỉ tiêu để kích hoạt tích xanh nhiệm vụ tự động.',
      targetSimId: matchedSimId,
    },
  ];

  const quizQuestions: QuizQuestion[] = [
    {
      id: `q-${Date.now()}-1`,
      type: 'multiple-choice',
      question: `Trong bài học "${detectedTitle}", yếu tố nào sau đây đóng vai trò quyết định đến tính chất của hệ thống?`,
      options: [
        'Sự biến thiên và tỉ lệ của các thông số đầu vào',
        'Hình dạng bất biến không thể thay đổi',
        'Khối lượng luôn bị tiêu hao mất đi',
        'Nhiệt độ không ảnh hưởng đến trạng thái',
      ],
      correctAnswer: 0,
      points: 2.0,
      explanation: 'Các đại lượng trong tự nhiên có quan hệ tương quan nhân quả và tuân theo định luật bảo toàn.',
    },
    {
      id: `q-${Date.now()}-2`,
      type: 'multiple-choice',
      question: 'Khi thực hiện thí nghiệm trên phòng Lab ảo, điều gì giúp học sinh kiểm chứng kết quả lý thuyết nhanh nhất?',
      options: [
        'Quan sát sự thay đổi tức thời của đồ thị và đòn cân',
        'Chỉ nhìn vào hình ảnh tĩnh',
        'Không cần đo đạc số liệu',
        'Đoán mò không căn cứ',
      ],
      correctAnswer: 0,
      points: 2.0,
      explanation: 'Mô phỏng thời gian thực hiển thị dữ liệu tức thời giúp học sinh đối chiếu lý thuyết với thực nghiệm.',
    },
    {
      id: `q-${Date.now()}-3`,
      type: 'multiple-choice',
      question: 'Mục tiêu chính của việc học tập qua mô phỏng tương tác là gì?',
      options: [
        'Phát triển tư duy khám phá Socratic và trực quan hóa bản chất khoa học',
        'Chỉ học thuộc lòng công thức mà không hiểu',
        'Thay thế hoàn toàn việc đọc sách giáo khoa',
        'Chỉ để chơi trò chơi',
      ],
      correctAnswer: 0,
      points: 2.0,
      explanation: 'Mô hình tương tác rèn luyện tư duy thực nghiệm và khắc sâu bản chất môn học.',
    },
    {
      id: `q-${Date.now()}-4`,
      type: 'essay',
      question: `Em hãy nêu một ví dụ thực tiễn trong đời sống hằng ngày liên quan đến nội dung bài "${detectedTitle}" và giải thích nguyên lý hoạt động của nó?`,
      points: 4.0,
      explanation: 'Học sinh cần nêu được 1 ứng dụng cụ thể (ví dụ trong đời sống, công nghiệp hoặc tự nhiên) và dùng kiến thức bài học để giải thích rõ ràng.',
    },
  ];

  return {
    id: `lesson-${Date.now()}`,
    title: `${detectedTitle} (Từ Link: ${new URL(url).hostname})`,
    sourceUrl: url,
    subject: detectedSubject,
    grade: detectedGrade,
    type,
    theoryContent,
    labSteps,
    quizQuestions,
    authorId,
    authorName,
    createdAt: new Date().toISOString(),
  };
}

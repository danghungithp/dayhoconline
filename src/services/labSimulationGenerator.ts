import {
  CustomLesson,
  InteractiveLabSimulationData,
  InteractiveLabParameter,
  InteractiveLabOutput,
  InteractiveLabQuest,
  QuizQuestion,
} from '../types/admin.types';
import { getStoredGeminiKey } from './geminiService';

export interface GenerateLabRequest {
  title: string;
  description: string;
  subject: string;
  grade: number;
  authorId: string;
  authorName: string;
}

/**
 * Phân tích và sinh Bài thực hành Lab mô phỏng tương tác từ Tên bài & Mô tả
 */
export async function generateLabSimulation(
  request: GenerateLabRequest
): Promise<CustomLesson> {
  const { title, description, subject, grade, authorId, authorName } = request;
  const apiKey = getStoredGeminiKey();

  const titleLower = (title + ' ' + description).toLowerCase();

  // Thử gọi AI Gemini nếu có API Key
  if (apiKey) {
    try {
      const prompt = `Bạn là chuyên gia thiết kế phòng thí nghiệm ảo tương tác GDPT 2018 (STEM Lab Việt Nam).
Dựa trên thông tin giáo viên cung cấp:
- Tên bài thực hành: "${title}"
- Mô tả bài thực hành: "${description}"
- Môn học: "${subject}"
- Khối lớp: Lớp ${grade}

Hãy thiết kế một bài thực hành Lab mô phỏng tương tác 60 FPS hoàn chỉnh theo chuẩn Công văn 5512/BGDĐT.
Trả về ĐÚNG ĐỊNH DẠNG JSON THUẦN (không markdown, không bọc trong \`\`\`json):
{
  "title": "Tiêu đề chuẩn hóa kèm SGK GDPT 2018",
  "objective": "Mục tiêu bài thực hành (Kiến thức, kỹ năng thao tác, năng lực giải quyết vấn đề)",
  "phenomenon": "Bản chất hiện tượng khoa học và nguyên lý hoạt động",
  "formula": "Công thức toán học/vật lý/hóa học cốt lõi (dạng KaTeX/LaTeX)",
  "diagramType": "pendulum|circuit|reaction|cell|optics|flowchart|wave|graph",
  "engineType": "physics|chemistry|biology|math|technology|english|general",
  "parameters": [
    {
      "id": "param1",
      "name": "ten_bien",
      "label": "Tên thông số hiển thị",
      "unit": "Đơn vị (V, A, m, kg, s, pH, ...)",
      "min": 0,
      "max": 100,
      "defaultValue": 10,
      "step": 1,
      "description": "Ý nghĩa thông số"
    }
  ],
  "outputs": [
    {
      "id": "out1",
      "label": "Đại lượng đo đạc",
      "unit": "Đơn vị",
      "formulaDescription": "Công thức tính toán đại lượng này"
    }
  ],
  "quests": [
    {
      "id": "quest1",
      "title": "Nhiệm vụ 1",
      "prompt": "Yêu cầu học sinh thao tác thông số để đạt điều kiện",
      "conditionDescription": "Điều kiện hoàn thành",
      "points": 25
    }
  ],
  "labSteps": [
    { "step": 1, "title": "Bước 1...", "instruction": "Hướng dẫn cụ thể..." },
    { "step": 2, "title": "Bước 2...", "instruction": "Hướng dẫn cụ thể..." },
    { "step": 3, "title": "Bước 3...", "instruction": "Hướng dẫn cụ thể..." },
    { "step": 4, "title": "Bước 4...", "instruction": "Hướng dẫn cụ thể..." }
  ],
  "quizQuestions": [
    {
      "id": "q1",
      "type": "multiple-choice",
      "question": "Câu hỏi trắc nghiệm kiểm tra hiểu biết hiện tượng?",
      "options": ["Lựa chọn A", "Lựa chọn B", "Lựa chọn C", "Lựa chọn D"],
      "correctAnswer": 0,
      "points": 2.5,
      "explanation": "Giải thích chi tiết..."
    },
    {
      "id": "q2",
      "type": "multiple-choice",
      "question": "Câu hỏi thứ hai về công thức hoặc quan sát?",
      "options": ["Lựa chọn A", "Lựa chọn B", "Lựa chọn C", "Lựa chọn D"],
      "correctAnswer": 0,
      "points": 2.5,
      "explanation": "Giải thích chi tiết..."
    },
    {
      "id": "q3",
      "type": "essay",
      "question": "Câu hỏi tự luận vận dụng thực tế từ kết quả bài lab?",
      "points": 5.0,
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
            generationConfig: { temperature: 0.3 },
          }),
        }
      );

      if (res.ok) {
        const jsonRes = await res.json();
        const text = jsonRes?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          const clean = text.replace(/```json/g, '').replace(/```/g, '').trim();
          const parsed = JSON.parse(clean);

          const matchedSimId = matchExistingSimulation(titleLower, subject);

          return {
            id: `lab-custom-${Date.now()}`,
            title: parsed.title || title,
            description,
            subject,
            grade,
            type: 'lab',
            theoryContent: `
### I. MỤC TIÊU BÀI THỰC HÀNH LAB
${parsed.objective || description}

### II. NGUYÊN LÝ KHOA HỌC & BẢN CHẤT HIỆN TƯỢNG
${parsed.phenomenon || 'Khảo sát sự tương quan giữa các thông số vật lý/hóa học/sinh học trong hệ thí nghiệm mô phỏng.'}

### III. CÔNG THỨC TRỌNG TÂM
$$${parsed.formula || 'y = f(x)'}$$
`.trim(),
            labSteps: (parsed.labSteps || []).map((s: any, idx: number) => ({
              step: idx + 1,
              title: s.title || `Thao tác ${idx + 1}`,
              instruction: s.instruction || '',
              targetSimId: matchedSimId,
            })),
            quizQuestions: parsed.quizQuestions || [],
            simulationData: {
              engineType: parsed.engineType || 'physics',
              diagramType: parsed.diagramType || 'graph',
              objective: parsed.objective || description,
              phenomenon: parsed.phenomenon || '',
              formula: parsed.formula || '',
              variables: (parsed.parameters || []).map((p: any) => p.name),
              parameters: parsed.parameters || [],
              outputs: parsed.outputs || [],
              quests: parsed.quests || [],
            },
            authorId,
            authorName,
            createdAt: new Date().toISOString(),
          };
        }
      }
    } catch (e) {
      console.warn('Lỗi khi gọi Gemini tạo bài Lab, chuyển sang Pedagogical Engine tích hợp sẵn:', e);
    }
  }

  // Pedagogical Rule Engine tích hợp sẵn chất lượng cao
  return buildIntelligentLabFromKeywords(title, description, subject, grade, authorId, authorName);
}

/**
 * Ghép nối thông minh với các Module mô phỏng 60 FPS đã triển khai trong hệ thống
 */
export function matchExistingSimulation(text: string, subject: string): string {
  const t = text.toLowerCase();
  if (t.includes('mạch') || t.includes('điện') || t.includes('ohm') || t.includes('dòng điện') || t.includes('cảm ứng')) {
    return 'phys-dc-circuits-induction';
  }
  if (t.includes('orbital') || t.includes('nguyên tử') || t.includes('electron') || t.includes('liên kết')) {
    return 'chem-orbitals-bonding';
  }
  if (t.includes('ph') || t.includes('axit') || t.includes('bazo') || t.includes('phân li') || t.includes('chuẩn độ') || t.includes('hữu cơ')) {
    return 'chem-dissociation-organic-3d';
  }
  if (t.includes('thuật toán') || t.includes('flowchart') || t.includes('sắp xếp') || t.includes('lưu đồ') || t.includes('lập trình')) {
    return 'cs-algorithms-flowchart';
  }
  if (t.includes('nguyên phân') || t.includes('phân bào') || t.includes('tế bào') || t.includes('nhiễm sắc thể') || t.includes('mitosis')) {
    return 'bio-cell-division-mitosis';
  }
  if (t.includes('smart home') || t.includes('nhà thông minh') || t.includes('cảm biến') || t.includes('công nghệ') || t.includes('iot')) {
    return 'tech-circuits-smart-home';
  }
  if (t.includes('quang') || t.includes('ánh sáng') || t.includes('thấu kính') || t.includes('âm') || t.includes('sóng')) {
    return 'phys-light-optics-sound';
  }
  if (t.includes('con lắc') || t.includes('ném') || t.includes('cơ năng') || t.includes('động năng') || t.includes('va chạm')) {
    return 'phys-projectile-collision-energy';
  }
  if (t.includes('bảo toàn khối lượng') || t.includes('cân bằng') || t.includes('pthh')) {
    return 'chem-balancing-reactions';
  }
  if (t.includes('lực đẩy') || t.includes('ác-si-mét') || t.includes('chìm nổi')) {
    return 'phys-buoyancy-refraction';
  }
  if (t.includes('thì') || t.includes('tense') || t.includes('tiếng anh') || t.includes('passive')) {
    return 'eng-present-simple-continuous';
  }
  if (t.includes('parabol') || t.includes('bậc hai') || t.includes('hàm số')) {
    return 'math-linear-systems-quadratic';
  }

  // Mặc định theo môn
  if (subject.includes('Vật lí') || subject.includes('Vật lý')) return 'phys-dc-circuits-induction';
  if (subject.includes('Hóa')) return 'chem-orbitals-bonding';
  if (subject.includes('Sinh')) return 'bio-cell-division-mitosis';
  if (subject.includes('Tin')) return 'cs-algorithms-flowchart';
  if (subject.includes('Công nghệ')) return 'tech-circuits-smart-home';
  if (subject.includes('Tiếng Anh')) return 'eng-present-simple-continuous';
  return 'phys-projectile-collision-energy';
}

/**
 * Xây dựng bài Lab chuyên sâu theo chủ đề và từ khóa
 */
function buildIntelligentLabFromKeywords(
  title: string,
  description: string,
  subject: string,
  grade: number,
  authorId: string,
  authorName: string
): CustomLesson {
  const combined = (title + ' ' + description).toLowerCase();
  const matchedSimId = matchExistingSimulation(combined, subject);

  let engineType: InteractiveLabSimulationData['engineType'] = 'physics';
  let diagramType: InteractiveLabSimulationData['diagramType'] = 'graph';
  let formula = '';
  let phenomenon = '';
  let objective = '';
  let parameters: InteractiveLabParameter[] = [];
  let outputs: InteractiveLabOutput[] = [];
  let quests: InteractiveLabQuest[] = [];
  let quizQuestions: QuizQuestion[] = [];

  // 1. Nhóm bài về Con lắc đơn / Dao động cơ
  if (combined.includes('con lắc') || combined.includes('dao động') || combined.includes('lò xo')) {
    engineType = 'physics';
    diagramType = 'pendulum';
    formula = 'T = 2\\pi \\sqrt{\\frac{l}{g}} \\implies g = \\frac{4\\pi^2 l}{T^2} \\quad | \\quad W = W_t + W_d = \\text{const}';
    phenomenon =
      'Con lắc đơn dao động tuần hoàn dưới tác dụng của thành phần trọng lực hướng về vị trí cân bằng. Với góc lệch nhỏ (α₀ < 10°), dao động là điều hòa. Chu kỳ T chỉ phụ thuộc vào chiều dài dây l và gia tốc trọng trường g, không phụ thuộc vào khối lượng vật nặng m.';
    objective =
      'Khảo sát chu kỳ dao động điều hòa của con lắc đơn khi thay đổi chiều dài dây l và khối lượng m; kiểm chứng công thức tính chu kỳ và xác định gia tốc trọng trường g tại phòng thí nghiệm.';
    parameters = [
      { id: 'param-l', name: 'length', label: 'Chiều dài dây l', unit: 'm', min: 0.2, max: 2.0, defaultValue: 1.0, step: 0.1, description: 'Chiều dài từ điểm treo đến tâm con lắc' },
      { id: 'param-m', name: 'mass', label: 'Khối lượng quả nặng m', unit: 'kg', min: 0.05, max: 1.0, defaultValue: 0.2, step: 0.05, description: 'Khối lượng vật thể dao động' },
      { id: 'param-angle', name: 'angle', label: 'Góc lệch ban đầu α₀', unit: 'độ', min: 5, max: 45, defaultValue: 15, step: 1, description: 'Biên độ góc thả rơi ban đầu' },
      { id: 'param-g', name: 'gravity', label: 'Gia tốc trọng trường g', unit: 'm/s²', min: 1.6, max: 20.0, defaultValue: 9.8, step: 0.1, description: 'Môi trường khảo sát (9.8: Trái Đất, 1.6: Mặt Trăng)' },
    ];
    outputs = [
      { id: 'out-T', label: 'Chu kỳ dao động T', unit: 'giây (s)', formulaDescription: 'T = 2π√(l/g)' },
      { id: 'out-f', label: 'Tần số dao động f', unit: 'Hertz (Hz)', formulaDescription: 'f = 1/T' },
      { id: 'out-vmax', label: 'Vận tốc cực đại vmax', unit: 'm/s', formulaDescription: 'vmax = √(2gl(1 - cosα₀))' },
      { id: 'out-W', label: 'Cơ năng toàn phần W', unit: 'Joule (J)', formulaDescription: 'W = mgl(1 - cosα₀)' },
    ];
    quests = [
      { id: 'quest-1', title: 'Thiết lập dây treo chuẩn', prompt: 'Điều chỉnh chiều dài dây l = 1.0 m và góc lệch α₀ = 10°', conditionDescription: 'length == 1.0 && angle <= 15', points: 30 },
      { id: 'quest-2', title: 'Đo chu kỳ 2 giây', prompt: 'Tìm giá trị chiều dài l trên Trái Đất để chu kỳ T xấp xỉ 2.00 s', conditionDescription: 'T >= 1.98 && T <= 2.02', points: 35 },
      { id: 'quest-3', title: 'Thí nghiệm trên Mặt Trăng', prompt: 'Chuyển môi trường trọng trường sang Mặt Trăng (g = 1.6 m/s²) và quan sát chu kỳ tăng lên', conditionDescription: 'gravity == 1.6', points: 35 },
    ];
    quizQuestions = [
      {
        id: 'q-p-1',
        type: 'multiple-choice',
        question: 'Khi tăng khối lượng quả nặng m lên gấp đôi mà giữ nguyên chiều dài dây l, chu kỳ dao động T của con lắc đơn sẽ thay đổi thế nào?',
        options: ['Không đổi (T độc lập với khối lượng m)', 'Tăng lên √2 lần', 'Giảm đi một nửa', 'Tăng lên 2 lần'],
        correctAnswer: 0,
        points: 2.5,
        explanation: 'Theo công thức T = 2π√(l/g), chu kỳ không chứa biến số khối lượng m.',
      },
      {
        id: 'q-p-2',
        type: 'multiple-choice',
        question: 'Để chu kỳ dao động của con lắc đơn tăng lên 2 lần, cần thay đổi chiều dài dây l như thế nào?',
        options: ['Tăng chiều dài l lên 4 lần', 'Tăng chiều dài l lên 2 lần', 'Giảm chiều dài l đi 4 lần', 'Tăng góc lệch ban đầu lên 2 lần'],
        correctAnswer: 0,
        points: 2.5,
        explanation: 'Vì T tỉ lệ thuận với căn bậc hai của l (T ~ √l), nên muốn T tăng 2 lần thì l phải tăng 2² = 4 lần.',
      },
      {
        id: 'q-p-3',
        type: 'essay',
        question: 'Giải thích tại sao một chiếc đồng hồ quả lắc chạy đúng giờ ở Hà Nội, khi mang lên đỉnh núi cao Phan Xi Păng lại chạy chậm lại?',
        points: 5.0,
        explanation: 'Trên đỉnh núi cao, khoảng cách đến tâm Trái Đất lớn hơn nên gia tốc trọng trường g giảm. Khi g giảm, chu kỳ T = 2π√(l/g) tăng lên, mỗi dao động mất nhiều thời gian hơn nên đồng hồ chạy chậm.',
      },
    ];
  }
  // 2. Nhóm bài về Điện học & Mạch điện & Định luật Ohm
  else if (combined.includes('điện') || combined.includes('mạch') || combined.includes('ohm') || combined.includes('dòng điện')) {
    engineType = 'physics';
    diagramType = 'circuit';
    formula = 'I = \\frac{U}{R} \\implies U = I \\cdot R \\quad | \\quad P = U \\cdot I = I^2 R \\quad | \\quad R_{td} = R_1 + R_2';
    phenomenon =
      'Định luật Ohm phát biểu rằng cường độ dòng điện chạy qua một dây dẫn tỉ lệ thuận với hiệu điện thế giữa hai đầu dây và tỉ lệ nghịch với điện trở của dây dẫn đó.';
    objective =
      'Khảo sát định luật Ohm; đo cường độ dòng điện I, hiệu điện thế U và công suất tỏa nhiệt P khi điều chỉnh điện trở biến trở và điện áp nguồn điện.';
    parameters = [
      { id: 'param-u', name: 'voltage', label: 'Điện áp nguồn U', unit: 'V', min: 1, max: 24, defaultValue: 12, step: 0.5, description: 'Hiệu điện thế cung cấp cho đoạn mạch' },
      { id: 'param-r1', name: 'resistor1', label: 'Điện trở R1', unit: 'Ω', min: 2, max: 100, defaultValue: 10, step: 1, description: 'Điện trở tải thứ nhất' },
      { id: 'param-r2', name: 'resistor2', label: 'Biến trở R2', unit: 'Ω', min: 0, max: 50, defaultValue: 10, step: 1, description: 'Biến trở con chạy điều chỉnh' },
      { id: 'param-mode', name: 'circuitMode', label: 'Cấu hình mạch (1: Nối tiếp, 2: Song song)', unit: 'chế độ', min: 1, max: 2, defaultValue: 1, step: 1, description: 'Kiểu ghép linh kiện' },
    ];
    outputs = [
      { id: 'out-Rtd', label: 'Điện trở tương đương Rtd', unit: 'Ω', formulaDescription: 'Nối tiếp: R1 + R2; Song song: (R1*R2)/(R1+R2)' },
      { id: 'out-I', label: 'Cường độ dòng điện tổng I', unit: 'Ampere (A)', formulaDescription: 'I = U / Rtd' },
      { id: 'out-P', label: 'Công suất tiêu thụ P', unit: 'Watt (W)', formulaDescription: 'P = U * I' },
      { id: 'out-Q', label: 'Nhiệt lượng tỏa ra trong 60s', unit: 'Joule (J)', formulaDescription: 'Q = I² * Rtd * t' },
    ];
    quests = [
      { id: 'quest-1', title: 'Khởi tạo nguồn điện an toàn', prompt: 'Điều chỉnh điện áp U = 12V và điện trở tổng Rtd = 20Ω', conditionDescription: 'voltage == 12 && Rtd == 20', points: 30 },
      { id: 'quest-2', title: 'Đạt dòng điện định mức 1.5A', prompt: 'Điều chỉnh biến trở R2 để dòng điện đạt chính xác I = 1.5A', conditionDescription: 'I >= 1.45 && I <= 1.55', points: 35 },
      { id: 'quest-3', title: 'Khảo sát công suất cực đại', prompt: 'Đạt công suất tiêu thụ mạch điện trên 20W mà không gây quá dòng', conditionDescription: 'P >= 20', points: 35 },
    ];
    quizQuestions = [
      {
        id: 'q-c-1',
        type: 'multiple-choice',
        question: 'Khi giữ nguyên hiệu điện thế U giữa hai đầu dây dẫn và tăng điện trở R lên gấp 3 lần thì cường độ dòng điện I sẽ:',
        options: ['Giảm đi 3 lần', 'Tăng lên 3 lần', 'Không đổi', 'Tăng lên 9 lần'],
        correctAnswer: 0,
        points: 2.5,
        explanation: 'Theo định luật Ohm I = U / R, I tỉ lệ nghịch với điện trở R.',
      },
      {
        id: 'q-c-2',
        type: 'multiple-choice',
        question: 'Trong đoạn mạch gồm hai điện trở R1 = 10Ω và R2 = 15Ω mắc nối tiếp vào nguồn U = 12V, cường độ dòng điện trong mạch là:',
        options: ['0.48 A', '2.0 A', '1.2 A', '0.8 A'],
        correctAnswer: 0,
        points: 2.5,
        explanation: 'Rtd = R1 + R2 = 25Ω. Cường độ dòng điện I = U / Rtd = 12 / 25 = 0.48 A.',
      },
      {
        id: 'q-c-3',
        type: 'essay',
        question: 'Tại sao trong mạng điện gia đình, các thiết bị điện (quạt, đèn, tivi) lại được mắc song song với nhau mà không mắc nối tiếp?',
        points: 5.0,
        explanation: 'Mắc song song giúp các thiết bị hoạt động độc lập (nếu một thiết bị hỏng thì các thiết bị khác vẫn hoạt động bình thường) và đều nhận đúng hiệu điện thế định mức 220V của lưới điện.',
      },
    ];
  }
  // 3. Nhóm bài về Hóa học & Độ pH & Chuẩn độ & Phản ứng
  else if (combined.includes('ph') || combined.includes('axit') || combined.includes('bazo') || combined.includes('chuẩn độ') || combined.includes('hóa')) {
    engineType = 'chemistry';
    diagramType = 'reaction';
    formula = '\\text{pH} = -\\log_{10}[\\text{H}^+] \\quad | \\quad [\\text{H}^+][\\text{OH}^-] = 10^{-14} \\quad | \\quad C_A V_A = C_B V_B';
    phenomenon =
      'Độ pH là chỉ số đo hoạt độ của ion H+ trong dung dịch, biểu thị tính axit hay bazơ. Phản ứng trung hòa giữa axit mạnh và bazơ mạnh tạo thành muối và nước, đưa pH của hệ về vùng trung tính 7.0.';
    objective =
      'Quan sát sự đổi màu chất chỉ thị, đo chỉ số pH theo nồng độ chất tan và thực hiện phản ứng chuẩn độ dung dịch axit - bazơ.';
    parameters = [
      { id: 'param-va', name: 'volAcid', label: 'Thể tích dung dịch Axit HCl', unit: 'mL', min: 10, max: 100, defaultValue: 25, step: 5, description: 'Lượng axit ban đầu trong bình tam giác' },
      { id: 'param-ca', name: 'concAcid', label: 'Nồng độ HCl ban đầu', unit: 'M', min: 0.01, max: 1.0, defaultValue: 0.1, step: 0.01, description: 'Nồng độ mol của dung dịch axit' },
      { id: 'param-vb', name: 'volBase', label: 'Thể tích Bazơ NaOH nhỏ vào', unit: 'mL', min: 0, max: 60, defaultValue: 0, step: 1, description: 'Lượng NaOH xả từ buret xuống' },
      { id: 'param-cb', name: 'concBase', label: 'Nồng độ dung dịch NaOH', unit: 'M', min: 0.01, max: 1.0, defaultValue: 0.1, step: 0.01, description: 'Nồng độ bazơ chuẩn' },
    ];
    outputs = [
      { id: 'out-pH', label: 'Chỉ số pH dung dịch', unit: 'đơn vị pH', formulaDescription: 'Tính theo lượng H+ dư hoặc OH- dư trong tổng thể tích' },
      { id: 'out-color', label: 'Màu chất thị Phenolphthalein', unit: 'màu sắc', formulaDescription: 'Không màu (pH < 8.3) ➔ Hồng tím (pH >= 8.3)' },
      { id: 'out-Veq', label: 'Thể tích NaOH tại điểm tương đương', unit: 'mL', formulaDescription: 'V_eq = (Ca * Va) / Cb' },
    ];
    quests = [
      { id: 'quest-1', title: 'Xác định môi trường Axit mạnh', prompt: 'Quan sát dung dịch HCl ban đầu có pH xấp xỉ 1.0', conditionDescription: 'pH <= 1.5', points: 30 },
      { id: 'quest-2', title: 'Tiến sát điểm tương đương', prompt: 'Nhỏ NaOH từ buret để đạt pH trong khoảng 6.0 đến 8.0', conditionDescription: 'pH >= 6.0 && pH <= 8.0', points: 35 },
      { id: 'quest-3', title: 'Chuyển màu chỉ thị hồng tím', prompt: 'Cho dư nhẹ NaOH để dung dịch đổi màu hồng tím rõ nét (pH > 9.0)', conditionDescription: 'pH >= 9.0', points: 35 },
    ];
    quizQuestions = [
      {
        id: 'q-ch-1',
        type: 'multiple-choice',
        question: 'Một dung dịch có nồng độ ion [H+] = 10⁻³ M. Độ pH của dung dịch này bằng bao nhiêu và có môi trường gì?',
        options: ['pH = 3, môi trường axit', 'pH = 11, môi trường bazơ', 'pH = 3, môi trường trung tính', 'pH = 7, môi trường axit'],
        correctAnswer: 0,
        points: 2.5,
        explanation: 'pH = -log[H+] = -log(10⁻³) = 3. Do pH < 7 nên đây là môi trường axit.',
      },
      {
        id: 'q-ch-2',
        type: 'multiple-choice',
        question: 'Tại điểm tương đương của phản ứng chuẩn độ HCl bằng NaOH, chất chỉ thị Phenolphthalein sẽ chuyển sang màu gì?',
        options: ['Vừa chớm chuyển sang màu hồng nhạt bền vững', 'Chuyển sang màu đỏ thẫm', 'Không đổi màu', 'Chuyển sang màu xanh lam'],
        correctAnswer: 0,
        points: 2.5,
        explanation: 'Phenolphthalein không màu trong axit và chuyển sang hồng nhạt bền trong khoảng pH ~ 8.2 - 8.3.',
      },
      {
        id: 'q-ch-3',
        type: 'essay',
        question: 'Trong nông nghiệp, tại sao người nông dân thường bón vôi bột (CaO hoặc Ca(OH)₂) cho các vùng đất chua (đất phèn)? Giải thích cơ chế hóa học.',
        points: 5.0,
        explanation: 'Đất chua là đất có nồng độ ion H+ cao (pH < 6.5). Vôi tôi sinh ra bazơ Ca(OH)₂ trung hòa bớt H+ trong đất (Ca(OH)₂ + 2H+ ➔ Ca²⁺ + 2H₂O), giúp nâng độ pH của đất về vùng thích hợp cho cây trồng sinh trưởng.',
      },
    ];
  }
  // 4. Nhóm bài về Sinh học & Phân bào & Di truyền & Tế bào
  else if (combined.includes('sinh') || combined.includes('tế bào') || combined.includes('phân bào') || combined.includes('nguyên phân') || combined.includes('di truyền')) {
    engineType = 'biology';
    diagramType = 'cell';
    formula = '2^n \\text{ (số tế bào con)} \\quad | \\quad 2n \\rightarrow 2n \\text{ (nguyên phân)} \\quad | \\quad 2n \\rightarrow n \\text{ (giảm phân)}';
    phenomenon =
      'Quá trình nguyên phân đảm bảo truyền đạt nguyên vẹn bộ nhiễm sắc thể lưỡng bội 2n qua các thế hệ tế bào chất. Bốn kỳ nối tiếp (Kỳ đầu, Kỳ giữa, Kỳ sau, Kỳ cuối) phối hợp chính xác nhờ thoi phân bào và tâm động.';
    objective =
      'Quan sát biến thái hình thái của nhiễm sắc thể qua 4 kỳ của nguyên phân; tính toán số lượng NST và crômatit tại mỗi giai đoạn.';
    parameters = [
      { id: 'param-2n', name: 'chromosomeNum', label: 'Bộ NST lưỡng bội 2n', unit: 'chiếc', min: 4, max: 46, defaultValue: 8, step: 2, description: 'Số lượng NST đặc trưng loài' },
      { id: 'param-phase', name: 'phaseIndex', label: 'Kỳ phân bào (1: Đầu, 2: Giữa, 3: Sau, 4: Cuối)', unit: 'giai đoạn', min: 1, max: 4, defaultValue: 2, step: 1, description: 'Trạng thái tế bào' },
      { id: 'param-cycles', name: 'cycles', label: 'Số đợt phân bào liên tiếp k', unit: 'lần', min: 1, max: 5, defaultValue: 2, step: 1, description: 'Số chu kỳ nguyên sinh' },
    ];
    outputs = [
      { id: 'out-cells', label: 'Số tế bào con tạo thành', unit: 'tế bào', formulaDescription: 'N = 2^k' },
      { id: 'out-nst', label: 'Trạng thái NST tại kỳ đang chọn', unit: 'cấu trúc', formulaDescription: 'Kỳ giữa: 2n kép xếp 1 hàng; Kỳ sau: 4n đơn phân ly về 2 cực' },
    ];
    quests = [
      { id: 'quest-1', title: 'Quan sát mặt phẳng xích đạo', prompt: 'Chuyển sang Kỳ giữa để quan sát các NST co xoắn cực đại tập trung trên mặt phẳng xích đạo', conditionDescription: 'phaseIndex == 2', points: 30 },
      { id: 'quest-2', title: 'Quan sát sự phân ly NST', prompt: 'Chuyển sang Kỳ sau để quan sát các cromatit tách nhau tại tâm động tiến về 2 cực', conditionDescription: 'phaseIndex == 3', points: 35 },
      { id: 'quest-3', title: 'Tính toán tế bào sinh sản', prompt: 'Thiết lập số lần nguyên phân k = 3 và kiểm tra số tế bào con đạt 8 tế bào', conditionDescription: 'cycles == 3', points: 35 },
    ];
    quizQuestions = [
      {
        id: 'q-b-1',
        type: 'multiple-choice',
        question: 'Trong quá trình nguyên phân, các nhiễm sắc thể co xoắn cực đại và tập trung thành 1 hàng trên mặt phẳng xích đạo ở kỳ nào?',
        options: ['Kỳ giữa', 'Kỳ đầu', 'Kỳ sau', 'Kỳ cuối'],
        correctAnswer: 0,
        points: 2.5,
        explanation: 'Ở kỳ giữa, NST co xoắn cực đại có hình dạng đặc trưng nhất và xếp thành 1 hàng trên mặt phẳng xích đạo của thoi phân bào.',
      },
      {
        id: 'q-b-2',
        type: 'multiple-choice',
        question: 'Một tế bào ruồi giấm có 2n = 8 nguyên phân liên tiếp 3 lần sẽ tạo ra bao nhiêu tế bào con?',
        options: ['8 tế bào', '6 tế bào', '16 tế bào', '24 tế bào'],
        correctAnswer: 0,
        points: 2.5,
        explanation: 'Số tế bào con tạo thành sau k lần nguyên phân là 2^k = 2³ = 8 tế bào.',
      },
      {
        id: 'q-b-3',
        type: 'essay',
        question: 'Nêu ý nghĩa sinh học và thực tiễn của quá trình nguyên phân đối với sinh vật đa bào?',
        points: 5.0,
        explanation: 'Nguyên phân giúp cơ thể lớn lên, thay thế các tế bào già cỗi và mô bị tổn thương. Trong thực tiễn, nguyên phân là cơ sở của các phương pháp nhân giống sinh dưỡng (giâm cành, chiết cành, nuôi cấy mô tế bào).',
      },
    ];
  }
  // 5. Mặc định cho các môn học khác / KHTN chung
  else {
    engineType = 'physics';
    diagramType = 'graph';
    formula = 'y = f(x_1, x_2, t) \\quad | \\quad \\Delta E = 0';
    phenomenon =
      'Hệ thống mô phỏng tương tác thời gian thực tái hiện các quy luật định lượng, hỗ trợ thu thập số liệu thực nghiệm và kiểm chứng mô hình lý thuyết theo phương pháp giáo dục STEM.';
    objective = `Thực hành đo lường, khảo sát mối quan hệ giữa các biến số trong bài "${title}" và rút ra kết luận khoa học.`;
    parameters = [
      { id: 'param-v1', name: 'inputParamA', label: 'Thông số điều khiển A', unit: 'đơn vị', min: 1, max: 100, defaultValue: 20, step: 1, description: 'Biến số độc lập thứ nhất' },
      { id: 'param-v2', name: 'inputParamB', label: 'Thông số điều khiển B', unit: 'đơn vị', min: 1, max: 50, defaultValue: 10, step: 1, description: 'Biến số độc lập thứ hai' },
      { id: 'param-time', name: 'sampleTime', label: 'Thời gian khảo sát t', unit: 'giây', min: 1, max: 60, defaultValue: 10, step: 1, description: 'Chu kỳ lấy mẫu thí nghiệm' },
    ];
    outputs = [
      { id: 'out-result', label: 'Kết quả đo đạc tổng hợp', unit: 'chỉ số', formulaDescription: 'Kết quả phản hồi của hệ thống' },
      { id: 'out-rate', label: 'Tốc độ biến thiên', unit: '%', formulaDescription: 'Tỉ số tương quan giữa các thông số' },
    ];
    quests = [
      { id: 'quest-1', title: 'Khởi tạo hệ thống', prompt: 'Thiết lập thông số A = 20 và B = 10', conditionDescription: 'inputParamA == 20 && inputParamB == 10', points: 30 },
      { id: 'quest-2', title: 'Khảo sát biến thiên', prompt: 'Tăng thông số A lên trên 50 và quan sát biểu đồ đồ thị', conditionDescription: 'inputParamA >= 50', points: 35 },
      { id: 'quest-3', title: 'Tối ưu hóa chỉ số', prompt: 'Điều chỉnh hệ thống đạt tốc độ phản hồi cao nhất', conditionDescription: 'sampleTime >= 30', points: 35 },
    ];
    quizQuestions = [
      {
        id: 'q-g-1',
        type: 'multiple-choice',
        question: `Yếu tố cốt lõi cần ghi nhớ khi khảo sát nội dung "${title}" là gì?`,
        options: ['Mối quan hệ nhân quả định lượng giữa các biến số', 'Chỉ nhìn kết quả mà không cần đo', 'Các đại lượng thay đổi ngẫu nhiên', 'Không cần tuân theo nguyên lý bảo toàn'],
        correctAnswer: 0,
        points: 2.5,
        explanation: 'Mọi hiện tượng tự nhiên đều tuân theo các định luật và nguyên lý bảo toàn khách quan.',
      },
      {
        id: 'q-g-2',
        type: 'multiple-choice',
        question: 'Tại sao việc mô phỏng thí nghiệm ảo lại giúp nâng cao hiệu quả học tập?',
        options: ['Giúp trực quan hóa bản chất và cho phép thử nghiệm an toàn, nhanh chóng', 'Thay thế việc làm bài tập', 'Chỉ dùng để minh họa tĩnh', 'Không có giá trị thực nghiệm'],
        correctAnswer: 0,
        points: 2.5,
        explanation: 'Thí nghiệm ảo cho phép thay đổi thông số linh hoạt và quan sát diễn biến tức thời.',
      },
      {
        id: 'q-g-3',
        type: 'essay',
        question: `Hãy vận dụng kiến thức từ bài "${title}" để đề xuất một giải pháp thực tế giải quyết vấn đề trong cuộc sống.`,
        points: 5.0,
        explanation: 'Học sinh phân tích nguyên lý đã học và liên hệ giải pháp thực tế cụ thể.',
      },
    ];
  }

  const labSteps = [
    {
      step: 1,
      title: 'Khởi tạo thông số và Chuẩn bị phòng Lab',
      instruction: `Mở bài lab mô phỏng (${title}), kiểm tra các giá trị tham số mặc định trên bảng điều khiển.`,
      targetSimId: matchedSimId,
    },
    {
      step: 2,
      title: 'Tác động biến số & Ghi nhận dữ liệu',
      instruction: 'Kéo các thanh trượt điều khiển trên giao diện, quan sát đồ thị trực quan và giá trị hiển thị thời gian thực.',
      targetSimId: matchedSimId,
    },
    {
      step: 3,
      title: 'Thực hiện các Nhiệm vụ thực hành (Quests)',
      instruction: 'Hoàn thành lần lượt 3 nhiệm vụ thử thách để đạt các tích xanh kiểm tra năng lực.',
      targetSimId: matchedSimId,
    },
    {
      step: 4,
      title: 'Đánh giá & Trả lời câu hỏi kiểm tra',
      instruction: 'Đối chiếu kết quả thực nghiệm với công thức lý thuyết và hoàn thành bài trắc nghiệm ôn tập.',
      targetSimId: matchedSimId,
    },
  ];

  const theoryContent = `
### I. MỤC TIÊU BÀI THỰC HÀNH LAB (THEO CÔNG VĂN 5512/BGDĐT)
- **Năng lực nhận thức khoa học:** ${objective}
- **Kỹ năng thực hành thí nghiệm:** Rèn luyện phương pháp thu thập số liệu, quan sát chuyển động/hiện tượng và vẽ đồ thị tương quan.
- **Năng lực giải quyết vấn đề:** Vận dụng nguyên lý khoa học vào giải thích thực tiễn đời sống và kỹ thuật.

### II. NGUYÊN LÝ KHOA HỌC & BẢN CHẤT HIỆN TƯỢNG
${phenomenon}

### III. CÔNG THỨC TRỌNG TÂM
$$${formula}$$

### IV. HƯỚNG DẪN THAO TÁC TRÊN PHÒNG LAB ẢO
1. Sử dụng thanh trượt bên cạnh để thay đổi các thông số đầu vào.
2. Bấm nút Play để kích hoạt hoạt ảnh 60 FPS thời gian thực.
3. Theo dõi bảng chỉ số Output và tích xanh các nhiệm vụ (Quests).
`.trim();

  return {
    id: `lab-custom-${Date.now()}`,
    title: `${title} (Mô phỏng Lab GDPT 2018)`,
    description,
    subject,
    grade,
    type: 'lab',
    theoryContent,
    labSteps,
    quizQuestions,
    simulationData: {
      engineType,
      diagramType,
      objective,
      phenomenon,
      formula,
      variables: parameters.map(p => p.name),
      parameters,
      outputs,
      quests,
    },
    authorId,
    authorName,
    createdAt: new Date().toISOString(),
  };
}

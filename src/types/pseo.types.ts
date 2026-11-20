import { SubjectId, GradeLevel, SchoolLevel } from './simulation.types';

export interface SeoContent {
  objective: string;          // Mục tiêu bài thí nghiệm/bài học
  variables: string[];        // Các thông số/biến số có thể tương tác trong lab
  phenomenon: string;         // Mô tả hiện tượng & giải thích bản chất khoa học/ngữ pháp
  formulaOrGrammar: string;   // Công thức trọng tâm hoặc cấu trúc ngữ pháp
  commonMistakes: string;     // Lưu ý/lỗi sai thường gặp của học sinh
}

export interface QuizItem {
  question: string;
  options: string[];
  answer: string;             // Đáp án đúng (text của đáp án)
  explanation: string;        // Giải thích chi tiết bản chất
}

export interface LabSeoItem {
  id: string;                 // Khớp với simulationId (e.g. "chem-atom-builder")
  slug: string;               // URL thân thiện chuẩn SEO, e.g. "mo-phong-cau-tao-nguyen-tu-hoa-hoc-7"
  title: string;              // Tiêu đề chuẩn SEO chứa tên bài học, môn, lớp, GDPT 2018
  titleEn?: string;
  subject: SubjectId;         // e.g. "hoa-hoc", "vat-ly", "khtn", "toan", "hinh-hoc", "sinh-hoc", "tin-hoc", "dia-ly", "tieng-anh"
  subjectName: string;        // Tên hiển thị có dấu (e.g. "Hóa học", "Khoa học Tự nhiên")
  grade: GradeLevel;          // 6 đến 12
  level: SchoolLevel;         // "THCS" | "THPT"
  textbooks: string[];        // ["Kết nối tri thức", "Chân trời sáng tạo", "Cánh diều"]
  description: string;        // Meta description 150-160 ký tự
  curriculumCode: string;     // e.g. "GDPT2018-HOA7-C2"
  isImplemented: boolean;
  technology: string;
  seoContent: SeoContent;
  quizzes: QuizItem[];
  relatedSlugs: string[];     // Danh sách slug các bài lab liên quan
  updatedAt?: string;
}

export interface SubjectSeoInfo {
  id: SubjectId;
  name: string;
  nameEn: string;
  description: string;
  grades: GradeLevel[];
  color: string;
  iconName: string;
}

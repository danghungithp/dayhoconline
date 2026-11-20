import { LabSeoItem, SubjectSeoInfo } from '../types/pseo.types';

export const SUBJECT_SEO_LIST: SubjectSeoInfo[] = [
  {
    id: 'khtn',
    name: 'Khoa học Tự nhiên',
    nameEn: 'Natural Sciences (Physics - Chemistry - Biology)',
    description: 'Tổng hợp các phòng thí nghiệm ảo môn Khoa học Tự nhiên THCS chuẩn GDPT 2018: Vật lý, Hóa học và Sinh học tích hợp.',
    grades: [6, 7, 8, 9],
    color: '#06b6d4',
    iconName: 'FlaskConical',
  },
  {
    id: 'hoa-hoc',
    name: 'Hóa học',
    nameEn: 'Chemistry',
    description: 'Thí nghiệm ảo Hóa học tương tác 60 FPS: Cấu tạo nguyên tử Bohr, phản ứng hóa học, cân bằng phương trình, bảo toàn khối lượng và mô hình phân tử 3D.',
    grades: [7, 8, 9, 10, 11, 12],
    color: '#0ea5e9',
    iconName: 'FlaskConical',
  },
  {
    id: 'vat-ly',
    name: 'Vật lý',
    nameEn: 'Physics',
    description: 'Phòng thực hành ảo Vật lý: Cơ học chuyển động, ném xiên, lực đẩy Ác-si-mét, quang học phản xạ - khúc xạ gương và dao động sóng âm.',
    grades: [6, 7, 8, 9, 10, 11, 12],
    color: '#f59e0b',
    iconName: 'Zap',
  },
  {
    id: 'toan',
    name: 'Toán học',
    nameEn: 'Mathematics',
    description: 'Mô phỏng toán học trực quan: Đồ thị hàm số bậc hai Parabol, hệ phương trình, số nguyên, phân số, tỉ lệ thuận nghịch và xác suất thực nghiệm.',
    grades: [6, 7, 8, 9, 10, 11, 12],
    color: '#3b82f6',
    iconName: 'TrendingUp',
  },
  {
    id: 'hinh-hoc',
    name: 'Hình học',
    nameEn: 'Geometry & 3D Spatial Geometry',
    description: 'Hình học tương tác và không gian 3D trải phẳng (Net Unfolding): Hình chóp, lăng trụ, nón, trụ, tam giác bằng nhau và định lý Pytago.',
    grades: [6, 7, 8, 9, 10, 11, 12],
    color: '#6366f1',
    iconName: 'Box',
  },
  {
    id: 'sinh-hoc',
    name: 'Sinh học',
    nameEn: 'Biology & Genetics',
    description: 'Thí nghiệm ảo Sinh học: Phép lai phân li Men-đen, bảng Punnett di truyền, cấu tạo tế bào thực vật (Nhân ADN, Ty thể, Lục lạp) và nguyên phân.',
    grades: [7, 8, 9, 10, 11, 12],
    color: '#10b981',
    iconName: 'Dna',
  },
  {
    id: 'tin-hoc',
    name: 'Tin học',
    nameEn: 'Computer Science & Informatics',
    description: 'Phòng Lab Tin học số: Hệ đếm nhị phân 8-bit, chuyển đổi Thập phân - Hex - ASCII và mạch cổng logic AND, OR, NOT, XOR.',
    grades: [6, 7, 8, 9, 10, 11, 12],
    color: '#8b5cf6',
    iconName: 'Cpu',
  },
  {
    id: 'dia-ly',
    name: 'Địa lý',
    nameEn: 'Geography',
    description: 'Mô phỏng Địa lý tự nhiên: Chuyển động tự quay của Trái Đất, hiện tượng 4 mùa theo quỹ đạo quanh Mặt Trời và bảng múi giờ thế giới.',
    grades: [6, 7, 8, 9, 10, 11, 12],
    color: '#14b8a6',
    iconName: 'Globe',
  },
  {
    id: 'tieng-anh',
    name: 'Tiếng Anh',
    nameEn: 'English Grammar & Fluency',
    description: 'Học tiếng Anh trực quan: Trục thời gian 12 thì tương tác, chuyển đổi câu chủ động sang bị động và luyện nói với công nghệ Web Speech.',
    grades: [6, 7, 8, 9, 10, 11, 12],
    color: '#f43f5e',
    iconName: 'BookOpen',
  },
];

export const LABS_PSEO_DATA: LabSeoItem[] = [
  // 1. Cấu tạo Nguyên tử - Hóa học / KHTN 7
  {
    id: 'chem-atom-builder',
    slug: 'mo-phong-cau-tao-nguyen-tu-hoa-hoc-7',
    title: 'Mô phỏng Cấu tạo Nguyên tử, Ion & Ghép Phân tử — Hóa học Lớp 7 (GDPT 2018)',
    titleEn: 'Visual Atom Builder, Isotopes, Ions & Molecule Formation - Chemistry Grade 7',
    subject: 'khtn',
    subjectName: 'Khoa học Tự nhiên (Hóa học)',
    grade: 7,
    level: 'THCS',
    textbooks: ['Kết nối tri thức', 'Chân trời sáng tạo', 'Cánh diều'],
    description: 'Thí nghiệm ảo lắp ráp Proton, Neutron, Electron. Xác định số hiệu Z, số khối A, điện tích ion và mô hình phân tử H2O, CO2, NaCl chuẩn GDPT 2018.',
    curriculumCode: 'GDPT2018-KHTN7-C2',
    isImplemented: true,
    technology: 'canvas2d',
    seoContent: {
      objective: 'Học sinh nắm vững thành phần cấu tạo nguyên tử gồm hạt nhân (Proton mang điện dương, Neutron không mang điện) và lớp vỏ Electron mang điện âm; hiểu khái niệm số hiệu nguyên tử Z, số khối A, nguyên tử trung hòa về điện và sự hình thành Ion / Liên kết hóa học.',
      variables: [
        'Số hạt Proton (1 đến 20) trong hạt nhân',
        'Số hạt Neutron trong hạt nhân (xác định đồng vị & độ bền)',
        'Số hạt Electron ở các lớp vỏ K, L, M, N (tối đa 2, 8, 8, 2)',
        'Chế độ xem phân tử mẫu: H2, O2, H2O, CO2, CH4, NH3, NaCl'
      ],
      phenomenon: 'Khi số proton thay đổi, tên nguyên tố hóa học và tính chất hóa học thay đổi hoàn toàn. Khi số electron khác số proton, nguyên tử mất cân bằng điện tích và trở thành Cation (mất bớt e, điện tích dương) hoặc Anion (nhận thêm e, điện tích âm). Hạt nhân chỉ bền vững khi tỉ lệ nơtron/proton thỏa mãn điều kiện ổn định $1 \\le N/Z \\le 1.5$.',
      formulaOrGrammar: 'Số khối: A = Z + N (với Z = số proton = số electron trong nguyên tử trung hòa). Điện tích hạt nhân: q = +Z. Điện tích ion: Q = (Số Proton) - (Số Electron). Cấu hình vỏ electron tối đa lớp n: $2n^2$.',
      commonMistakes: 'Học sinh thường nhầm lẫn giữa điện tích hạt nhân (+Z) với số khối (A = Z + N); hoặc quên rằng khối lượng nguyên tử tập trung chủ yếu ở hạt nhân do khối lượng electron cực nhỏ ($m_e \\approx \\frac{1}{1836} m_p$).'
    },
    quizzes: [
      {
        question: 'Một nguyên tử có 8 proton, 8 neutron và 8 electron. Số khối A và tên nguyên tố này là gì?',
        options: [
          'A = 8, Nguyên tố Cacbon (C)',
          'A = 16, Nguyên tố Oxi (O)',
          'A = 24, Nguyên tố Magiê (Mg)',
          'A = 16, Nguyên tố Nitơ (N)'
        ],
        answer: 'A = 16, Nguyên tố Oxi (O)',
        explanation: 'Số hiệu nguyên tử Z = 8 là nguyên tố Oxi (O). Số khối A = số proton + số neutron = 8 + 8 = 16.'
      },
      {
        question: 'Khi nguyên tử Natri (Na, Z = 11) nhường đi 1 electron ở lớp vỏ ngoài cùng, ion thu được có điện tích là bao nhiêu?',
        options: ['Điện tích 1-', 'Điện tích 1+ (Na⁺)', 'Điện tích 2+', 'Trung hòa về điện'],
        answer: 'Điện tích 1+ (Na⁺)',
        explanation: 'Số proton = 11 (+11), số electron còn lại = 10 (-10). Điện tích tổng cộng = +11 - 10 = +1. Ion tạo thành là cation Na⁺.'
      },
      {
        question: 'Lớp electron thứ hai (lớp L) chứa tối đa bao nhiêu electron?',
        options: ['2 electron', '8 electron', '18 electron', '32 electron'],
        answer: '8 electron',
        explanation: 'Theo quy tắc phân bố vỏ electron, lớp thứ nhất (K) chứa tối đa 2 electron, lớp thứ hai (L) chứa tối đa 8 electron.'
      }
    ],
    relatedSlugs: [
      'mo-phong-can-bang-phuong-trinh-hoa-hoc-bao-toan-khoi-luong-8',
      'mo-phong-cac-the-cua-chat-dong-hoc-phan-tu-khtn-6',
      'mo-phong-lai-men-den-punnett-cau-tao-te-bao-sinh-hoc-9'
    ],
    updatedAt: '2026-11-20'
  },

  // 2. Hình học Không gian 3D & Trải phẳng - Toán 8
  {
    id: 'geom-quadrilaterals-thales-pyramids',
    slug: 'mo-phong-hinh-hoc-khong-gian-3d-trai-phang-toan-8',
    title: 'Mô phỏng Hình học Không gian 3D & Trải phẳng (Net Unfolding) — Toán Lớp 8 (GDPT 2018)',
    titleEn: '3D Spatial Geometry & Interactive Net Unfolding - Mathematics Grade 8',
    subject: 'hinh-hoc',
    subjectName: 'Hình học & Đo lường',
    grade: 8,
    level: 'THCS',
    textbooks: ['Kết nối tri thức', 'Chân trời sáng tạo', 'Cánh diều'],
    description: 'Mô phỏng 3D hình chóp tam giác đều, chóp tứ giác đều, hình nón, hình lăng trụ. Tương tác trải phẳng 2D, tính diện tích xung quanh và thể tích.',
    curriculumCode: 'GDPT2018-TOAN8-HH',
    isImplemented: true,
    technology: 'three3d',
    seoContent: {
      objective: 'Nhận biết đỉnh, cạnh bên, mặt đáy, chiều cao và trung đoạn của hình chóp tam giác đều, chóp tứ giác đều; trực quan hóa quá trình mở phẳng các mặt bên sang dạng lưới 2D (Net Unfolding) để hiểu bản chất công thức diện tích xung quanh và thể tích.',
      variables: [
        'Loại hình khối: Chóp tứ giác đều, Chóp tam giác đều, Lăng trụ đứng, Hình nón, Hình trụ',
        'Kích thước cạnh đáy a (từ 2 đến 10 cm)',
        'Chiều cao khối hình h (từ 3 đến 12 cm)',
        'Thanh trượt mở phẳng trải lưới 3D sang 2D (0% đến 100%)',
        'Chế độ xoay 360 độ góc nhìn không gian'
      ],
      phenomenon: 'Khi trải phẳng một khối đa diện 3D thành hình khai triển 2D, diện tích toàn phần của khối hình chính bằng tổng diện tích các đa giác phẳng thành phần cấu thành nên lưới đó. Đối với các khối có 1 đỉnh chóp, thể tích luôn bằng 1/3 thể tích của khối lăng trụ có cùng diện tích đáy và chiều cao.',
      formulaOrGrammar: 'Thể tích hình chóp đều: $V = \\frac{1}{3} S_{\\text{đáy}} \\cdot h$. Diện tích xung quanh hình chóp đều: $S_{xq} = p \\cdot d$ (trong đó p là nửa chu vi đáy, d là trung đoạn). Diện tích toàn phần: $S_{tp} = S_{xq} + S_{\\text{đáy}}$.',
      commonMistakes: 'Học sinh rất hay nhầm lẫn giữa chiều cao khối chóp h (khoảng cách từ đỉnh tới tâm đáy) với trung đoạn d (đường cao xuất phát từ đỉnh của mỗi mặt bên tam giác).'
    },
    quizzes: [
      {
        question: 'Một hình chóp tứ giác đều có cạnh đáy bằng 6 cm và chiều cao h = 4 cm. Thể tích của hình chóp đó là bao nhiêu?',
        options: ['144 cm³', '48 cm³', '24 cm³', '72 cm³'],
        answer: '48 cm³',
        explanation: 'Diện tích đáy hình vuông là $S_{\\text{đáy}} = 6 \\times 6 = 36$ cm². Thể tích $V = \\frac{1}{3} S_{\\text{đáy}} \\cdot h = \\frac{1}{3} \\times 36 \\times 4 = 48$ cm³.'
      },
      {
        question: 'Trung đoạn của hình chóp tam giác đều là đường gì?',
        options: [
          'Đường cao của mặt đáy',
          'Đường cao kẻ từ đỉnh của một mặt bên tam giác',
          'Đường nối đỉnh tới trọng tâm đáy',
          'Cạnh bên của khối chóp'
        ],
        answer: 'Đường cao kẻ từ đỉnh của một mặt bên tam giác',
        explanation: 'Trung đoạn là đường cao kẻ từ đỉnh của hình chóp đều hạ vuông góc xuống một cạnh đáy của mặt bên.'
      },
      {
        question: 'Khi trải phẳng hoàn toàn 2D một hình chóp tứ giác đều, hình khai triển gồm những hình phẳng nào?',
        options: [
          '4 hình chữ nhật và 1 hình vuông',
          '1 hình vuông ở giữa và 4 hình tam giác cân xung quanh',
          '2 hình vuông và 4 hình tam giác',
          '5 hình tam giác đều'
        ],
        answer: '1 hình vuông ở giữa và 4 hình tam giác cân xung quanh',
        explanation: 'Mặt đáy là 1 hình vuông, 4 mặt bên là 4 hình tam giác cân bằng nhau gắn liền với 4 cạnh của hình vuông đáy.'
      }
    ],
    relatedSlugs: [
      'mo-phong-tam-giac-bang-nhau-dinh-ly-pytago-toan-7',
      'mo-phong-do-thi-parabol-phuong-trinh-bac-hai-toan-9',
      'mo-phong-chuyen-dong-nem-xien-bao-toan-co-nang-vat-ly-10'
    ],
    updatedAt: '2026-11-20'
  },

  // 3. Chuyển động Ném xiên & Cơ năng - Vật lý 10
  {
    id: 'phys-projectile-collision-energy',
    slug: 'mo-phong-chuyen-dong-nem-xien-bao-toan-co-nang-vat-ly-10',
    title: 'Mô phỏng Chuyển động Ném xiên & Bảo toàn Cơ năng — Vật lý Lớp 10 (GDPT 2018)',
    titleEn: 'Projectile Motion, Trajectory Equations & Conservation of Mechanical Energy - Physics Grade 10',
    subject: 'vat-ly',
    subjectName: 'Vật lý',
    grade: 10,
    level: 'THPT',
    textbooks: ['Kết nối tri thức', 'Chân trời sáng tạo', 'Cánh diều'],
    description: 'Thí nghiệm ảo chuyển động ném xiên và ném ngang. Khảo sát góc ném tối ưu 45 độ, tầm bay xa, tầm bay cao và định luật bảo toàn cơ năng.',
    curriculumCode: 'GDPT2018-VATLY10-C2',
    isImplemented: true,
    technology: 'canvas2d',
    seoContent: {
      objective: 'Phân tích chuyển động ném xiên thành hai thành phần độc lập: chuyển động thẳng đều theo phương ngang Ox ($a_x = 0$) và chuyển động biến đổi đều theo phương thẳng đứng Oy ($a_y = -g$); kiểm chứng góc ném 45° cho tầm bay xa cực đại trong điều kiện bỏ qua lực cản không khí.',
      variables: [
        'Vận tốc ném ban đầu v0 (5 đến 50 m/s)',
        'Góc ném alpha (0 đến 90 độ)',
        'Gia tốc trọng trường g (Trái Đất 9.8 m/s², Mặt Trăng 1.62 m/s², Sao Hỏa 3.7 m/s²)',
        'Hệ số lực cản không khí k (từ 0 chân không tới cản mạnh)',
        'Vị trí bia mục tiêu xTarget (m)'
      ],
      phenomenon: 'Quỹ đạo chuyển động ném trong trọng trường là một nhánh parabol có bề lõm quay xuống dưới. Tại điểm cao nhất, vận tốc theo phương thẳng đứng $v_y = 0$, nhưng vật vẫn chuyển động với vận tốc ngang $v_x = v_0 \\cos \\alpha$. Cơ năng toàn phần gồm động năng và thế năng được bảo toàn nếu bỏ qua lực cản.',
      formulaOrGrammar: 'Phương trình quỹ đạo: $y = (\\tan \\alpha) x - \\frac{g}{2 v_0^2 \\cos^2 \\alpha} x^2$. Tầm cao cực đại: $H = \\frac{v_0^2 \\sin^2 \\alpha}{2g}$. Tầm bay xa: $L = \\frac{v_0^2 \\sin(2\\alpha)}{g}$. Cơ năng bảo toàn: $W = \\frac{1}{2} m v^2 + m g y = \\text{const}$.',
      commonMistakes: 'Nhiều học sinh lầm tưởng rằng tại điểm cao nhất của quỹ đạo ném xiên thì vận tốc của vật bằng 0. Thực tế vận tốc tại điểm cao nhất bằng vận tốc thành phần nằm ngang $v_x = v_0 \\cos \\alpha \\neq 0$.'
    },
    quizzes: [
      {
        question: 'Trong điều kiện bỏ qua lực cản của không khí, góc ném ban đầu alpha bằng bao nhiêu để vật đạt tầm bay xa lớn nhất?',
        options: ['alpha = 30°', 'alpha = 45°', 'alpha = 60°', 'alpha = 90°'],
        answer: 'alpha = 45°',
        explanation: 'Tầm bay xa $L = \\frac{v_0^2 \\sin(2\\alpha)}{g}$. Để L lớn nhất thì $\\sin(2\\alpha) = 1 \\iff 2\\alpha = 90^\\circ \\iff \\alpha = 45^\\circ$.'
      },
      {
        question: 'Tại điểm cao nhất của quỹ đạo chuyển động ném xiên, đại lượng nào sau đây triệt tiêu (bằng 0)?',
        options: [
          'Gia tốc của vật',
          'Vận tốc thành phần theo phương thẳng đứng (vy)',
          'Vận tốc thành phần theo phương ngang (vx)',
          'Động năng của vật'
        ],
        answer: 'Vận tốc thành phần theo phương thẳng đứng (vy)',
        explanation: 'Khi vật lên đến đỉnh, nó dừng đi lên theo phương thẳng đứng ($v_y = 0$) rồi bắt đầu rơi xuống, nhưng vẫn chuyển động đều theo phương ngang ($v_x = v_0 \\cos \\alpha$).'
      },
      {
        question: 'Nếu tăng vận tốc ban đầu v0 lên gấp 2 lần (giữ nguyên góc ném), tầm bay xa L sẽ thay đổi như thế nào?',
        options: [
          'Tăng lên 2 lần',
          'Tăng lên 4 lần',
          'Không đổi',
          'Giảm đi 2 lần'
        ],
        answer: 'Tăng lên 4 lần',
        explanation: 'Tầm bay xa L tỉ lệ với bình phương vận tốc ban đầu ($L \\sim v_0^2$). Do đó khi v0 tăng 2 lần thì L tăng $2^2 = 4$ lần.'
      }
    ],
    relatedSlugs: [
      'mo-phong-do-thi-parabol-phuong-trinh-bac-hai-toan-9',
      'mo-phong-luc-day-ac-si-met-khuc-xa-anh-sang-vat-ly-8',
      'mo-phong-dinh-luat-phan-xa-anh-sang-song-am-khtn-7'
    ],
    updatedAt: '2026-11-20'
  },

  // 4. 12 Thì Tiếng Anh & Bị Động - Tiếng Anh THCS & THPT
  {
    id: 'eng-present-simple-continuous',
    slug: 'mo-phong-12-thi-tieng-anh-truc-quan-cau-bi-dong',
    title: 'Mô phỏng Trực quan 12 Thì Tiếng Anh & Chuyển đổi Câu Bị Động (Passive Voice)',
    titleEn: 'Visual 12 English Tenses Timeline & Passive Voice Transformer',
    subject: 'tieng-anh',
    subjectName: 'Tiếng Anh',
    grade: 8,
    level: 'THCS',
    textbooks: ['Global Success', 'Friends Plus', 'English Discovery', 'i-Learn Smart World'],
    description: 'Học 12 thì tiếng Anh qua trục thời gian tương tác trực quan. Chuyển đổi linh hoạt câu Chủ động - Bị động và kiểm tra phát âm với Web Speech AI.',
    curriculumCode: 'GDPT2018-ENG8-U3',
    isImplemented: true,
    technology: 'speech-ai',
    seoContent: {
      objective: 'Trực quan hóa cấu trúc và ngữ nghĩa thời gian của các thì tiếng Anh (Quá khứ - Hiện tại - Tương lai kết hợp Đơn - Tiếp diễn - Hoàn thành); nắm chắc quy tắc chuyển đổi câu chủ động sang câu bị động với cấu trúc Be + V3/V-ed.',
      variables: [
        'Lựa chọn 1 trong 12 thì tiếng Anh trên ma trận thời gian',
        'Động từ gốc tương tác: write, build, teach, play, eat, paint',
        'Chế độ chuyển đổi Chủ động (Active) sang Bị động (Passive Voice)',
        'Nhận diện giọng nói Web Speech API kiểm tra phát âm tiếng Anh'
      ],
      phenomenon: 'Câu bị động (Passive Voice) được sử dụng khi đối tượng chịu tác động của hành động quan trọng hơn người thực hiện, hoặc khi người thực hiện hành động không rõ, không quan trọng hoặc hiển nhiên. Trục thời gian trực quan giúp học sinh thấy rõ thời điểm xảy ra và tính liên tục/hoàn tất của hành động.',
      formulaOrGrammar: 'Công thức tổng quát câu bị động: $S + \\text{be (chia theo thì)} + V_3/V_{\\text{ed}} + (\\text{by } O)$. Ví dụ: Present Simple: am/is/are + V3; Past Simple: was/were + V3; Present Perfect: have/has been + V3; Future Simple: will be + V3.',
      commonMistakes: 'Học sinh thường quên chia động từ "to be" theo đúng thì của câu chủ động hoặc nhầm số ít/số nhiều của tân ngữ mới chuyển thành chủ ngữ.'
    },
    quizzes: [
      {
        question: 'Chuyển câu sau sang thể bị động: "Shakespeare wrote Romeo and Juliet in 1597."',
        options: [
          'Romeo and Juliet is written by Shakespeare in 1597.',
          'Romeo and Juliet was written by Shakespeare in 1597.',
          'Romeo and Juliet had been written by Shakespeare.',
          'Romeo and Juliet was being written by Shakespeare in 1597.'
        ],
        answer: 'Romeo and Juliet was written by Shakespeare in 1597.',
        explanation: 'Câu gốc dùng thì quá khứ đơn (wrote) và tân ngữ "Romeo and Juliet" là danh từ số ít, nên thể bị động là "was written".'
      },
      {
        question: 'Dấu hiệu nhận biết đặc trưng của thì Hiện tại Hoàn thành (Present Perfect) là từ nào sau đây?',
        options: ['yesterday', 'already / since / for', 'tomorrow', 'at the moment'],
        answer: 'already / since / for',
        explanation: 'Already, since, for, just, yet là những trạng từ chỉ thời gian điển hình đi cùng thì Hiện tại hoàn thành.'
      },
      {
        question: 'Câu bị động của câu "They will construct a new bridge next year" là gì?',
        options: [
          'A new bridge will be constructed next year.',
          'A new bridge will construct next year.',
          'A new bridge is constructed next year.',
          'A new bridge was constructed next year.'
        ],
        answer: 'A new bridge will be constructed next year.',
        explanation: 'Thì tương lai đơn (will + V) khi chuyển sang bị động có cấu trúc: will + be + V3 (will be constructed).'
      }
    ],
    relatedSlugs: [
      'mo-phong-cau-tao-nguyen-tu-hoa-hoc-7',
      'mo-phong-he-nhi-phan-8-bit-mach-cong-logic-tin-hoc-8'
    ],
    updatedAt: '2026-11-20'
  },

  // 5. Đồ thị Parabol & Phương trình bậc hai - Toán 9
  {
    id: 'math-quadratic-parabola',
    slug: 'mo-phong-do-thi-parabol-phuong-trinh-bac-hai-toan-9',
    title: 'Mô phỏng Đồ thị Parabol & Nghiệm Phương trình bậc hai — Toán Lớp 9 (GDPT 2018)',
    titleEn: 'Interactive Parabola Grapher & Quadratic Equation Roots Explorer - Math Grade 9',
    subject: 'toan',
    subjectName: 'Toán học (Đại số)',
    grade: 9,
    level: 'THCS',
    textbooks: ['Kết nối tri thức', 'Chân trời sáng tạo', 'Cánh diều'],
    description: 'Vẽ đồ thị hàm số bậc hai y = ax² + bx + c trực quan. Thay đổi hệ số a, b, c quan sát tọa độ đỉnh, trục đối xứng và số giao điểm với trục hoành theo biệt thức Delta.',
    curriculumCode: 'GDPT2018-TOAN9-DS',
    isImplemented: true,
    technology: 'graph',
    seoContent: {
      objective: 'Hiểu mối liên hệ hình học giữa đồ thị hàm số bậc hai parabol $y = ax^2 + bx + c$ với nghiệm của phương trình bậc hai tương ứng thông qua dấu của biệt thức $\\Delta = b^2 - 4ac$.',
      variables: [
        'Hệ số a (từ -5 đến 5, a ≠ 0 - quyết định bề lõm quay lên hay xuống)',
        'Hệ số b (từ -10 đến 10 - làm lệch trục đối xứng)',
        'Hệ số c (từ -10 đến 10 - giao điểm với trục tung Oy tại (0, c))',
        'Hiển thị tọa độ đỉnh Parabol I và phương trình trục đối xứng'
      ],
      phenomenon: 'Khi a > 0, bề lõm hướng lên trên, đỉnh I là điểm thấp nhất (cực tiểu); khi a < 0, bề lõm hướng xuống dưới, đỉnh I là điểm cao nhất (cực đại). Số giao điểm của parabol với trục hoành Ox bằng chính xác số nghiệm phân biệt của phương trình bậc hai: Δ > 0 cắt tại 2 điểm; Δ = 0 tiếp xúc tại 1 điểm (nghiệm kép); Δ < 0 không cắt trục hoành (vô nghiệm thực).',
      formulaOrGrammar: 'Biệt thức: $\\Delta = b^2 - 4ac$. Tọa độ đỉnh Parabol: $I\\left(-\\frac{b}{2a}; -\\frac{\\Delta}{4a}\\right)$. Trục đối xứng: $x = -\\frac{b}{2a}$. Công thức nghiệm: $x_{1,2} = \\frac{-b \\pm \\sqrt{\\Delta}}{2a}$. Định lý Vi-ét: $x_1 + x_2 = -\\frac{b}{a}$, $x_1 x_2 = \\frac{c}{a}$.',
      commonMistakes: 'Học sinh hay quên điều kiện $a \\neq 0$ để hàm số là bậc hai, hoặc nhầm dấu hoành độ đỉnh $x_I = -\\frac{b}{2a}$ thành $+\\frac{b}{2a}$.'
    },
    quizzes: [
      {
        question: 'Đồ thị hàm số y = 2x² - 4x + 1 có tọa độ đỉnh I là điểm nào?',
        options: ['I(1; -1)', 'I(-1; 7)', 'I(2; 1)', 'I(1; 1)'],
        answer: 'I(1; -1)',
        explanation: 'Hoành độ đỉnh $x_I = -\\frac{b}{2a} = -\\frac{-4}{2 \\times 2} = 1$. Tung độ $y_I = 2(1)^2 - 4(1) + 1 = -1$. Tọa độ đỉnh là I(1; -1).'
      },
      {
        question: 'Khi biệt thức Delta < 0, đồ thị hàm số y = ax² + bx + c có mối quan hệ như thế nào với trục hoành Ox?',
        options: [
          'Cắt trục hoành tại 2 điểm phân biệt',
          'Tiếp xúc với trục hoành tại đúng 1 điểm',
          'Không cắt và không có điểm chung với trục hoành Ox',
          'Trùng với trục hoành'
        ],
        answer: 'Không cắt và không có điểm chung với trục hoành Ox',
        explanation: 'Khi $\\Delta < 0$, phương trình $ax^2 + bx + c = 0$ vô nghiệm, do đó đồ thị parabol nằm hoàn toàn về một phía so với trục Ox (không giao nhau).'
      },
      {
        question: 'Trục đối xứng của Parabol y = -x² + 6x - 5 là đường thẳng nào?',
        options: ['x = 3', 'x = -3', 'y = 3', 'x = 6'],
        answer: 'x = 3',
        explanation: 'Trục đối xứng có phương trình $x = -\\frac{b}{2a} = -\\frac{6}{2 \\times (-1)} = 3$.'
      }
    ],
    relatedSlugs: [
      'mo-phong-chuyen-dong-nem-xien-bao-toan-co-nang-vat-ly-10',
      'mo-phong-hinh-hoc-khong-gian-3d-trai-phang-toan-8'
    ],
    updatedAt: '2026-11-20'
  },

  // 6. Định luật Phản xạ ánh sáng & Sóng âm - KHTN 7
  {
    id: 'phys-light-optics-sound',
    slug: 'mo-phong-dinh-luat-phan-xa-anh-sang-song-am-khtn-7',
    title: 'Mô phỏng Định luật Phản xạ Ánh sáng & Sóng âm — KHTN Lớp 7 (GDPT 2018)',
    titleEn: 'Law of Reflection, Flat/Curved Mirrors & Acoustic Wave Generator - Science Grade 7',
    subject: 'khtn',
    subjectName: 'Khoa học Tự nhiên (Vật lý)',
    grade: 7,
    level: 'THCS',
    textbooks: ['Kết nối tri thức', 'Chân trời sáng tạo', 'Cánh diều'],
    description: 'Thí nghiệm ảo chiếu tia sáng đến gương phẳng, gương cầu lồi, gương cầu lõm đo góc tới i = góc phản xạ i\'. Phát sóng âm thanh thực nghiệm Web Audio.',
    curriculumCode: 'GDPT2018-KHTN7-P2',
    isImplemented: true,
    technology: 'canvas2d',
    seoContent: {
      objective: 'Kiểm chứng định luật phản xạ ánh sáng: tia phản xạ nằm trong mặt phẳng tới và góc phản xạ bằng góc tới (i\' = i); khảo sát sự truyền âm thanh, mối quan hệ giữa tần số với độ cao và biên độ với độ to của âm thanh.',
      variables: [
        'Loại gương: Gương phẳng, Gương cầu lồi, Gương cầu lõm',
        'Góc tới i của tia laser (0 đến 85 độ)',
        'Tần số sóng âm f (100 Hz đến 2000 Hz) phát qua loa Web Audio API',
        'Biên độ dao động âm thanh (độ to từ 0 đến 100%)'
      ],
      phenomenon: 'Khi tia sáng gặp mặt gương, nó bị hắt trở lại môi trường trong suốt ban đầu theo định luật phản xạ ánh sáng. Sóng âm là sóng cơ lan truyền trong môi trường vật chất (rắn, lỏng, khí). Dao động càng nhanh (tần số càng lớn) thì âm phát ra càng bổng (cao); biên độ dao động càng lớn thì âm phát ra càng to.',
      formulaOrGrammar: 'Định luật phản xạ ánh sáng: $i\' = i$ (với i là góc tới, i\' là góc phản xạ). Vận tốc âm thanh trong không khí: $v \\approx 343$ m/s ở 20°C. Bước sóng: $\\lambda = \\frac{v}{f}$.',
      commonMistakes: 'Học sinh rất thường xác định nhầm góc tới là góc giữa tia sáng với mặt phẳng gương. Góc tới i chuẩn luôn là góc giữa tia tới và đường pháp tuyến (đường vuông góc với mặt gương).'
    },
    quizzes: [
      {
        question: 'Chiếu một tia sáng laser tới mặt gương phẳng sao cho góc tạo bởi tia tới và mặt gương bằng 30°. Góc phản xạ i\' bằng bao nhiêu?',
        options: ['30°', '60°', '90°', '45°'],
        answer: '60°',
        explanation: 'Đường pháp tuyến vuông góc với mặt gương (90°). Vì góc giữa tia tới và mặt gương là 30° nên góc tới $i = 90^\\circ - 30^\\circ = 60^\\circ$. Theo định luật phản xạ, góc phản xạ $i\' = i = 60^\\circ$.'
      },
      {
        question: 'Độ to của âm thanh phát ra phụ thuộc chủ yếu vào đại lượng nào của dao động?',
        options: ['Tần số dao động', 'Biên độ dao động', 'Vận tốc truyền âm', 'Bước sóng'],
        answer: 'Biên độ dao động',
        explanation: 'Biên độ dao động càng lớn thì năng lượng sóng càng lớn và âm thanh nghe thấy càng to; còn tần số dao động quyết định độ cao (bổng/trầm).'
      },
      {
        question: 'Âm thanh không thể truyền qua môi trường nào sau đây?',
        options: ['Nước biển', 'Chân không', 'Thanh thép', 'Khí quyển'],
        answer: 'Chân không',
        explanation: 'Sóng âm là sóng cơ học cần có các hạt vật chất môi trường để lan truyền dao động, do đó âm thanh không truyền được trong chân không.'
      }
    ],
    relatedSlugs: [
      'mo-phong-luc-day-ac-si-met-khuc-xa-anh-sang-vat-ly-8',
      'mo-phong-chuyen-dong-nem-xien-bao-toan-co-nang-vat-ly-10'
    ],
    updatedAt: '2026-11-20'
  },

  // 7. Cân bằng PTHH & Bảo toàn Khối lượng - Hóa học / KHTN 8
  {
    id: 'chem-balancing-reactions',
    slug: 'mo-phong-can-bang-phuong-trinh-hoa-hoc-bao-toan-khoi-luong-8',
    title: 'Mô phỏng Cân bằng Phương trình Hóa học & Định luật Bảo toàn Khối lượng — KHTN 8',
    titleEn: 'Visual Chemical Equation Balancing & Law of Conservation of Mass - Chemistry Grade 8',
    subject: 'khtn',
    subjectName: 'Khoa học Tự nhiên (Hóa học)',
    grade: 8,
    level: 'THCS',
    textbooks: ['Kết nối tri thức', 'Chân trời sáng tạo', 'Cánh diều'],
    description: 'Thí nghiệm ảo cân đĩa hai bên đối chiếu khối lượng chất tham gia và sản phẩm. Đếm số nguyên tử thời gian thực để cân bằng phương trình hóa học trực quan.',
    curriculumCode: 'GDPT2018-KHTN8-C1',
    isImplemented: true,
    technology: 'canvas2d',
    seoContent: {
      objective: 'Kiểm chứng Định luật bảo toàn khối lượng của Lô-mô-nô-xốp và La-voa-di-ê; rèn luyện kỹ năng cân bằng phương trình hóa học bằng cách điều chỉnh hệ số để số lượng nguyên tử mỗi nguyên tố ở hai vế phản ứng bằng nhau.',
      variables: [
        'Chọn phản ứng mẫu: H2 + O2 -> H2O; CH4 + O2 -> CO2 + H2O; Fe + O2 -> Fe3O4; N2 + H2 -> NH3',
        'Điều chỉnh hệ số nguyên trước mỗi công thức hóa học',
        'Bật/tắt cân đĩa khối lượng đối chiếu hai bên vế',
        'Hiển thị bộ đếm số lượng nguyên tử thời gian thực'
      ],
      phenomenon: 'Trong một phản ứng hóa học, chỉ có liên kết giữa các nguyên tử thay đổi làm cho phân tử này biến đổi thành phân tử khác, còn số nguyên tử của mỗi nguyên tố được giữ nguyên vẹn. Do đó tổng khối lượng của các chất tham gia phản ứng luôn bằng tổng khối lượng của các chất sản phẩm tạo thành.',
      formulaOrGrammar: 'Định luật bảo toàn khối lượng: $m_A + m_B = m_C + m_D$ (cho phản ứng $A + B \\to C + D$). Quy tắc cân bằng: Không được tự ý thay đổi chỉ số chân của công thức hóa học, chỉ được thay đổi hệ số đặt trước công thức.',
      commonMistakes: 'Học sinh rất hay tự ý sửa chỉ số chân dưới công thức (ví dụ viết H2 + O2 -> H2O2 để cân bằng O thay vì đặt hệ số 2 trước H2O thành 2H2 + O2 -> 2H2O).'
    },
    quizzes: [
      {
        question: 'Hệ số nguyên tối giản lần lượt để cân bằng phương trình sau là gì: __ Fe + __ O2 -> __ Fe3O4?',
        options: ['3, 2, 1', '1, 2, 3', '3, 4, 1', '2, 3, 1'],
        answer: '3, 2, 1',
        explanation: 'Vế phải có 3 Fe và 4 O (O4). Ta đặt hệ số 3 trước Fe và hệ số 2 trước O2 ($2 \\times 2 = 4$): 3Fe + 2O2 -> Fe3O4.'
      },
      {
        question: 'Đốt cháy hoàn toàn 12 gam than (Cacbon - C) trong không khí thu được 44 gam khí Cacbon đioxit (CO2). Khối lượng khí oxi (O2) đã phản ứng là bao nhiêu?',
        options: ['56 gam', '32 gam', '24 gam', '16 gam'],
        answer: '32 gam',
        explanation: 'Theo định luật bảo toàn khối lượng: $m_C + m_{O_2} = m_{CO_2} \\iff 12 + m_{O_2} = 44 \\iff m_{O_2} = 44 - 12 = 32$ gam.'
      },
      {
        question: 'Tại sao khi nung nóng một thanh sắt ngoài không khí, khối lượng của thanh sắt lại tăng lên?',
        options: [
          'Vì thanh sắt nở ra vì nhiệt',
          'Vì các nguyên tử sắt đã kết hợp hóa học với khí oxi trong không khí tạo thành oxit sắt',
          'Vì thanh sắt hút thêm bụi bẩn',
          'Định luật bảo toàn khối lượng không đúng trong trường hợp này'
        ],
        answer: 'Vì các nguyên tử sắt đã kết hợp hóa học với khí oxi trong không khí tạo thành oxit sắt',
        explanation: 'Khối lượng oxit sắt sinh ra bằng khối lượng thanh sắt ban đầu cộng thêm khối lượng khí oxi đã phản ứng ($m_{oxit} = m_{Fe} + m_{O_2} > m_{Fe}$).'
      }
    ],
    relatedSlugs: [
      'mo-phong-cau-tao-nguyen-tu-hoa-hoc-7',
      'mo-phong-cac-the-cua-chat-dong-hoc-phan-tu-khtn-6'
    ],
    updatedAt: '2026-11-20'
  },

  // 8. Lai Men-đen & Cấu tạo Tế bào - Sinh học 9
  {
    id: 'bio-genetics-mendel',
    slug: 'mo-phong-lai-men-den-punnett-cau-tao-te-bao-sinh-hoc-9',
    title: 'Mô phỏng Phép lai Men-đen (Punnett) & Cấu tạo Tế bào — Sinh học Lớp 9 (GDPT 2018)',
    titleEn: 'Mendelian Genetics, Punnett Square & Cell Anatomy - Biology Grade 9',
    subject: 'sinh-hoc',
    subjectName: 'Sinh học',
    grade: 9,
    level: 'THCS',
    textbooks: ['Kết nối tri thức', 'Chân trời sáng tạo', 'Cánh diều'],
    description: 'Thí nghiệm ảo lai Men-đen: Bảng Punnett 2x2 tính tỉ lệ kiểu gen 1:2:1 và kiểu hình 3:1. Khám phá giải phẫu tế bào thực vật (Nhân ADN, Ty thể, Lục lạp).',
    curriculumCode: 'GDPT2018-SINH9-C1',
    isImplemented: true,
    technology: 'canvas2d',
    seoContent: {
      objective: 'Hiểu quy luật phân li độc lập của Men-đen thông qua phép lai một cặp tính trạng ở cây đậu Hà Lan; biết cách lập bảng Punnett để suy ra tỉ lệ kiểu gen và kiểu hình đời con; quan sát cấu tạo hiển vi tế bào thực vật gồm Nhân chứa ADN, Ty thể tạo năng lượng và Lục lạp quang hợp.',
      variables: [
        'Chọn tính trạng: Màu sắc hoa (A tím > a trắng) hoặc Dạng hạt (B vàng trơn > b xanh nhăn)',
        'Kiểu gen Bố P (AA, Aa, aa) và Kiểu gen Mẹ P (AA, Aa, aa)',
        'Chuyển đổi chế độ: Lai Men-đen (Punnett) hoặc Cấu tạo Tế bào (Cell Anatomy)',
        'Bấm xem chi tiết bào quan: Nhân, Ty thể, Lục lạp, Không bào, Vách tế bào'
      ],
      phenomenon: 'Trong quá trình phát sinh giao tử, mỗi nhân tố di truyền (alen) trong cặp phân li về một giao tử và giữ nguyên bản chất như ở cơ thể thuần chủng của P. Khi thụ tinh, các giao tử kết hợp tự do tạo nên tỉ lệ phân li kiểu hình đặc trưng ở F2 là 3 Trội : 1 Lặn (khi P là Aa x Aa).',
      formulaOrGrammar: 'Phép lai F2 (Aa x Aa): Kiểu gen: $1 AA : 2 Aa : 1 aa$ (25% AA, 50% Aa, 25% aa). Kiểu hình: $3$ Trội (75%) : $1$ Lặn (25%). Phép lai phân tích: Cá thể trội chưa biết kiểu gen lai với cá thể đồng hợp lặn aa: nếu đời con 100% trội => P là AA; nếu phân li 1 trội : 1 lặn => P là Aa.',
      commonMistakes: 'Học sinh thường nhầm lẫn giữa kiểu gen (tập hợp các gen như AA, Aa, aa) với kiểu hình (tính trạng biểu hiện ra ngoài như hoa tím, hoa trắng).'
    },
    quizzes: [
      {
        question: 'Cho hai cây đậu Hà Lan dị hợp tử hoa tím (Aa) tự thụ phấn với nhau. Tỉ lệ kiểu hình phân li ở thế hệ con F2 là bao nhiêu?',
        options: ['100% Hoa tím', '3 Hoa tím : 1 Hoa trắng', '1 Hoa tím : 1 Hoa trắng', '9 Hoa tím : 7 Hoa trắng'],
        answer: '3 Hoa tím : 1 Hoa trắng',
        explanation: 'Phép lai Aa x Aa cho tỉ lệ kiểu gen 1 AA : 2 Aa : 1 aa. Vì alen A quy định hoa tím trội hoàn toàn so với a hoa trắng nên kiểu hình là (1AA + 2Aa) = 3 hoa tím : 1aa hoa trắng (3 : 1).'
      },
      {
        question: 'Phép lai phân tích là phép lai giữa cá thể mang tính trạng trội cần xác định kiểu gen với cá thể nào?',
        options: ['Cá thể đồng hợp tử trội (AA)', 'Cá thể đồng hợp tử lặn (aa)', 'Cá thể dị hợp tử (Aa)', 'Bất kì cá thể nào'],
        answer: 'Cá thể đồng hợp tử lặn (aa)',
        explanation: 'Phép lai phân tích luôn cho lai với cơ thể đồng hợp tử lặn (aa) để kiểm tra cơ thể mang tính trạng trội là thuần chủng (AA) hay không thuần chủng (Aa).'
      },
      {
        question: 'Bào quan nào trong tế bào thực vật có vai trò hấp thụ ánh sáng mặt trời để thực hiện quá trình quang hợp?',
        options: ['Nhân tế bào', 'Ty thể', 'Lục lạp (Chloroplast)', 'Không bào'],
        answer: 'Lục lạp (Chloroplast)',
        explanation: 'Lục lạp chứa chất diệp lục có chức năng hấp thụ năng lượng quang năng để chuyển hóa CO2 và H2O thành chất hữu cơ và giải phóng khí Oxi.'
      }
    ],
    relatedSlugs: [
      'mo-phong-cau-tao-nguyen-tu-hoa-hoc-7',
      'mo-phong-chuyen-dong-trai-dat-4-mua-ngay-dem-dia-ly-6'
    ],
    updatedAt: '2026-11-20'
  },

  // 9. Hệ nhị phân & Mạch cổng Logic - Tin học 8
  {
    id: 'cs-binary-logic-gates',
    slug: 'mo-phong-he-nhi-phan-8-bit-mach-cong-logic-tin-hoc-8',
    title: 'Mô phỏng Hệ nhị phân 8-Bit & Mạch cổng Logic (AND, OR, NOT, XOR) — Tin học 8',
    titleEn: '8-Bit Binary Byte Converter & Digital Logic Gates Circuit Simulator - Computer Science Grade 8',
    subject: 'tin-hoc',
    subjectName: 'Tin học',
    grade: 8,
    level: 'THCS',
    textbooks: ['Kết nối tri thức', 'Chân trời sáng tạo', 'Cánh diều'],
    description: 'Thực hành chuyển đổi nhị phân 8-bit sang Thập phân, Hex và ASCII. Đấu nối các cổng logic số AND, OR, NOT, XOR với bóng đèn sáng và bảng chân lý trực quan.',
    curriculumCode: 'GDPT2018-TIN8-C1',
    isImplemented: true,
    technology: 'canvas2d',
    seoContent: {
      objective: 'Hiểu nguyên lý biểu diễn thông tin dạng nhị phân trong máy tính điện tử; chuyển đổi thành thạo giữa hệ đếm nhị phân (cơ số 2), thập phân (cơ số 10), thập lục phân (cơ số 16) và bảng mã ASCII; khảo sát nguyên lý hoạt động của các cổng logic số cơ bản cấu thành nên CPU.',
      variables: [
        '8 bit nhị phân (từ bit 7 đến bit 0 với trọng số 128, 64, 32, 16, 8, 4, 2, 1)',
        'Chuyển đổi tab: Bộ chuyển đổi nhị phân (Binary) hoặc Mạch cổng Logic (Gates)',
        'Loại cổng logic: AND, OR, NOT, XOR, NAND',
        'Công tắc đầu vào A và B (0 hoặc 1)'
      ],
      phenomenon: 'Mọi dữ liệu trong máy tính (văn bản, hình ảnh, âm thanh) đều được số hóa thành các chuỗi bit 0 và 1 tương ứng với mức điện áp thấp (Low/0V) và cao (High/5V). Các cổng logic thực hiện các phép toán đại số Boole để xử lý các tín hiệu số này.',
      formulaOrGrammar: 'Công thức chuyển đổi nhị phân sang thập phân: $N = \\sum_{i=0}^7 b_i \\cdot 2^i = b_7 \\cdot 128 + b_6 \\cdot 64 + \\dots + b_0 \\cdot 1$. Cổng AND: $Y = A \\cdot B$; Cổng OR: $Y = A + B$; Cổng NOT: $Y = \\bar{A}$; Cổng XOR: $Y = A \\oplus B$ (ra 1 khi A và B khác nhau).',
      commonMistakes: 'Học sinh thường tính sai thứ tự trọng số các bit (nhầm bit bên trái cùng có giá trị là 1 thay vì 128) hoặc nhầm lẫn giữa cổng OR (cho 1 khi cả hai bằng 1) với cổng XOR (cho 0 khi cả hai bằng 1).'
    },
    quizzes: [
      {
        question: 'Dãy 8-bit nhị phân 01000001 tương ứng với giá trị thập phân nào?',
        options: ['41', '65', '129', '33'],
        answer: '65',
        explanation: 'Các bit bật là bit thứ 6 (trọng số 64) và bit thứ 0 (trọng số 1). Tổng giá trị thập phân = 64 + 1 = 65 (đây cũng là mã ASCII của ký tự "A").'
      },
      {
        question: 'Cổng logic nào chỉ cho đầu ra mức 1 khi CẢ HAI đầu vào A và B đồng thời ở mức 1?',
        options: ['Cổng OR', 'Cổng AND', 'Cổng NOT', 'Cổng XOR'],
        answer: 'Cổng AND',
        explanation: 'Đúng như tên gọi AND (Và), tín hiệu ra chỉ bằng 1 khi cả A=1 VÀ B=1.'
      },
      {
        question: 'Nếu đầu vào A = 1 và B = 1, đầu ra của cổng logic XOR sẽ là bao nhiêu?',
        options: ['0', '1', '2', 'Không xác định'],
        answer: '0',
        explanation: 'Cổng XOR (Exclusive OR - Hoặc loại trừ) chỉ cho đầu ra bằng 1 khi hai tín hiệu đầu vào KHÁC NHAU. Khi cả hai cùng bằng 1, đầu ra XOR bằng 0.'
      }
    ],
    relatedSlugs: [
      'mo-phong-cau-tao-nguyen-tu-hoa-hoc-7',
      'mo-phong-chuyen-dong-trai-dat-4-mua-ngay-dem-dia-ly-6'
    ],
    updatedAt: '2026-11-20'
  },

  // 10. Chuyển động Trái Đất & 4 Mùa - Địa lý 6
  {
    id: 'geo-earth-rotation-seasons',
    slug: 'mo-phong-chuyen-dong-trai-dat-4-mua-ngay-dem-dia-ly-6',
    title: 'Mô phỏng Chuyển động Trái Đất, 4 Mùa & Ngày Đêm Luân Phiên — Địa lý Lớp 6 (GDPT 2018)',
    titleEn: 'Earth Orbit, 23.5° Tilt, Four Seasons & International Time Zones - Geography Grade 6',
    subject: 'dia-ly',
    subjectName: 'Địa lý',
    grade: 6,
    level: 'THCS',
    textbooks: ['Kết nối tri thức', 'Chân trời sáng tạo', 'Cánh diều'],
    description: 'Mô phỏng Trái Đất tự quay quanh trục nghiêng 23°27′ sinh ra ngày đêm luân phiên và chênh lệch múi giờ. Chuyển động quanh Mặt Trời sinh ra 4 Mùa và hiện tượng ngày đêm dài ngắn.',
    curriculumCode: 'GDPT2018-DIALY6-C1',
    isImplemented: true,
    technology: 'canvas2d',
    seoContent: {
      objective: 'Giải thích được các hệ quả chuyển động của Trái Đất: chuyển động tự quay quanh trục sinh ra hiện tượng ngày đêm luân phiên và giờ trên Trái Đất; chuyển động tịnh tiến quanh Mặt Trời với trục nghiêng không đổi sinh ra hiện tượng các mùa trong năm và ngày đêm dài ngắn theo mùa.',
      variables: [
        'Góc quay quỹ đạo Trái Đất quanh Mặt Trời (0 đến 360 độ)',
        'Chuyển nhanh đến 4 tiết khí: Hạ chí (22/6), Đông chí (22/12), Xuân phân (21/3), Thu phân (23/9)',
        'Góc tự quay quanh trục (0 đến 24 giờ)',
        'Bật/tắt đường Xích đạo, Chí tuyến Bắc/Nam và vùng bóng tối ngày/đêm'
      ],
      phenomenon: 'Do trục Trái Đất nghiêng một góc 23°27′ so với mặt phẳng quỹ đạo và hướng nghiêng không đổi khi chuyển động quanh Mặt Trời, nên có lúc Bắc bán cầu ngả về phía Mặt Trời (mùa hạ ở Bắc bán cầu, nhận được nhiều nhiệt và ánh sáng, ngày dài hơn đêm), có lúc Nam bán cầu ngả về phía Mặt Trời (mùa hạ ở Nam bán cầu, mùa đông ở Bắc bán cầu).',
      formulaOrGrammar: 'Chu kỳ tự quay của Trái Đất: 1 ngày đêm = 24 giờ. Trái Đất được chia thành 24 múi giờ, mỗi múi giờ rộng 15° kinh độ. Giờ Việt Nam nằm trọn vẹn trong múi giờ thứ 7 (UTC+7).',
      commonMistakes: 'Nhiều người lầm tưởng nguyên nhân sinh ra 4 mùa là do khoảng cách giữa Trái Đất và Mặt Trời thay đổi (gần Mặt Trời thì nóng, xa thì lạnh). Thực tế nguyên nhân chính là do TRỤC TRÁI ĐẤT NGHIÊNG và không đổi hướng khi quay quanh Mặt Trời.'
    },
    quizzes: [
      {
        question: 'Vào ngày Hạ chí (22 tháng 6), tia sáng Mặt Trời chiếu vuông góc với mặt đất tại đường vĩ tuyến nào?',
        options: ['Đường Xích đạo (0°)', 'Chí tuyến Bắc (23°27′ B)', 'Chí tuyến Nam (23°27′ N)', 'Vòng cực Bắc (66°33′ B)'],
        answer: 'Chí tuyến Bắc (23°27′ B)',
        explanation: 'Vào ngày 22/6 (Hạ chí), Bắc bán cầu ngả nhiều nhất về phía Mặt Trời và tia sáng chiếu thẳng góc vào đường Chí tuyến Bắc (23°27′ B).'
      },
      {
        question: 'Hiện tượng ngày và đêm luân phiên liên tục trên Trái Đất là do nguyên nhân nào sau đây?',
        options: [
          'Trái Đất có dạng hình cầu và tự quay quanh trục từ Tây sang Đông',
          'Mặt Trời chuyển động xung quanh Trái Đất',
          'Trái Đất chuyển động quanh Mặt Trời trên quỹ đạo elip',
          'Trục Trái Đất bị nghiêng 23°27′'
        ],
        answer: 'Trái Đất có dạng hình cầu và tự quay quanh trục từ Tây sang Đông',
        explanation: 'Do Trái Đất hình cầu nên Mặt Trời chỉ chiếu sáng được một nửa (ban ngày), nửa còn lại khuất trong bóng tối (ban đêm); kết hợp với việc Trái Đất tự quay quanh trục nên khắp nơi lần lượt có ngày và đêm luân phiên.'
      },
      {
        question: 'Nếu ở Luân Đôn (London - múi giờ gốc GMT+0) đang là 05:00 sáng thì ở Hà Nội (múi giờ GMT+7) đang là mấy giờ?',
        options: ['12:00 trưa cùng ngày', '22:00 tối hôm trước', '10:00 sáng cùng ngày', '14:00 chiều cùng ngày'],
        answer: '12:00 trưa cùng ngày',
        explanation: 'Hà Nội nằm ở múi giờ GMT+7, đi trước London (GMT+0) là 7 tiếng: 05:00 + 7 = 12:00 trưa cùng ngày.'
      }
    ],
    relatedSlugs: [
      'mo-phong-cau-tao-nguyen-tu-hoa-hoc-7',
      'mo-phong-he-nhi-phan-8-bit-mach-cong-logic-tin-hoc-8'
    ],
    updatedAt: '2026-11-20'
  }
];

// Helper tìm bài lab theo slug
export function getLabBySlug(slug: string): LabSeoItem | undefined {
  return LABS_PSEO_DATA.find(lab => lab.slug === slug);
}

// Helper tìm bài lab theo ID
export function getLabById(id: string): LabSeoItem | undefined {
  return LABS_PSEO_DATA.find(lab => lab.id === id);
}

// Helper lấy danh sách lab theo môn học
export function getLabsBySubject(subject: string): LabSeoItem[] {
  return LABS_PSEO_DATA.filter(lab => lab.subject === subject);
}

// Helper lấy danh sách lab theo môn và lớp
export function getLabsBySubjectAndGrade(subject: string, grade: number): LabSeoItem[] {
  return LABS_PSEO_DATA.filter(lab => lab.subject === subject && lab.grade === grade);
}

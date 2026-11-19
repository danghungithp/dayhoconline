# STEM & English Interactive Lab (GDPT Việt Nam Lớp 6 – Lớp 12)

> Nền tảng Web mô phỏng học tập tương tác đa môn theo **Chương trình Giáo dục Phổ thông (GDPT) 2018 Việt Nam**, kết hợp Toán học, Hình học không gian, Khoa học Tự nhiên, Vật lý, Hóa học và Tiếng Anh giao tiếp / ngữ pháp trực quan cùng Gia sư AI tích hợp ngữ cảnh (Context-Aware Gemini AI Tutor).

---

## 🏗️ Kiến Trúc Hệ Thống (Plugin & Modular Architecture)

Nền tảng được thiết kế theo nguyên lý **Micro-Simulation Modular Architecture**:
- Mỗi bài mô phỏng là một gói độc lập hoàn chỉnh trong `src/simulations/<subject>/<module-name>/`.
- Tách biệt rõ ràng với phần lõi nền tảng `src/core/`.
- Nạp động qua **Dynamic Code Splitting** (`React.lazy()`) thông qua `simulationRegistry.ts`.

```
src/
├── core/                                # NỀN TẢNG CHUNG (CORE PLATFORM)
│   ├── components/
│   │   ├── SandboxLayout.tsx           # Khung layout chuẩn (72% Canvas - 28% Control)
│   │   ├── AnnotationOverlay.tsx       # Lớp bút vẽ ghi chú trên màn hình cho giáo viên
│   │   ├── AITutorModal.tsx            # Hộp thoại gia sư AI theo ngữ cảnh bài lab
│   │   ├── Navbar.tsx                  # Thanh điều hướng và bộ lọc Cấp/Lớp/Môn
│   │   └── CatalogExplorer.tsx         # Trang khám phá lộ trình toàn bộ chương trình GDPT
│   └── registry/
│       └── simulationRegistry.ts       # Registry đăng ký mô phỏng, lọc và lazy-load
├── data/
│   └── curriculumCatalog.ts            # Dữ liệu danh mục chuẩn GDPT 2018 từ Lớp 6 đến Lớp 12
├── services/
│   └── geminiService.ts                # Tích hợp Gemini API & Smart Offline Pedagogical Engine
├── types/
│   └── simulation.types.ts             # Định nghĩa Type TypeScript chuẩn
├── simulations/                        # CÁC BÀI THÍ NGHIỆM MÔ PHỎNG ĐỘC LẬP
│   ├── chemistry/
│   │   └── atom-builder/               # [Module 1: Cấu tạo Nguyên tử, Ion & Phân tử]
│   │       ├── components/
│   │       ├── elementsData.ts
│   │       ├── physicsEngine.ts
│   │       ├── quests.ts
│   │       └── index.tsx
│   ├── math-geometry/
│   │   └── solid-geometry-3d/          # [Module 2: Hình học Không gian 3D & Trải phẳng]
│   │       ├── SolidScene3D.tsx        # Scene Three.js / R3F tương tác 3D & Net Unfolding
│   │       ├── ControlPanel.tsx        # Điều khiển kích thước & độ mở trải phẳng
│   │       ├── geometryMath.ts         # Tính S_đáy, S_xq, S_tp, V, trung đoạn d, đường sinh l
│   │       ├── quests.ts               # Bộ 4 nhiệm vụ tự động đánh giá
│   │       ├── presets.ts              # Mẫu sẵn Kim tự tháp, Chóp tam giác, Lăng trụ, Nón, Trụ
│   │       └── index.tsx               # Entrypoint kết nối SandboxLayout
│   ├── physics/
│   │   └── projectile-motion/          # [Module 3: Ném xiên & Bảo toàn cơ năng Vật lý 10]
│   │       ├── ProjectileCanvas.tsx    # Canvas 2D 60 FPS, vector vận tốc, bia mục tiêu, vệt đạn
│   │       ├── ControlPanel.tsx        # Điều khiển v0, góc alpha, độ cao y0, lực cản k, g
│   │       ├── physicsSolver.ts        # Bộ giải giải tích chân không & tích phân số RK4 lực cản
│   │       ├── quests.ts               # Bộ 4 nhiệm vụ bắn trúng bia, H_max, Mặt Trăng, cơ năng
│   │       ├── presets.ts              # Mẫu sẵn 45° tối ưu, vách đá, Mặt Trăng, cản gió mạnh
│   │       └── index.tsx               # Entrypoint kết nối SandboxLayout
│   ├── english/
│   │   └── visual-tenses-voice/        # [Module 4: Trực quan 12 Thì & Bị Động Tiếng Anh]
│   │       ├── TimelineAndSentenceStage.tsx # Trục thời gian SVG, khối Lego đổi câu, Web Speech API
│   │       ├── ControlPanel.tsx        # Chọn 8 thì cốt lõi, đổi bị động, lỗi hay gặp người Việt
│   │       ├── grammarEngine.ts        # Động cơ ngữ pháp 8 thì & biến đổi Active ↔ Passive
│   │       ├── quests.ts               # Bộ 4 nhiệm vụ tiếp diễn quá khứ, hoàn thành, bị động
│   │       ├── presets.ts              # Cấu hình mẫu thì & mẫu câu bị động
│   │       └── index.tsx               # Entrypoint kết nối SandboxLayout
│   └── math/
│       └── quadratic-parabola/         # [Module 5: Hệ PT 2 ẩn & Parabol y = ax² + bx + c]
│           ├── MathPlotCanvas.tsx      # Lưới tọa độ Oxy, vẽ Parabol, tiếp tuyến, giao điểm đường thẳng
│           ├── ControlPanel.tsx        # Khảo sát a, b, c, cực trị, bảng biến thiên, định thức Cramer D/Dx/Dy
│           ├── algebraSolver.ts        # Thuật toán giải hình học & đại số thuần túy
│           ├── quests.ts               # Bộ 5 nhiệm vụ tiếp xúc Ox, đỉnh cực đại, d1 // d2
│           ├── presets.ts              # 9 cấu hình mẫu đồ thị và hệ phương trình
│           └── index.tsx               # Entrypoint kết nối SandboxLayout
```

---

## 🚀 Công Nghệ Sử Dụng

- **Frontend Core:** React 19, TypeScript, Vite 6, Tailwind CSS, Lucide Icons.
- **Quản lý trạng thái & Hiệu ứng:** Zustand, canvas-confetti.
- **Công nghệ Mô phỏng:**
  - **Canvas 2D 60 FPS:** RequestAnimationFrame rendering, hạt hạ nguyên tử, dao động nhiệt & lực liên kết hạt nhân.
  - **Không gian 3D:** Three.js, `@types/three` (sẵn sàng cho hình học không gian Oxyz và tinh thể).
  - **Đồ thị & Toán:** Math.js.
  - **Ngôn ngữ:** Web Speech API (`SpeechSynthesis` & `SpeechRecognition`).
- **Gia sư AI Sư phạm (Context-Aware AI Tutor):**
  - Tự động đóng gói `AISnapshotContext` gồm: Tên bài, Môn, Lớp, Các giá trị biến số hiện thời, Trạng thái các nhiệm vụ (Quests).
  - Hỗ trợ gọi trực tiếp Google Gemini API (1.5 / 2.0 Flash) khi nhập API Key, đồng thời có **Smart Offline Pedagogical Engine** trả lời tức thì dựa trên dữ liệu trạng thái mà không bắt buộc có mạng.

---

## 🛠️ Hướng Dẫn Cài Đặt & Khởi Chạy

```bash
# 1. Cài đặt các gói phụ thuộc
npm install

# 2. Khởi chạy môi trường phát triển (Dev Server)
npm run dev

# 3. Biên dịch bản đóng gói thương mại (Production Build)
npm run build
```

---

## 📝 Cách Thêm Một Bài Mô Phỏng Mới Vào Nền Tảng

1. **Tạo thư mục mới** trong `src/simulations/<subject>/<my-simulation>/`.
2. Tạo các file:
   - `types.ts`: Định nghĩa State của bài.
   - `quests.ts`: Danh sách các nhiệm vụ `Quest` với `targetCondition: (state) => boolean`.
   - `presets.ts`: Các cấu hình thí nghiệm mẫu.
   - `components/MainView.tsx`: Canvas 2D, Three.js 3D canvas hoặc Đồ thị.
   - `components/ControlPanel.tsx`: Bộ thanh trượt, nút bấm thay đổi biến số.
   - `index.tsx`: Bọc trong `SandboxLayout` và xuất `export default`.
3. **Đăng ký module** trong `src/core/registry/simulationRegistry.ts`:
   ```typescript
   const MySimModule = lazy(() => import('../../simulations/<subject>/<my-simulation>'));
   ```

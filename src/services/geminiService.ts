import { AISnapshotContext } from '../types/simulation.types';

export interface SimulationAIContext {
  simulationId: string;
  title: string;
  subject: string;
  grade: number;
  parameters: Record<string, unknown>;
  calculatedOutputs: Record<string, unknown>;
  activeQuest?: {
    id: string;
    prompt: string;
    isCompleted: boolean;
  };
  summaryForAI: string;
}

const GEMINI_API_KEY_STORAGE = 'STEM_LAB_GEMINI_API_KEY';

export function getStoredGeminiKey(): string {
  try {
    return localStorage.getItem(GEMINI_API_KEY_STORAGE) || '';
  } catch {
    return '';
  }
}

export function setStoredGeminiKey(key: string): void {
  try {
    localStorage.setItem(GEMINI_API_KEY_STORAGE, key.trim());
  } catch (e) {
    console.error('Cannot save Gemini API key to localStorage', e);
  }
}

/**
 * Tạo prompt sư phạm giàu ngữ cảnh từ trạng thái mô phỏng
 */
export function buildTutorPrompt(
  context: AISnapshotContext,
  userQuestion: string
): string {
  const questStatusStr = context.activeQuests
    .map(q => `- Nhiệm vụ "${q.title}": ${q.completed ? 'ĐÃ HOÀN THÀNH' : 'CHƯA ĐẠT'}`)
    .join('\n');

  const stateStr = JSON.stringify(context.currentState, null, 2);

  return `
Bạn là "Gia sư AI STEM & English Lab", một chuyên gia sư phạm thân thiện, thông thái và tận tụy theo chương trình GDPT Việt Nam.
Vai trò của bạn:
1. Hướng dẫn học sinh bằng phương pháp Socratic (gợi mở tư duy, không giải bài hộ ngay).
2. Tận dụng ngữ cảnh trạng thái mô phỏng học sinh đang thao tác để giải thích hiện tượng cụ thể.
3. Liên hệ kiến thức thực tiễn cuộc sống và khuyến khích hoàn thành các nhiệm vụ thí nghiệm.

=== THÔNG TIN BÀI THÍ NGHIỆM ===
- Bài học: ${context.simulationTitle} (ID: ${context.simulationId})
- Môn học: ${context.subject.toUpperCase()} - Khối lớp: ${context.grade}
- Trạng thái các biến số hiện tại trong Lab:
${stateStr}

- Tiến độ nhiệm vụ (Quests):
${questStatusStr || 'Không có nhiệm vụ cụ thể.'}

=== CÂU HỎI HOẶC THẮC MẮC CỦA HỌC SINH ===
"${userQuestion}"

Hãy trả lời bằng tiếng Việt (hoặc tiếng Anh nếu là bài Tiếng Anh) một cách mạch lạc, súc tích, truyền cảm hứng và trực quan, có định dạng Markdown (in đậm công thức, gạch đầu dòng rõ ràng).
`.trim();
}

/**
 * Gọi Gemini API hoặc fallback sang gia sư phân tích ngữ cảnh mô phỏng
 */
export async function askGeminiTutor(
  context: AISnapshotContext,
  userQuestion: string,
  apiKey?: string
): Promise<string> {
  const activeKey = apiKey || getStoredGeminiKey();

  if (activeKey) {
    try {
      const prompt = buildTutorPrompt(context, userQuestion);
      // Gọi Gemini 2.5 Flash / 1.5 Flash REST endpoint
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${activeKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: prompt }],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 1000,
            },
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        return text;
      }
    } catch (err: any) {
      console.warn('Lỗi gọi Gemini API bên ngoài, chuyển sang Gia sư tích hợp sẵn:', err.message);
    }
  }

  // Built-in intelligent pedagogical fallback response generator based on current simulation state
  return generateContextualTutorResponse(context, userQuestion);
}

/**
 * Gia sư ngoại tuyến thông minh (Smart Offline Pedagogical Engine)
 * Phân tích trực tiếp các biến trạng thái của Atom Builder và các bài học STEM
 */
function generateContextualTutorResponse(context: AISnapshotContext, question: string): string {
  const { simulationId, currentState, activeQuests } = context;

  // Xử lý bài Nguyên tử (atom-builder)
  if (simulationId === 'chem-atom-builder') {
    const { protons = 0, neutrons = 0, electrons = 0, elementName = '', massNumber = 0, netCharge = 0, isStable = true } = currentState;

    if (protons === 0) {
      return `### 💡 Chào em! Bàn thí nghiệm nguyên tử đang trống.
- Hãy thử kéo thả hoặc nhấn dấu **+** để thêm **1 Proton** vào hạt nhân.
- Khi có 1 Proton, em sẽ tạo ra nguyên tố đầu tiên trong bảng tuần hoàn: **Hiđro (Hydrogen - H)**!
- Đừng quên bổ sung thêm electron ở lớp vỏ để nguyên tử trung hòa về điện nhé.`;
    }

    const uncompleted = activeQuests.filter(q => !q.completed);
    let advice = '';
    if (netCharge !== 0) {
      advice += `\n- **Điện tích hiện tại**: Nguyên tử của em đang có điện tích là **${netCharge > 0 ? '+' + netCharge : netCharge}** (${netCharge > 0 ? 'Cation' : 'Anion'}). Để thành nguyên tử trung hòa, số electron phải bằng số proton (hiện có ${electrons}e và ${protons}p).`;
    } else {
      advice += `\n- **Trạng thái**: Nguyên tử đang **trung hòa về điện** (${protons}p = ${electrons}e). Rất chuẩn!`;
    }

    if (!isStable) {
      advice += `\n- **Độ bền hạt nhân**: Hạt nhân đang **Kém bền (Không bền vững)** do tỉ lệ Neutron/Proton chưa cân đối. Hãy điều chỉnh số hạt neutron để đạt tỉ lệ $1 \\le N/Z \\le 1.5$.`;
    }

    return `### 🔬 Phân tích trạng thái nguyên tử hiện tại:
- **Nguyên tố:** **${elementName}** (Số hiệu Z = ${protons}, Số khối A = ${massNumber})
- **Cấu hình hạt:** ${protons} Proton, ${neutrons} Neutron, ${electrons} Electron.${advice}

${uncompleted.length > 0 ? `🎯 **Gợi ý nhiệm vụ tiếp theo:** Thử thực hiện: *${uncompleted[0].title}* nhé!` : '🎉 Em đã hoàn thành tất cả nhiệm vụ của bài này xuất sắc!'}

> *Gợi ý:* Em có thể nhập API Key Gemini tại góc trên bên phải để trò chuyện chi tiết hơn với AI Tutor theo thời gian thực!`;
  }

  // Xử lý bài Hình học Không gian 3D & Trải phẳng
  if (simulationId === 'geom-quadrilaterals-thales-pyramids') {
    const { solidType = '', baseDimension = 0, height = 0, unfoldProgress = 0, outputs } = currentState;
    const uncompleted = activeQuests.filter(q => !q.completed);
    const unfoldPct = Math.round(unfoldProgress * 100);

    return `### 📐 Gia sư Hình học Không gian 3D:
Em đang khảo sát khối **${outputs?.nameVi || solidType}**:
- **Kích thước hiện tại:** ${solidType === 'cylinder' || solidType === 'cone' ? 'Bán kính đáy r' : 'Cạnh đáy a'} = **${baseDimension.toFixed(1)}**, Chiều cao h = **${height.toFixed(1)}**
- **Trạng thái Trải phẳng (Net Unfolding):** **${unfoldPct}%** ${unfoldPct >= 95 ? '(Đã mở phẳng hoàn toàn 2D)' : '(Đang ở không gian 3D)'}
- **Diện tích xung quanh ($S_{xq}$):** **${outputs?.lateralArea.toFixed(2)}** (${outputs?.formulas.lateralArea || ''})
- **Thể tích khối ($V$):** **${outputs?.volume.toFixed(2)}** (${outputs?.formulas.volume || ''})

💡 **Gợi ý tư duy sư phạm:**
${solidType.includes('pyramid') || solidType === 'cone' 
  ? '- Đối với các khối có 1 đỉnh nhọn (chóp, nón), thể tích luôn bằng **1/3** diện tích đáy nhân chiều cao!' 
  : '- Đối với các khối trụ hoặc lăng trụ (2 đáy song song bằng nhau), thể tích bằng **diện tích đáy nhân chiều cao**!'}

${uncompleted.length > 0 ? `🎯 **Thử thách tiếp theo:** Em hãy thực hiện nhiệm vụ: *${uncompleted[0].title}*!` : '🎉 Em đã chinh phục tất cả thử thách hình học 3D!'}`;
  }

  // Xử lý bài Chuyển động ném xiên & Bảo toàn cơ năng
  if (simulationId === 'phys-projectile-collision-energy') {
    const { params = {}, summary = {}, targetX = 40, hitTarget = false } = currentState;
    const { v0 = 20, angleDeg = 45, g = 9.8, dragCoeff = 0 } = params;
    const { maxHeight = 0, maxRange = 0, flightTime = 0 } = summary;
    const uncompleted = activeQuests.filter(q => !q.completed);

    let advice = '';
    if (hitTarget) {
      advice += `\n- 🎯 **Tuyệt vời!** Điểm rơi đạn ($L = ${maxRange.toFixed(1)}m$) đã trúng hồng tâm mục tiêu tại $x = ${targetX}m$!`;
    } else {
      const diff = maxRange - targetX;
      advice += `\n- 📍 **Độ lệch mục tiêu:** Đạn rơi ${diff > 0 ? 'vượt quá' : 'thiếu'} **${Math.abs(diff).toFixed(1)}m**. ${diff > 0 ? 'Hãy thử giảm v0 hoặc chỉnh góc ném để thu hẹp tầm xa.' : 'Hãy thử tăng v0 hoặc chỉnh góc ném gần 45° hơn để bay xa hơn.'}`;
    }

    if (dragCoeff > 0) {
      advice += `\n- 💨 **Lực cản không khí:** Do $k = ${dragCoeff}$, cơ năng bị tiêu hao thành nhiệt năng, làm quỹ đạo rơi dốc đứng hơn và tầm xa ngắn hơn so với trong chân không.`;
    } else {
      advice += `\n- ⚡ **Chân không lý tưởng:** Cơ năng $W = W_d + W_t$ được bảo toàn hoàn hảo suốt thời gian bay!`;
    }

    return `### 🚀 Gia sư Vật lý Lớp 10 (Chuyển động ném xiên):
Em đang thực hiện bài bắn với các thông số:
- **Vận tốc ban đầu:** $v_0 = ${v0} \\text{ m/s}$, **Góc bắn:** $\\alpha = ${angleDeg}^\\circ$, **Gia tốc:** $g = ${g.toFixed(2)} \\text{ m/s}^2$
- **Tầm cao cực đại:** $H_{\\max} = ${maxHeight.toFixed(2)} \\text{ m}$ (công thức lý tưởng: $y_0 + \\frac{v_{0y}^2}{2g}$)
- **Tầm bay xa:** $L = ${maxRange.toFixed(2)} \\text{ m}$, **Thời gian bay:** $t = ${flightTime.toFixed(2)} \\text{ s}$${advice}

${uncompleted.length > 0 ? `🎯 **Gợi ý nhiệm vụ tiếp theo:** *${uncompleted[0].title}*!` : '🎉 Xuất sắc! Em đã hoàn thành toàn bộ các thử thách ném xiên!'}`;
  }

  // Xử lý bài Tiếng Anh: Trục thời gian 12 thì & Chuyển đổi Bị động
  if (simulationId === 'eng-present-simple-continuous' || simulationId === 'eng-past-cont-conditionals-passive') {
    const { mode = 'timeline', tenseNameEn = '', formula = {}, isPassiveVoice = false, passiveFullSentence = '', selectedVerbBase = '' } = currentState;
    const uncompleted = activeQuests.filter(q => !q.completed);

    if (mode === 'timeline') {
      return `### 🇬🇧 English Tutor (Tense Master):
Em đang tìm hiểu thì **${tenseNameEn}**:
- **Cấu trúc ngữ pháp:**
  - Khẳng định: \`${formula?.affirmative || ''}\`
  - Phủ định: \`${formula?.negative || ''}\`
- 💡 **Mẹo ghi nhớ bản chất:** Hãy nhìn vào vị trí biểu diễn trên trục thời gian SVG. Nếu là thì tiếp diễn (*Continuous*), hành động luôn là một khoảng sóng kéo dài quanh một mốc thời gian (*at the moment, at 8 PM yesterday*).
${uncompleted.length > 0 ? `\n🎯 **Thử thách kế tiếp:** Em hãy hoàn thành nhiệm vụ: *${uncompleted[0].title}*!` : '🎉 Chúc mừng em đã nắm vững các thì trọng tâm!'}`;
    } else {
      return `### 🇬🇧 English Tutor (Active ↔ Passive Transformer):
Em đang thực hành **Chuyển đổi Câu Chủ động ↔ Bị động**:
- **Thể hiện tại:** ${isPassiveVoice ? '**BỊ ĐỘNG (Passive Voice)**' : '**CHỦ ĐỘNG (Active Voice)**'}
- **Động từ thực hành:** \`${selectedVerbBase}\`
- **Câu bị động hoàn chỉnh:** \`${passiveFullSentence}\`
- 💡 **Quy tắc vàng 4 bước:**
  1. Tân ngữ câu chủ động $\\to$ Chủ ngữ câu bị động.
  2. Động từ \`to be\` chia theo thì và số của chủ ngữ mới.
  3. Động từ chính luôn ở dạng quá khứ phân từ \`V3/V-ed\`.
  4. Đưa chủ ngữ cũ về sau thành \`by + Agent\` (lược bỏ nếu là someone, people...).
${uncompleted.length > 0 ? `\n🎯 **Nhiệm vụ tiếp theo:** *${uncompleted[0].title}*!` : '🎉 Rất xuất sắc! Em đã thành thạo kỹ năng biến đổi câu!'}`;
    }
  }

  // Xử lý bài Toán 9: Parabol & Hệ phương trình bậc nhất hai ẩn
  if (simulationId === 'math-linear-systems-quadratic') {
    const { activeTab = 'parabola', parabola = {}, parabolaAnalysis = {}, linearAnalysis = {} } = currentState;
    const uncompleted = activeQuests.filter(q => !q.completed);

    if (activeTab === 'parabola') {
      const { a = 1, b = 0, c = 0 } = parabola;
      const { vertex = { x: 0, y: 0 }, axisOfSymmetry = 0, delta = 0, roots = [], concavity = 'up' } = parabolaAnalysis;

      return `### 📐 Gia sư Toán học 9 (Khảo sát Parabol $y = ax^2 + bx + c$):
Em đang khảo sát Parabol: **$y = ${a}x^2 ${b >= 0 ? '+ ' + b : '- ' + Math.abs(b)}x ${c >= 0 ? '+ ' + c : '- ' + Math.abs(c)}$**
- **Đỉnh Parabol:** $I(${vertex.x}, ${vertex.y})$ — tọa độ tính theo công thức $x_I = -\\frac{b}{2a}$, $y_I = -\\frac{\\Delta}{4a}$.
- **Trục đối xứng:** Đường thẳng thẳng đứng $x = ${axisOfSymmetry}$.
- **Bề lõm:** Hệ số $a = ${a}$ ${concavity === 'up' ? '> 0, Parabol quay lên (bề lõm hướng lên trên), đạt giá trị nhỏ nhất' : '< 0, Parabol quay xuống (bề lõm hướng xuống dưới), đạt giá trị lớn nhất'} tại đỉnh $y = ${vertex.y}$.
- **Biệt thức:** $\\Delta = b^2 - 4ac = ${delta.toFixed(2)}$:
  ${delta > 0 
    ? `* $\\Delta > 0$: Parabol cắt trục hoành $Ox$ tại **2 điểm phân biệt**: ${roots.map((r: number, idx: number) => `$x_${idx+1} = ${r}$`).join(', ')}.`
    : delta === 0 
    ? `* $\\Delta = 0$: Parabol **tiếp xúc với trục hoành $Ox$** tại điểm cực trị duy nhất (nghiệm kép $x = ${vertex.x}$).`
    : `* $\\Delta < 0$: Parabol **không cắt trục hoành $Ox$**, toàn bộ đồ thị nằm ${a > 0 ? 'phía trên' : 'phía dưới'} trục $Ox$.`}

💡 **Bản chất hình học:** Parabol là quỹ đạo của mọi vật ném xiên trong trường trọng lực và là hình dạng của các chảo vệ tinh viễn thông hay vòm cầu cáp treo!
${uncompleted.length > 0 ? `\n🎯 **Gợi ý nhiệm vụ:** Thử sức với: *${uncompleted[0].title}*!` : '🎉 Quá xuất sắc! Em đã hoàn thành toàn bộ nhiệm vụ!'}`;
    } else {
      const { D = 0, Dx = 0, Dy = 0, type = 'unique', solution = { x: 0, y: 0 }, statusMessageVi = '' } = linearAnalysis;

      return `### 📐 Gia sư Toán học 9 (Hệ 2 phương trình bậc nhất hai ẩn):
Em đang khảo sát vị trí tương đối của hai đường thẳng $d_1$ và $d_2$:
- **Định thức Cramer:** $D = ${D}$, $D_x = ${Dx}$, $D_y = ${Dy}$
- **Kết luận hình học:** ${statusMessageVi}
${type === 'unique' 
  ? `- **Tọa độ nghiệm duy nhất:** $x = \\frac{D_x}{D} = ${solution.x}$, $y = \\frac{D_y}{D} = ${solution.y}$. Đây chính là tọa độ giao điểm của hai đường thẳng trên mặt phẳng $Oxy$!`
  : type === 'parallel'
  ? `- Hai đường thẳng có cùng hệ số góc nhưng khác tung độ gốc nên **song song tuyệt đối**, không bao giờ cắt nhau (Hệ vô nghiệm).`
  : `- Hai phương trình thực chất là một (tỉ lệ hệ số trùng nhau), hai đường thẳng **trùng khít lên nhau** (Hệ vô số nghiệm).`}

${uncompleted.length > 0 ? `\n🎯 **Thử thách tiếp theo:** *${uncompleted[0].title}*!` : '🎉 Tuyệt vời! Em đã làm chủ hệ phương trình bậc nhất hai ẩn!'}`;
    }
  }

  // Phản hồi mẫu chung cho các bài học khác
  return `### 🎓 Gia sư STEM & English Lab
Em đang thao tác bài **${context.simulationTitle}** (Lớp ${context.grade}).
- Hiện trạng phòng lab đã được ghi nhận. Em hãy quan sát sự biến thiên của các thông số khi thay đổi giá trị điều khiển.
- Các nhiệm vụ phía bên phải màn hình sẽ tự động tích xanh ngay khi em điều chỉnh hệ thống đạt chuẩn yêu cầu!
*(Em có thể kết nối Gemini API Key ở cài đặt để kích hoạt tính năng AI Tutor đối thoại chuyên sâu 24/7).*`;
}

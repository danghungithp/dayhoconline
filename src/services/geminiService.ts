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

  // Xử lý bài KHTN 7: Quang học phản xạ & Dao động âm thanh
  if (simulationId === 'phys-light-optics-sound') {
    const { activeTab = 'optics', mirrorType = 'plane', incidentAngleDeg = 45, frequency = 440, amplitude = 60, isPlaying = false } = currentState;
    const uncompleted = activeQuests.filter(q => !q.completed);

    if (activeTab === 'optics') {
      const absI = Math.abs(incidentAngleDeg);
      return `### 💡 Gia sư KHTN 7 (Quang học phản xạ & Khúc xạ ánh sáng):
Em đang thực hiện thí nghiệm quang học với:
- **Dụng cụ:** ${mirrorType === 'plane' ? 'Gương phẳng' : mirrorType === 'concave' ? 'Gương cầu lõm' : mirrorType === 'convex' ? 'Gương cầu lồi' : 'Mặt phân cách khúc xạ'}.
- **Góc tới:** $i = ${absI}^\\circ$ (so với pháp tuyến $N$).
- **Góc phản xạ:** $i' = ${absI}^\\circ$ ${mirrorType === 'plane' ? '(Định luật phản xạ: Góc phản xạ luôn luôn bằng góc tới $i\' = i$ và nằm trong cùng mặt phẳng tới).' : ''}
${mirrorType === 'refraction' ? '👉 Khi tia sáng đi qua mặt phân cách giữa 2 môi trường có chiết suất khác nhau, tia sáng bị gãy khúc theo định luật Snell-Descartes: $n_1 \\sin(i) = n_2 \\sin(r)$.' : ''}

${uncompleted.length > 0 ? `🎯 **Gợi ý nhiệm vụ:** Hãy thử hoàn thành: *${uncompleted[0].title}*!` : '🎉 Xuất sắc! Em đã nắm vững định luật quang học!'}`;
    } else {
      const periodMs = ((1 / frequency) * 1000).toFixed(2);
      const wavelengthM = (343 / frequency).toFixed(2);
      return `### 🎵 Gia sư KHTN 7 (Dao động âm thanh & Sóng âm):
Em đang khảo sát nguồn âm phát ra:
- **Tần số (Độ cao của âm):** $f = ${frequency}$ Hz ➔ Chu kỳ $T = ${periodMs}$ ms, Bước sóng $\\lambda = ${wavelengthM}$ m trong không khí ($v = 343$ m/s).
- **Phân loại âm:** ${frequency < 250 ? 'Âm trầm (Bass)' : frequency > 1000 ? 'Âm bổng (Treble)' : 'Âm trung (Midtone)'}.
- **Biên độ (Độ to của âm):** $A = ${amplitude}\\%$ — ${isPlaying ? '🔊 Âm thanh đang phát trực tiếp.' : 'Đang tạm dừng.'}
💡 *Ghi nhớ:* Tần số quyết định **độ cao** (bổng/trầm), còn biên độ dao động quyết định **độ to** (to/nhỏ) của âm thanh!

${uncompleted.length > 0 ? `🎯 **Thử thách tiếp theo:** *${uncompleted[0].title}*!` : '🎉 Tuyệt vời! Em đã hoàn thành các nhiệm vụ về âm thanh!'}`;
    }
  }

  // Xử lý bài Toán 7: Số thực, Đại lượng tỉ lệ & Xác suất
  if (simulationId === 'math-real-numbers-proportions') {
    const { mode = 'direct', k = 2, a = 12, squareArea = 49, stats = { totalSpins: 0 } } = currentState;
    const uncompleted = activeQuests.filter(q => !q.completed);

    if (mode === 'direct') {
      return `### 📐 Gia sư Toán 7 (Đại lượng tỉ lệ thuận $y = kx$):
Em đang khảo sát hàm số tỉ lệ thuận với hệ số tỉ lệ: **$k = ${k}$**
- **Phương trình:** $y = ${k}x$.
- **Đồ thị:** Là đường thẳng luôn đi qua gốc tọa độ $O(0, 0)$.
- **Tính chất trọng tâm:** Tỉ số giữa hai giá trị tương ứng luôn bằng hệ số tỉ lệ: $\\frac{y_1}{x_1} = \\frac{y_2}{x_2} = k = ${k}$.

${uncompleted.length > 0 ? `🎯 **Nhiệm vụ gợi ý:** *${uncompleted[0].title}*!` : '🎉 Quá đỉnh! Em đã làm chủ đại lượng tỉ lệ thuận!'}`;
    } else if (mode === 'inverse') {
      return `### 📐 Gia sư Toán 7 (Đại lượng tỉ lệ nghịch $y = \\frac{a}{x}$):
Em đang khảo sát hàm số tỉ lệ nghịch với hệ số tỉ lệ: **$a = ${a}$**
- **Phương trình:** $y = \\frac{${a}}{x} \\iff x \\cdot y = ${a}$.
- **Ý nghĩa hình học:** Điểm $M(x, y)$ trên đường cong cùng gốc tọa độ luôn tạo thành hình chữ nhật có diện tích không đổi **$S = x \\cdot y = ${a}$**!

${uncompleted.length > 0 ? `🎯 **Nhiệm vụ gợi ý:** *${uncompleted[0].title}*!` : '🎉 Quá đỉnh! Em đã làm chủ đại lượng tỉ lệ nghịch!'}`;
    } else if (mode === 'sqrt') {
      const side = Math.sqrt(squareArea);
      return `### 🟩 Gia sư Toán 7 (Căn bậc hai số học):
Em đang khảo sát diện tích hình vuông: **$S = ${squareArea}$**
- Căn bậc hai số học của $S$ là độ dài cạnh hình vuông: **$a = \\sqrt{${squareArea}} = ${side.toFixed(2)}$**.
- Phép toán: $(\\sqrt{${squareArea}})^2 = ${squareArea}$. ${Number.isInteger(side) ? `Đây là số chính phương ($${side}^2 = ${squareArea}$).` : 'Đây là số vô tỉ trong tập số thực $\\mathbb{R}$.'}

${uncompleted.length > 0 ? `🎯 **Nhiệm vụ gợi ý:** *${uncompleted[0].title}*!` : '🎉 Xuất sắc!'}`;
    } else {
      return `### 🎯 Gia sư Toán 7 (Xác suất thực nghiệm & Luật số lớn):
Em đã thực hiện quay vòng quay may mắn: **${stats.totalSpins} lượt**.
- Khi số lần quay càng lớn ($N \\to \\infty$), tần số xuất hiện của mỗi màu sẽ dần tiến sát về **xác suất lý thuyết 25%** ($1/4$).
- Đây chính là **Định luật số lớn (Law of Large Numbers)** do nhà toán học Bernoulli chứng minh!

${uncompleted.length > 0 ? `🎯 **Nhiệm vụ tiếp theo:** *${uncompleted[0].title}*!` : '🎉 Tuyệt vời! Em đã hoàn thành kiểm nghiệm xác suất!'}`;
    }
  }

  // Xử lý bài Hình học 7: Tam giác bằng nhau & 4 đường đồng quy
  if (simulationId === 'geom-triangles-special-lines') {
    const { activeTab = 'concurrence', showMedians, showAngleBisectors, showPerpendicularBisectors, showAltitudes, showEulerLine, showPythagorasSquares } = currentState;
    const uncompleted = activeQuests.filter(q => !q.completed);

    if (activeTab === 'concurrence') {
      return `### 📐 Gia sư Hình học 7 (4 Đường đồng quy trong tam giác):
Em đang khảo sát các đường đặc biệt:
- **3 đường trung tuyến:** Cắt nhau tại **Trọng tâm $G$** (Centroid). Tính chất: $GA = \\frac{2}{3} AM$.
- **3 đường phân giác:** Cắt nhau tại **Tâm đường tròn nội tiếp $I$** (Incenter) cách đều 3 cạnh.
- **3 đường trung trực:** Cắt nhau tại **Tâm đường tròn ngoại tiếp $O$** (Circumcenter) cách đều 3 đỉnh.
- **3 đường cao:** Cắt nhau tại **Trực tâm $H$** (Orthocenter).
${showEulerLine ? '👉 **Đường thẳng Euler:** Ba điểm $O, G, H$ luôn luôn thẳng hàng trong mọi tam giác!' : ''}

${uncompleted.length > 0 ? `🎯 **Gợi ý nhiệm vụ:** *${uncompleted[0].title}*!` : '🎉 Rất xuất sắc! Em đã thông thạo 4 đường đồng quy!'}`;
    } else if (activeTab === 'congruence') {
      return `### 📐 Gia sư Hình học 7 (Các trường hợp bằng nhau của tam giác):
- **c-c-c (Cạnh - Cạnh - Cạnh):** 3 cặp cạnh bằng nhau.
- **c-g-c (Cạnh - Góc - Cạnh):** 2 cạnh và góc xen giữa bằng nhau.
- **g-c-g (Góc - Cạnh - Góc):** 1 cạnh và 2 góc kề bằng nhau.
- **Tam giác vuông:** Cạnh huyền - Góc nhọn hoặc Cạnh huyền - Cạnh góc vuông.

${uncompleted.length > 0 ? `🎯 **Gợi ý nhiệm vụ:** *${uncompleted[0].title}*!` : '🎉 Hoàn hảo!'}`;
    } else {
      return `### 📐 Gia sư Hình học 7 (Định lý Pythagore trong tam giác vuông):
- Trong một tam giác vuông, bình phương của cạnh huyền bằng tổng bình phương hai cạnh góc vuông:
  $$a^2 = b^2 + c^2$$
- Mô hình diện tích minh họa trực quan: Tổng diện tích 2 hình vuông trên 2 cạnh góc vuông đúng bằng diện tích hình vuông trên cạnh huyền!

${uncompleted.length > 0 ? `🎯 **Gợi ý nhiệm vụ:** *${uncompleted[0].title}*!` : '🎉 Em đã làm chủ định lý Pythagore!'}`;
    }
  }

  // Xử lý bài Tiếng Anh 7: Past Simple vs Future & Comparatives
  if (simulationId === 'eng-past-future-comparatives') {
    const { activeTab = 'comparatives', attribute = 'speed', category = 'animals' } = currentState;
    const uncompleted = activeQuests.filter(q => !q.completed);

    if (activeTab === 'comparatives') {
      return `### 🌟 English 7 Tutor (Comparatives & Superlatives):
You are practicing comparisons with **${category}** by **${attribute}**:
- **Comparative structure (So sánh hơn):**
  - Short Adjective: \`Subject + is/are + adj-er + than + Object\` (e.g., *faster than*, *heavier than*, *taller than*).
  - Long Adjective: \`Subject + is/are + more + adj + than + Object\` (e.g., *more dangerous than*).
- **Superlative structure (So sánh nhất):**
  - \`Subject + is/are + the + adj-est\` (e.g., *the fastest animal*, *the tallest giraffe*).
💡 *Tip:* Click the speaker button to listen to native pronunciation!

${uncompleted.length > 0 ? `🎯 **Active Quest:** *${uncompleted[0].title}*!` : '🎉 Awesome job! You have mastered English comparatives!'}`;
    } else {
      return `### 🌟 English 7 Tutor (Past Simple vs Future Tenses):
- **Past Simple (Quá khứ đơn):** Actions completed in the past with specific time tags (*yesterday, last year, 2 days ago*). Formula: \`S + V-ed / V2\`.
- **Future with Will (Tương lai đơn):** Instant decisions made at the moment of speaking or subjective predictions without present evidence. Formula: \`S + will + V-inf\`.
- **Future with Be going to (Tương lai gần):** Prior plans, intentions, or predictions based on clear present evidence. Formula: \`S + am/is/are + going to + V-inf\`.

${uncompleted.length > 0 ? `🎯 **Active Quest:** *${uncompleted[0].title}*!` : '🎉 Well done!'}`;
    }
  }

  // Xử lý bài KHTN 6: Các thể của chất & Chuyển thể
  if (simulationId === 'chem-states-of-matter') {
    const { substance = 'water', temperatureC = 25, pistonHeight = 0.8 } = currentState;
    const uncompleted = activeQuests.filter(q => !q.completed);

    let stateStr = temperatureC < 0 ? 'Thể rắn (Băng đá / Tinh thể cố định)' : temperatureC >= 100 ? 'Thể khí / Hơi nước (Bay tự do khắp bình)' : 'Thể lỏng (Linh hoạt ở đáy bình)';

    return `### 🧪 Gia sư KHTN 6 (Các thể của chất & Sự chuyển thể):
Em đang khảo sát chất **${substance === 'water' ? 'Nước (H₂O)' : substance === 'oxygen' ? 'Khí Oxy (O₂)' : 'Argon'}** ở nhiệt độ: **${temperatureC}°C**:
- **Trạng thái hiện tại:** **${stateStr}**.
- **Động học phân tử:**
  * Thể rắn: Các phân tử liên kết chặt chẽ theo mạng tinh thể, chỉ dao động nhỏ quanh vị trí cân bằng cố định.
  * Thể lỏng: Liên kết yếu hơn, các hạt trượt tự do quanh nhau, có thể tích xác định nhưng hình dạng theo bình chứa.
  * Thể khí: Các hạt chuyển động hỗn loạn không ngừng, va chạm vào thành bình tạo ra áp suất.
- **Áp suất bình:** Tỉ lệ nghịch với thể tích (chiều cao Piston = ${Math.round(pistonHeight * 100)}%).

${uncompleted.length > 0 ? `🎯 **Gợi ý nhiệm vụ:** Thử sức với: *${uncompleted[0].title}*!` : '🎉 Tuyệt vời! Em đã hoàn thành toàn bộ bài chuyển thể chất!'}`;
  }

  // Xử lý bài KHTN 6: Lực, Đòn bẩy & Mặt phẳng nghiêng
  if (simulationId === 'phys-forces-simple-machines') {
    const { mode = 'spring', massGrams = 200, springConstant = 50, loadForceN = 40, loadArmM = 1.0, effortArmM = 2.0, inclineAngleDeg = 30 } = currentState;
    const uncompleted = activeQuests.filter(q => !q.completed);

    if (mode === 'spring') {
      const elongCm = ((massGrams * 0.0098) / springConstant * 100).toFixed(1);
      return `### ⚙️ Gia sư KHTN 6 (Lực kế lò xo & Định luật Hooke):
- **Quả nặng treo vào:** $m = ${massGrams}$ g ➔ Trọng lượng $P = ${(massGrams * 0.0098).toFixed(2)}$ N.
- **Độ dãn lò xo:** $\\Delta l = ${elongCm}$ cm.
- **Định luật Hooke:** Trong giới hạn đàn hồi, lực đàn hồi của lò xo tỉ lệ thuận với độ biến dạng của nó: $F_{đh} = k \\cdot \\Delta l$.

${uncompleted.length > 0 ? `🎯 **Thử thách:** *${uncompleted[0].title}*!` : '🎉 Xuất sắc!'}`;
    } else if (mode === 'lever') {
      const advantage = (effortArmM / loadArmM).toFixed(1);
      const effortN = ((loadForceN * loadArmM) / effortArmM).toFixed(1);
      return `### ⚙️ Gia sư KHTN 6 (Cơ chế Đòn bẩy có điểm tựa O):
- **Vật nặng cần nâng:** $F_1 = ${loadForceN}$ N (ở khoảng cách $d_1 = ${loadArmM}$ m).
- **Lực nâng tác dụng:** $F_2 = ${effortN}$ N (ở khoảng cách $d_2 = ${effortArmM}$ m).
- **Quy tắc đòn bẩy:** $F_1 \\cdot d_1 = F_2 \\cdot d_2$. Vì $d_2 > d_1$ nên em được **lợi ${advantage} lần về lực**!

${uncompleted.length > 0 ? `🎯 **Nhiệm vụ:** *${uncompleted[0].title}*!` : '🎉 Tuyệt vời!'}`;
    } else {
      return `### ⚙️ Gia sư KHTN 6 (Mặt phẳng nghiêng):
- **Góc nghiêng của dốc:** $\\alpha = ${inclineAngleDeg}^\\circ$.
- **Lực kéo:** $F = P \\cdot \\sin(\\alpha) = P \\cdot \\frac{h}{l}$.
💡 *Nguyên lý vàng:* Dốc càng thoai thoải (góc $\\alpha$ càng nhỏ) thì lực kéo vật lên dốc càng nhỏ, giúp tiết kiệm lực nâng!

${uncompleted.length > 0 ? `🎯 **Nhiệm vụ:** *${uncompleted[0].title}*!` : '🎉 Hoàn hảo!'}`;
    }
  }

  // Xử lý bài Toán 6: Số nguyên & Phân số
  if (simulationId === 'math-integers-fractions') {
    const { mode = 'integers', firstNum = 3, operation = '+', secondNum = -5, numerator = 3, denominator = 4 } = currentState;
    const uncompleted = activeQuests.filter(q => !q.completed);

    if (mode === 'integers') {
      const res = operation === '+' ? firstNum + secondNum : firstNum - secondNum;
      return `### 🔢 Gia sư Toán 6 (Số nguyên trên trục số):
Em đang thực hiện phép tính: **${firstNum} ${operation} ${secondNum < 0 ? '(' + secondNum + ')' : secondNum} = ${res}**
- Trên trục số: Gốc $0$ ở giữa, chiều dương sang phải, chiều âm sang trái.
- Cộng số âm tương đương với đi lùi sang trái.
- Trừ đi số âm: $a - (-b) = a + b$ (trừ đi số âm biến thành cộng số đối).

${uncompleted.length > 0 ? `🎯 **Gợi ý nhiệm vụ:** *${uncompleted[0].title}*!` : '🎉 Em đã làm chủ phép tính số nguyên!'}`;
    } else {
      const pct = ((numerator / denominator) * 100).toFixed(1);
      return `### 🍕 Gia sư Toán 6 (Phân số trực quan):
Em đang khảo sát phân số: **$\\frac{${numerator}}{${denominator}}$**
- **Ý nghĩa:** Một đại lượng được chia đều làm **${denominator} phần bằng nhau**, ta lấy **${numerator} phần** (${pct}%).
- **Phân số tối giản:** Rút gọn bằng cách chia cả tử và mẫu cho ước chung lớn nhất $\\gcd(${numerator}, ${denominator})$.

${uncompleted.length > 0 ? `🎯 **Thử thách:** *${uncompleted[0].title}*!` : '🎉 Xuất sắc!'}`;
    }
  }

  // Xử lý bài Hình học 6: Góc & Đối xứng
  if (simulationId === 'geom-angles-symmetry') {
    const { mode = 'angles', angleDeg = 45, foldProgress = 0, rotationAngleDeg = 0 } = currentState;
    const uncompleted = activeQuests.filter(q => !q.completed);

    if (mode === 'angles') {
      let angleName = angleDeg === 90 ? 'Góc vuông' : angleDeg === 180 ? 'Góc bẹt' : angleDeg < 90 ? 'Góc nhọn' : 'Góc tù';
      return `### 📐 Gia sư Hình học 6 (Số đo góc & Thước đo độ):
- **Số đo góc $\\widehat{xOy}$:** **${angleDeg}^\\circ** (${angleName}).
- **Quy tắc phân loại:**
  * Góc nhọn: $0^\\circ < \\alpha < 90^\\circ$.
  * Góc vuông: $\\alpha = 90^\\circ$ (ký hiệu góc vuông $\\llcorner$).
  * Góc tù: $90^\\circ < \\alpha < 180^\\circ$.
  * Góc bẹt: $\\alpha = 180^\\circ$ (hai tia đối nhau).

${uncompleted.length > 0 ? `🎯 **Nhiệm vụ:** *${uncompleted[0].title}*!` : '🎉 Tuyệt vời!'}`;
    } else if (mode === 'axis-symmetry') {
      return `### 🦋 Gia sư Hình học 6 (Trục đối xứng):
- Đường thẳng $d$ là trục đối xứng nếu khi gấp hình theo $d$, hai phần của hình trùng khít lên nhau hoàn toàn.
- Tiến độ gấp hiện tại: **${Math.round(foldProgress * 100)}\\%** ${foldProgress >= 0.95 ? '(Đã gấp khít hoàn toàn!)' : ''}.

${uncompleted.length > 0 ? `🎯 **Gợi ý nhiệm vụ:** *${uncompleted[0].title}*!` : '🎉 Xuất sắc!'}`;
    } else {
      return `### 🔄 Gia sư Hình học 6 (Tâm đối xứng):
- Điểm $O$ là tâm đối xứng nếu khi quay hình quanh $O$ một góc **180°**, hình trùng khít với chính nó ban đầu.
- Góc xoay hiện tại: **${rotationAngleDeg}^\\circ** ${rotationAngleDeg === 180 ? '(Đã trùng khít tại 180°!)' : ''}.

${uncompleted.length > 0 ? `🎯 **Nhiệm vụ:** *${uncompleted[0].title}*!` : '🎉 Rất tốt!'}`;
    }
  }

  // Xử lý bài Hóa học 8: Cân bằng PTHH & Bảo toàn khối lượng
  if (simulationId === 'chem-balancing-reactions') {
    const { activeReactionIndex = 0, isBalanced = false, activeTab = 'balance', totalMassReactants = 0, totalMassProducts = 0 } = currentState;
    const uncompleted = activeQuests.filter(q => !q.completed);

    if (activeTab === 'balance') {
      return `### 🧪 Gia sư Hóa học 8 (Cân bằng Phương trình Hóa học):
- **Trạng thái cân bằng:** ${isBalanced ? '✅ **ĐÃ CÂN BẰNG HOÀN TOÀN!** Số nguyên tử của mỗi nguyên tố ở hai vế đã bằng nhau.' : '⚠️ **CHƯA CÂN BẰNG.** Số lượng nguyên tử ở vế trái (chất tham gia) và vế phải (sản phẩm) chưa khớp.'}
- **Quy tắc vàng:** Em chỉ được thay đổi **Hệ số** đứng trước công thức hóa học, tuyệt đối **không được thay đổi chỉ số chân** trong công thức phân tử!
- Khi cân bằng: Nên ưu tiên kim loại ➔ phi kim ➔ hiđro ➔ oxi cuối cùng.

${uncompleted.length > 0 ? `🎯 **Thử thách tiếp theo:** *${uncompleted[0].title}*!` : '🎉 Em đã cân bằng xuất sắc các phương trình!'}`;
    } else {
      const massMatch = Math.abs(totalMassReactants - totalMassProducts) < 0.01;
      return `### ⚖️ Gia sư Hóa học 8 (Định luật Bảo toàn khối lượng - Lomonosov & Lavoisier):
- **Tổng khối lượng chất tham gia:** $m_{trước} = ${Number(totalMassReactants).toFixed(2)}$ g.
- **Tổng khối lượng sản phẩm:** $m_{sau} = ${Number(totalMassProducts).toFixed(2)}$ g.
- **Nội dung định luật:** Trong một phản ứng hóa học, tổng khối lượng của các chất sản phẩm bằng tổng khối lượng của các chất tham gia phản ứng:
  $$\\sum m_{tham\\_gia} = \\sum m_{san\\_pham}$$
- ${massMatch ? '✨ Khối lượng được bảo toàn chính xác trên đòn cân!' : '⚠️ Hãy cân bằng đúng hệ số để đòn cân thăng bằng nhé!'}`;
    }
  }

  // Xử lý bài KHTN 8: Lực đẩy Ác-si-mét & Thấu kính hội tụ
  if (simulationId === 'phys-buoyancy-refraction') {
    const { activeTab = 'buoyancy', fluidDensity = 1000, objectDensity = 800, objectVolume = 0.002, lensFocalLength = 10, objectDistance = 25 } = currentState;
    const uncompleted = activeQuests.filter(q => !q.completed);

    if (activeTab === 'buoyancy') {
      let stateDesc = objectDensity < fluidDensity ? 'Vật sẽ NỔI lên mặt nước' : objectDensity === fluidDensity ? 'Vật sẽ LƠ LỬNG trong chất lỏng' : 'Vật sẽ CHÌM xuống đáy';
      return `### 🌊 Gia sư KHTN 8 (Lực đẩy Ác-si-mét & Điều kiện chìm nổi):
- **Khối lượng riêng chất lỏng:** $D_{lỏng} = ${fluidDensity}$ kg/m³
- **Khối lượng riêng vật:** $D_{vật} = ${objectDensity}$ kg/m³
- **Hiện tượng:** **${stateDesc}** (vì $D_{vật} ${objectDensity < fluidDensity ? '<' : objectDensity > fluidDensity ? '>' : '='} D_{lỏng}$).
- **Công thức Ác-si-mét:** $F_A = d \\cdot V = 10 \\cdot D_{lỏng} \\cdot V_{chìm}$.
- Khi vật nổi cân bằng: $F_A = P$ (Lực đẩy Ác-si-mét bằng đúng trọng lượng vật).

${uncompleted.length > 0 ? `🎯 **Gợi ý nhiệm vụ:** *${uncompleted[0].title}*!` : '🎉 Tuyệt vời! Em đã thành thạo định luật Ác-si-mét!'}`;
    } else {
      const isReal = objectDistance > lensFocalLength;
      return `### 🔍 Gia sư KHTN 8 (Thấu kính hội tụ & Tạo ảnh quang học):
- **Tiêu cự thấu kính:** $f = ${lensFocalLength}$ cm.
- **Khoảng cách vật:** $d = ${objectDistance}$ cm.
- **Đặc điểm ảnh:** ${isReal ? 'Ảnh **THẬT**, ngược chiều với vật' : 'Ảnh **ẢO**, cùng chiều và lớn hơn vật'}.
- **Công thức thấu kính:** $\\frac{1}{f} = \\frac{1}{d} + \\frac{1}{d'} \\implies d' = \\frac{d \\cdot f}{d - f}$.
💡 *Ứng dụng:* Kính lúp (đặt vật $d < f$ tạo ảnh ảo phóng đại), Máy ảnh & Mắt (vật $d > 2f$ tạo ảnh thật thu nhỏ trên võng mạc).

${uncompleted.length > 0 ? `🎯 **Thử thách:** *${uncompleted[0].title}*!` : '🎉 Em đã làm chủ quang học thấu kính!'}`;
    }
  }

  // Xử lý bài Toán 8: Hằng đẳng thức diện tích & Hàm số bậc nhất y = ax + b
  if (simulationId === 'math-identities-linear-func') {
    const { activeTab = 'identities', identityType = 'square-sum', paramA = 4, paramB = 3, slope1 = 1, intercept1 = 0, slope2 = -1, intercept2 = 2 } = currentState;
    const uncompleted = activeQuests.filter(q => !q.completed);

    if (activeTab === 'identities') {
      if (identityType === 'square-sum') {
        const total = (Number(paramA) + Number(paramB)) ** 2;
        return `### 📐 Gia sư Toán 8 (Hằng đẳng thức: Bình phương một tổng):
- **Công thức:** $(a + b)^2 = a^2 + 2ab + b^2$
- **Phân rã diện tích:** $( ${paramA} + ${paramB} )^2 = ${paramA}^2 + 2 \\cdot ${paramA} \\cdot ${paramB} + ${paramB}^2 = ${Number(paramA)**2} + ${2*Number(paramA)*Number(paramB)} + ${Number(paramB)**2} = ${total}$
- Hình vuông lớn cạnh $(a+b)$ được chia chính xác thành 4 mảnh: 1 hình vuông xanh ($a^2$), 2 hình chữ nhật ($ab$), và 1 hình vuông đỏ ($b^2$)!

${uncompleted.length > 0 ? `🎯 **Thử thách tiếp theo:** *${uncompleted[0].title}*!` : '🎉 Xuất sắc!'}`;
      } else {
        return `### 📐 Gia sư Toán 8 (Hằng đẳng thức diện tích):
- **Hiệu hai bình phương:** $a^2 - b^2 = (a - b)(a + b)$
- Khi cắt bỏ hình vuông nhỏ $b^2$ khỏi hình vuông lớn $a^2$, phần diện tích còn lại có dạng chữ L. Khi xoay mảnh chữ nhật và ghép vào cạnh bên, ta thu được đúng một hình chữ nhật có kích thước $(a - b) \\times (a + b)$!

${uncompleted.length > 0 ? `🎯 **Thử thách:** *${uncompleted[0].title}*!` : '🎉 Hoàn hảo!'}`;
      }
    } else if (activeTab === 'linear-func') {
      const a = Number(slope1);
      const b = Number(intercept1);
      return `### 📈 Gia sư Toán 8 (Hàm số bậc nhất y = ax + b):
- **Phương trình:** $y = ${a !== 0 ? `${a}x` : ''} ${b > 0 ? '+ ' + b : b < 0 ? '- ' + Math.abs(b) : ''}$
- **Hệ số góc $a = ${a}$:** ${a > 0 ? 'Đường thẳng đồng biến (dốc lên từ trái sang phải)' : a < 0 ? 'Đường thẳng nghịch biến (dốc xuống)' : 'Đường thẳng song song trục hoành Ox'}.
- **Tung độ gốc $b = ${b}$:** Đồ thị luôn cắt trục tung Oy tại điểm $A(0, ${b})$.
- **Giao điểm với trục hoành Ox:** ${a !== 0 ? `Điểm $B(${(-b/a).toFixed(2)}, 0)$` : 'Không cắt Ox (song song)'}.

${uncompleted.length > 0 ? `🎯 **Nhiệm vụ:** *${uncompleted[0].title}*!` : '🎉 Em đã làm chủ đồ thị hàm số bậc nhất!'}`;
    } else {
      const a1 = Number(slope1);
      const b1 = Number(intercept1);
      const a2 = Number(slope2);
      const b2 = Number(intercept2);
      const isParallel = Math.abs(a1 - a2) < 0.001;
      const isPerp = Math.abs(a1 * a2 + 1) < 0.001;

      return `### ⚔️ Gia sư Toán 8 (Vị trí tương đối của hai đường thẳng):
- Đường thẳng $(d_1): y = ${a1}x + ${b1}$ và $(d_2): y = ${a2}x + ${b2}$
- **Quy tắc ghi nhớ:**
  * **Song song ($d_1 // d_2$):** khi $a_1 = a_2$ và $b_1 \\neq b_2$.
  * **Trùng nhau ($d_1 \\equiv d_2$):** khi $a_1 = a_2$ và $b_1 = b_2$.
  * **Cắt nhau:** khi $a_1 \\neq a_2$.
  * **Đặc biệt: Vuông góc ($d_1 \\perp d_2$):** khi tích hệ số góc $a_1 \\cdot a_2 = -1$.
- **Trạng thái hiện tại:** ${isPerp ? '✅ Hai đường thẳng **VUÔNG GÓC** ($a_1 \\cdot a_2 = -1$)' : isParallel ? '✅ Hai đường thẳng **SONG SONG** ($a_1 = a_2$)' : 'Hai đường thẳng **CẮT NHAU** tại một điểm'}.

${uncompleted.length > 0 ? `🎯 **Gợi ý nhiệm vụ:** *${uncompleted[0].title}*!` : '🎉 Em đã thành thạo quan hệ hai đường thẳng!'}`;
    }
  }

  // Xử lý bài Toán 10: Vòng tròn lượng giác & Miền nghiệm BPT 2 ẩn
  if (simulationId === 'math-inequalities-trig-circle') {
    const { activeTab = 'unit-circle', angleDeg = 45, testPoint = { x: 2, y: 2 }, objectiveA = 4, objectiveB = 3 } = currentState;
    const uncompleted = activeQuests.filter(q => !q.completed);

    if (activeTab === 'unit-circle') {
      const rad = ((Number(angleDeg) % 360) * Math.PI) / 180;
      const sinVal = Math.sin(rad).toFixed(3);
      const cosVal = Math.cos(rad).toFixed(3);

      return `### ⭕ Gia sư Toán 10 (Vòng tròn lượng giác & Giá trị lượng giác):
- **Góc hiện tại:** $\\alpha = ${angleDeg}^\\circ$
- **Tọa độ điểm ngọn M:** $(\\cos \\alpha, \\sin \\alpha) = (${cosVal}, ${sinVal})$
- **Quy tắc dấu trên 4 góc phần tư:**
  * Góc phần tư I ($0^\\circ < \\alpha < 90^\\circ$): $\\sin > 0, \\cos > 0, \\tan > 0, \\cot > 0$.
  * Góc phần tư II ($90^\\circ < \\alpha < 180^\\circ$): $\\sin > 0, \\cos < 0, \\tan < 0, \\cot < 0$.
  * Góc phần tư III ($180^\\circ < \\alpha < 270^\\circ$): $\\sin < 0, \\cos < 0, \\tan > 0, \\cot > 0$.
  * Góc phần tư IV ($270^\\circ < \\alpha < 360^\\circ$): $\\sin < 0, \\cos > 0, \\tan < 0, \\cot < 0$.
- **Hằng đẳng thức lượng giác gốc:** $\\sin^2 \\alpha + \\cos^2 \\alpha = 1$.

${uncompleted.length > 0 ? `🎯 **Thử thách tiếp theo:** *${uncompleted[0].title}*!` : '🎉 Tuyệt vời! Em đã nắm vững vòng tròn lượng giác!'}`;
    } else {
      const px = typeof testPoint === 'object' && testPoint !== null ? (testPoint as any).x ?? 2 : 2;
      const py = typeof testPoint === 'object' && testPoint !== null ? (testPoint as any).y ?? 2 : 2;
      const fVal = Number(objectiveA) * px + Number(objectiveB) * py;

      return `### 📊 Gia sư Toán 10 (Miền nghiệm hệ BPT & Quy hoạch tuyến tính):
- **Điểm thử nghiệm:** $M(${px}, ${py})$
- **Giá trị hàm mục tiêu:** $F(${px}, ${py}) = ${objectiveA} \\cdot ${px} + ${objectiveB} \\cdot ${py} = ${fVal}$
- **Định lý tối ưu hóa tuyến tính:** Giá trị lớn nhất hoặc nhỏ nhất của biểu thức $F(x, y) = ax + by$ trên miền đa giác nghiệm luôn luôn đạt được tại **ít nhất một trong các đỉnh** của miền đa giác đó!
- **Phương pháp giải bài toán thực tế:**
  1. Xác định hệ bất phương trình từ bài toán.
  2. Vẽ miền nghiệm (đa giác lồi).
  3. Tìm tọa độ tất cả các đỉnh của đa giác.
  4. Tính giá trị $F$ tại từng đỉnh và chọn giá trị lớn nhất/nhỏ nhất!

${uncompleted.length > 0 ? `🎯 **Gợi ý nhiệm vụ:** *${uncompleted[0].title}*!` : '🎉 Hoàn hảo! Em đã làm chủ quy hoạch tuyến tính!'}`;
    }
  }

  // Phản hồi mẫu chung cho các bài học khác
  return `### 🎓 Gia sư STEM & English Lab
Em đang thao tác bài **${context.simulationTitle}** (Lớp ${context.grade}).
- Hiện trạng phòng lab đã được ghi nhận. Em hãy quan sát sự biến thiên của các thông số khi thay đổi giá trị điều khiển.
- Các nhiệm vụ phía bên phải màn hình sẽ tự động tích xanh ngay khi em điều chỉnh hệ thống đạt chuẩn yêu cầu!
*(Em có thể kết nối Gemini API Key ở cài đặt để kích hoạt tính năng AI Tutor đối thoại chuyên sâu 24/7).*`;
}

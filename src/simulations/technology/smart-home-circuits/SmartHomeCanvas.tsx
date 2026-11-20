import React, { useRef, useEffect } from 'react';
import { SmartHomeState } from './types';
import { calculateSmartHomeMetrics } from './smartHomeEngine';

interface SmartHomeCanvasProps {
  state: SmartHomeState;
  onChange: (patch: Partial<SmartHomeState>) => void;
}

export const SmartHomeCanvas: React.FC<SmartHomeCanvasProps> = ({ state }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fanAngleRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);

  const metrics = calculateSmartHomeMetrics(state);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let running = true;

    const render = () => {
      if (!running) return;

      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      const isDark = document.documentElement.classList.contains('dark');
      const textColor = isDark ? '#f8fafc' : '#0f172a';

      // Tính toán màu nền bầu trời dựa theo Lux
      const skyFactor = Math.min(1, Math.max(0, state.ambientLightLux / 800));
      // Từ đêm tối (#020617) sang ngày sáng (#38bdf8)
      const rSky = Math.round(2 + skyFactor * 54);
      const gSky = Math.round(6 + skyFactor * 183);
      const bSky = Math.round(23 + skyFactor * 225);
      const skyColor = `rgb(${rSky}, ${gSky}, ${bSky})`;

      const cx = width / 2;
      const cy = height / 2;

      if (state.viewMode === 'house-view') {
        // =====================================================================
        // MODE 1: MÔ HÌNH NGÔI NHÀ THÔNG MINH 2D
        // =====================================================================
        // 1. Nền bầu trời & Đất
        ctx.fillStyle = skyColor;
        ctx.fillRect(0, 0, width, height - 70);

        // Mặt trăng hoặc Mặt trời
        if (state.ambientLightLux > 300) {
          // Mặt trời rực rỡ
          ctx.fillStyle = '#f59e0b';
          ctx.beginPath();
          ctx.arc(80, 70, 28, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Mặt trăng đêm
          ctx.fillStyle = '#e2e8f0';
          ctx.beginPath();
          ctx.arc(80, 70, 22, 0, Math.PI * 2);
          ctx.fill();
          // Bóng che tạo trăng khuyết
          ctx.fillStyle = skyColor;
          ctx.beginPath();
          ctx.arc(88, 66, 18, 0, Math.PI * 2);
          ctx.fill();
        }

        // Mặt đất
        ctx.fillStyle = isDark ? '#0f172a' : '#334155';
        ctx.fillRect(0, height - 70, width, 70);
        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(0, height - 70);
        ctx.lineTo(width, height - 70);
        ctx.stroke();

        // 2. NGÔI NHÀ THÔNG MINH
        const houseW = 480;
        const houseH = 260;
        const houseX = cx - houseW / 2;
        const houseY = height - 70 - houseH;

        // Thân nhà
        ctx.fillStyle = isDark ? '#1e293b' : '#f8fafc';
        ctx.strokeStyle = isDark ? '#334155' : '#cbd5e1';
        ctx.lineWidth = 3;
        ctx.fillRect(houseX, houseY, houseW, houseH);
        ctx.strokeRect(houseX, houseY, houseW, houseH);

        // Mái nhà tam giác
        ctx.fillStyle = '#b91c1c'; // Mái ngói đỏ
        ctx.beginPath();
        ctx.moveTo(houseX - 25, houseY);
        ctx.lineTo(cx, houseY - 70);
        ctx.lineTo(houseX + houseW + 25, houseY);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#991b1b';
        ctx.lineWidth = 3;
        ctx.stroke();

        // 3. BAN CÔNG BÊN TRÁI & ĐÈN TỰ ĐỘNG LDR
        const balconyW = 140;
        const balconyH = 100;
        const balconyX = houseX + 25;
        const balconyY = houseY + 30;

        ctx.strokeStyle = isDark ? '#475569' : '#94a3b8';
        ctx.lineWidth = 2;
        ctx.strokeRect(balconyX, balconyY, balconyW, balconyH);

        // Đèn ban công gắn trần
        const lampX = balconyX + balconyW / 2;
        const lampY = balconyY + 8;
        const isBalconyOn = state.isAutoMode ? metrics.relayState === 'CLOSED' : state.isBalconyLightOn;

        if (isBalconyOn) {
          // Quầng sáng đèn ban công hình nón rọi xuống
          const glow = ctx.createRadialGradient(lampX, lampY, 5, lampX, lampY + 50, 75);
          glow.addColorStop(0, 'rgba(253, 224, 71, 0.85)');
          glow.addColorStop(0.7, 'rgba(250, 204, 21, 0.35)');
          glow.addColorStop(1, 'rgba(250, 204, 21, 0)');
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.moveTo(lampX, lampY);
          ctx.lineTo(balconyX, balconyY + balconyH);
          ctx.lineTo(balconyX + balconyW, balconyY + balconyH);
          ctx.closePath();
          ctx.fill();
        }

        // Bóng đèn
        ctx.fillStyle = isBalconyOn ? '#facc15' : '#64748b';
        ctx.beginPath();
        ctx.arc(lampX, lampY, 8, 0, Math.PI * 2);
        ctx.fill();

        // Nhãn cảm biến LDR
        ctx.fillStyle = textColor;
        ctx.font = 'bold 10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`Cảm biến LDR: ${state.ambientLightLux} Lux`, lampX, balconyY - 8);

        // 4. PHÒNG KHÁCH BÊN PHẢI (QUẠT THÔNG GIÓ & ĐÈN PIR)
        const livingW = 240;
        const livingH = 180;
        const livingX = houseX + 200;
        const livingY = houseY + 40;

        ctx.strokeStyle = isDark ? '#475569' : '#94a3b8';
        ctx.lineWidth = 2;
        ctx.strokeRect(livingX, livingY, livingW, livingH);

        // Quạt trần thông gió (Ceiling Fan)
        const fanX = livingX + livingW / 2;
        const fanY = livingY + 35;
        const isFanRunning = metrics.fanSpeedRpm > 0;

        if (isFanRunning) {
          fanAngleRef.current += (metrics.fanSpeedRpm / 2400) * 0.45;
        }

        // Vẽ cánh quạt xoay
        ctx.save();
        ctx.translate(fanX, fanY);
        ctx.rotate(fanAngleRef.current);
        ctx.fillStyle = isFanRunning ? '#06b6d4' : '#64748b';
        for (let b = 0; b < 3; b++) {
          ctx.rotate((Math.PI * 2) / 3);
          ctx.beginPath();
          ctx.roundRect(-5, -28, 10, 26, 4);
          ctx.fill();
        }
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(0, 0, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Nhãn quạt
        ctx.fillStyle = textColor;
        ctx.font = 'bold 10px sans-serif';
        ctx.fillText(
          isFanRunning ? `Quạt: ${metrics.fanSpeedRpm} RPM` : `Quạt: TẮT (${state.temperatureC}°C)`,
          fanX,
          fanY + 42
        );

        // Cửa ra vào & Cảm biến PIR
        const doorW = 55;
        const doorH = 95;
        const doorX = livingX + 25;
        const doorY = livingY + livingH - doorH;

        ctx.fillStyle = '#78350f';
        ctx.fillRect(doorX, doorY, doorW, doorH);
        ctx.strokeStyle = '#451a03';
        ctx.lineWidth = 2;
        ctx.strokeRect(doorX, doorY, doorW, doorH);

        // Cảm biến chuyển động PIR gắn trên cửa
        ctx.fillStyle = state.motionDetected ? '#ef4444' : '#22c55e';
        ctx.beginPath();
        ctx.arc(doorX + doorW / 2, doorY - 10, 6, 0, Math.PI * 2);
        ctx.fill();

        if (state.motionDetected) {
          // Sóng radar quét người
          ctx.strokeStyle = '#ef444488';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(doorX + doorW / 2, doorY - 10, 22, -Math.PI / 4, Math.PI / 4);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(doorX + doorW / 2, doorY - 10, 36, -Math.PI / 4, Math.PI / 4);
          ctx.stroke();
        }

        // Người hoạt hình ở cửa nếu motionDetected
        if (state.motionDetected) {
          const personX = doorX - 35;
          const personY = height - 70;
          // Đầu
          ctx.fillStyle = '#f59e0b';
          ctx.beginPath();
          ctx.arc(personX, personY - 60, 10, 0, Math.PI * 2);
          ctx.fill();
          // Thân
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(personX, personY - 50);
          ctx.lineTo(personX, personY - 20);
          // Chân
          ctx.lineTo(personX - 10, personY);
          ctx.moveTo(personX, personY - 20);
          ctx.lineTo(personX + 10, personY);
          ctx.stroke();
        }

        // Bảng trạng thái năng lượng & thiết bị
        ctx.fillStyle = isDark ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.9)';
        ctx.strokeStyle = isDark ? '#334155' : '#cbd5e1';
        ctx.lineWidth = 1.5;
        ctx.roundRect(width - 230, 25, 205, 120, 10);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = textColor;
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('HỆ THỐNG SMART HOME IOT', width - 215, 45);

        ctx.font = '10px monospace';
        ctx.fillStyle = metrics.relayState === 'CLOSED' ? '#10b981' : '#ef4444';
        ctx.fillText(`• Rơ-le Đèn: ${metrics.relayState === 'CLOSED' ? 'ĐÓNG (SÁNG)' : 'NGẮT (TẮT)'}`, width - 215, 68);

        ctx.fillStyle = isFanRunning ? '#06b6d4' : '#64748b';
        ctx.fillText(`• Quạt mát: ${isFanRunning ? `${metrics.fanSpeedRpm} RPM` : 'TẮT'}`, width - 215, 88);

        ctx.fillStyle = '#f59e0b';
        ctx.fillText(`• Công suất tải: ${metrics.totalEnergyWatts} Watt`, width - 215, 108);
        ctx.fillText(`• Chế độ: ${state.isAutoMode ? 'TỰ ĐỘNG (SMART)' : 'THỦ CÔNG'}`, width - 215, 128);
      } else {
        // =====================================================================
        // MODE 2: SƠ ĐỒ MẠCH ĐIỆN TỬ NGUYÊN LÝ (SCHEMATIC)
        // =====================================================================
        ctx.fillStyle = textColor;
        ctx.font = 'bold 15px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('SƠ ĐỒ NGUYÊN LÝ MẠCH CẢM BIẾN ÁNH SÁNG & RƠ-LE ĐIỀU KHIỂN', cx, 40);

        // Vẽ đường nguồn +5V và GND
        const topRailY = 90;
        const bottomRailY = height - 90;
        const leftRailX = cx - 240;
        const rightRailX = cx + 240;

        ctx.strokeStyle = '#ef4444'; // Đường +5V đỏ
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(leftRailX, topRailY);
        ctx.lineTo(rightRailX, topRailY);
        ctx.stroke();

        ctx.strokeStyle = '#3b82f6'; // Đường GND xanh
        ctx.beginPath();
        ctx.moveTo(leftRailX, bottomRailY);
        ctx.lineTo(rightRailX, bottomRailY);
        ctx.stroke();

        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 12px monospace';
        ctx.fillText('+5V DC', leftRailX - 35, topRailY + 4);
        ctx.fillStyle = '#3b82f6';
        ctx.fillText('GND 0V', leftRailX - 35, bottomRailY + 4);

        // Nhánh 1: Cầu phân áp LDR (trên) và Điện trở 10k (dưới)
        const branch1X = cx - 120;
        ctx.strokeStyle = isDark ? '#38bdf8' : '#0284c7';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(branch1X, topRailY);
        ctx.lineTo(branch1X, topRailY + 40);
        ctx.stroke();

        // Khối LDR
        drawSchematicBox(ctx, branch1X, topRailY + 65, 70, 36, `LDR: ${metrics.ldrResistanceKohm}kΩ`, '#f59e0b', isDark);

        // Điểm giữa cầu phân áp
        const vDivY = cy;
        ctx.beginPath();
        ctx.moveTo(branch1X, topRailY + 85);
        ctx.lineTo(branch1X, bottomRailY - 85);
        ctx.stroke();

        // Khối R_fixed 10k
        drawSchematicBox(ctx, branch1X, bottomRailY - 65, 70, 36, 'R: 10kΩ', '#a855f7', isDark);

        ctx.beginPath();
        ctx.moveTo(branch1X, bottomRailY - 45);
        ctx.lineTo(branch1X, bottomRailY);
        ctx.stroke();

        // Dây tín hiệu V_out nối từ điểm giữa sang Transistor
        const transX = cx + 50;
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(branch1X, vDivY);
        ctx.lineTo(transX - 30, vDivY);
        ctx.stroke();

        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 11px monospace';
        ctx.fillText(`V_out = ${metrics.sensorVoltageV}V`, branch1X + 50, vDivY - 8);

        // Khối Transistor NPN / Vi điều khiển
        drawSchematicBox(ctx, transX, vDivY, 80, 50, 'Transistor\nNPN', '#10b981', isDark);

        // Nhánh Rơ-le và Đèn LED tải
        const relayX = cx + 170;
        ctx.strokeStyle = isDark ? '#38bdf8' : '#0284c7';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(transX + 40, vDivY);
        ctx.lineTo(relayX, vDivY);
        ctx.lineTo(relayX, topRailY + 50);
        ctx.stroke();

        // Cuộn hút Rơ-le
        drawSchematicBox(
          ctx,
          relayX,
          topRailY + 75,
          80,
          40,
          `Rơ-le (${metrics.relayState})`,
          metrics.relayState === 'CLOSED' ? '#10b981' : '#ef4444',
          isDark
        );

        ctx.beginPath();
        ctx.moveTo(relayX, topRailY + 95);
        ctx.lineTo(relayX, topRailY);
        ctx.stroke();

        // Tải bóng đèn 220V
        drawSchematicBox(
          ctx,
          relayX,
          bottomRailY - 70,
          80,
          40,
          `Đèn LED\n${metrics.relayState === 'CLOSED' ? '15W (SÁNG)' : 'TẮT'}`,
          metrics.relayState === 'CLOSED' ? '#facc15' : '#64748b',
          isDark
        );

        ctx.beginPath();
        ctx.moveTo(relayX, bottomRailY - 50);
        ctx.lineTo(relayX, bottomRailY);
        ctx.stroke();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      running = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [state, metrics]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-3 select-none">
      <canvas
        ref={canvasRef}
        width={780}
        height={480}
        className="w-full h-full max-w-4xl max-h-[560px] bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl"
      />
    </div>
  );
};

function drawSchematicBox(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  text: string,
  color: string,
  isDark: boolean
) {
  ctx.save();
  ctx.fillStyle = isDark ? '#0f172a' : '#ffffff';
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;
  ctx.fillRect(x - w / 2, y - h / 2, w, h);
  ctx.strokeRect(x - w / 2, y - h / 2, w, h);

  ctx.fillStyle = isDark ? '#f8fafc' : '#0f172a';
  ctx.font = 'bold 10px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const lines = text.split('\n');
  if (lines.length === 1) {
    ctx.fillText(lines[0], x, y);
  } else {
    ctx.fillText(lines[0], x, y - 7);
    ctx.fillText(lines[1], x, y + 7);
  }
  ctx.restore();
}

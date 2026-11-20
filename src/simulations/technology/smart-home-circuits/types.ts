export type SmartHomeViewMode = 'house-view' | 'schematic-view';

export interface SmartHomeState {
  viewMode: SmartHomeViewMode;
  // Môi trường
  ambientLightLux: number; // 0 to 1000 Lux (0 = Đêm, 1000 = Trưa nắng)
  temperatureC: number; // 20 to 45 °C
  motionDetected: boolean; // Có người đi qua cảm biến PIR

  // Cấu hình ngưỡng kích hoạt
  lightThresholdLux: number; // Mặc định 200 Lux
  tempThresholdC: number; // Mặc định 32 °C
  isAutoMode: boolean; // Chế độ điều khiển tự động bật

  // Trạng thái thiết bị đầu ra
  isBalconyLightOn: boolean;
  isLivingRoomLightOn: boolean;
  isCoolingFanOn: boolean;
  alarmBuzzerActive: boolean;
}

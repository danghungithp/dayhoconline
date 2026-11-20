export interface SeasonInfo {
  nameVi: string;
  nameEn: string;
  approxDate: string;
  subsolarLatitude: string;
  northernHemisphere: string;
  southernHemisphere: string;
  dayLengthHanoi: string;
}

export function getSeasonDetails(angleDeg: number): SeasonInfo {
  const norm = ((angleDeg % 360) + 360) % 360;

  if (norm >= 45 && norm < 135) {
    return {
      nameVi: 'Hạ Chí (Summer Solstice)',
      nameEn: 'Summer Solstice',
      approxDate: 'Khoảng 22/6',
      subsolarLatitude: 'Chí tuyến Bắc (23°27′ B)',
      northernHemisphere: 'Mùa Hè (Ngày dài hơn đêm, nhiệt độ cao)',
      southernHemisphere: 'Mùa Đông (Đêm dài hơn ngày, nhiệt độ thấp)',
      dayLengthHanoi: '~13 giờ 20 phút (Ngày dài nhất năm)',
    };
  }

  if (norm >= 135 && norm < 225) {
    return {
      nameVi: 'Thu Phân (Autumnal Equinox)',
      nameEn: 'Autumnal Equinox',
      approxDate: 'Khoảng 23/9',
      subsolarLatitude: 'Xích đạo (0°)',
      northernHemisphere: 'Mùa Thu (Ngày và đêm dài bằng nhau: 12h - 12h)',
      southernHemisphere: 'Mùa Xuân (Ngày và đêm dài bằng nhau)',
      dayLengthHanoi: '12 giờ 00 phút',
    };
  }

  if (norm >= 225 && norm < 315) {
    return {
      nameVi: 'Đông Chí (Winter Solstice)',
      nameEn: 'Winter Solstice',
      approxDate: 'Khoảng 22/12',
      subsolarLatitude: 'Chí tuyến Nam (23°27′ N)',
      northernHemisphere: 'Mùa Đông (Đêm dài hơn ngày, nhiệt độ thấp)',
      southernHemisphere: 'Mùa Hè (Ngày dài hơn đêm, nhiệt độ cao)',
      dayLengthHanoi: '~10 giờ 40 phút (Ngày ngắn nhất năm)',
    };
  }

  return {
    nameVi: 'Xuân Phân (Vernal Equinox)',
    nameEn: 'Vernal Equinox',
    approxDate: 'Khoảng 21/3',
    subsolarLatitude: 'Xích đạo (0°)',
    northernHemisphere: 'Mùa Xuân (Ngày và đêm dài bằng nhau: 12h - 12h)',
    southernHemisphere: 'Mùa Thu (Ngày và đêm dài bằng nhau)',
    dayLengthHanoi: '12 giờ 00 phút',
  };
}

export function formatTimeUTC(baseHour: number, offsetHours: number): string {
  let h = (baseHour + offsetHours) % 24;
  if (h < 0) h += 24;
  const hours = Math.floor(h);
  const minutes = Math.floor((h - hours) * 60);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

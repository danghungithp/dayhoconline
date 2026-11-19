/**
 * STEM & English Interactive Lab
 * Bộ giải mã & mã hóa trạng thái mô phỏng (Preset Codec)
 * An toàn tuyệt đối với tiếng Việt, ký tự Unicode và URL Search Params (?preset=...)
 */

/**
 * Mã hóa object trạng thái mô phỏng thành chuỗi URL-safe Base64
 * Hỗ trợ đầy đủ tiếng Việt và ký tự UTF-8 đặc biệt
 */
export function encodePreset<T extends Record<string, unknown> = Record<string, unknown>>(
  state: T
): string {
  try {
    if (!state || typeof state !== 'object') {
      return '';
    }

    // Lọc bỏ các giá trị hàm hoặc circular references (nếu có)
    const jsonStr = JSON.stringify(state, (key, value) => {
      if (typeof value === 'function' || value === undefined) {
        return undefined;
      }
      return value;
    });

    // Chuyển chuỗi UTF-8 sang mảng bytes qua TextEncoder
    const utf8Bytes = new TextEncoder().encode(jsonStr);

    // Chuyển Uint8Array sang chuỗi nhị phân an toàn theo từng khối (tránh tràn callstack)
    let binary = '';
    const chunkSize = 8192;
    for (let i = 0; i < utf8Bytes.length; i += chunkSize) {
      const chunk = utf8Bytes.subarray(i, i + chunkSize);
      binary += String.fromCharCode.apply(null, Array.from(chunk));
    }

    // Base64 tiêu chuẩn rồi chuyển đổi sang URL-Safe Base64 (- thay +, _ thay /, bỏ =)
    return btoa(binary)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  } catch (error) {
    console.warn('[presetCodec] Lỗi khi mã hóa trạng thái preset:', error);
    try {
      // Dự phòng khẩn cấp: encodeURIComponent tiêu chuẩn
      return encodeURIComponent(JSON.stringify(state));
    } catch {
      return '';
    }
  }
}

/**
 * Giải mã chuỗi param ?preset=... thành object trạng thái mô phỏng
 * Có cơ chế tự sửa lỗi và an toàn khi URL bị người dùng sửa sai / tampered
 */
export function decodePreset<T extends Record<string, unknown> = Record<string, unknown>>(
  encodedParam: string | null | undefined
): T | null {
  if (!encodedParam || typeof encodedParam !== 'string' || encodedParam.trim() === '') {
    return null;
  }

  const clean = encodedParam.trim();

  // Chiến lược 1: Thử giải mã URL-safe Base64 + UTF-8
  try {
    let base64 = clean.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4 !== 0) {
      base64 += '=';
    }

    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    const jsonStr = new TextDecoder().decode(bytes);
    const parsed = JSON.parse(jsonStr);

    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as T;
    }
  } catch {
    // Không phải Base64 UTF-8, thử tiếp chiến lược 2
  }

  // Chiến lược 2: Dự phòng giải mã URI Component (định dạng URL encode thông thường)
  try {
    const rawDecoded = decodeURIComponent(clean);
    const parsed = JSON.parse(rawDecoded);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as T;
    }
  } catch {
    // Không phải URI encoded JSON, thử tiếp chiến lược 3
  }

  // Chiến lược 3: Thử trực tiếp JSON thô
  try {
    const parsed = JSON.parse(clean);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as T;
    }
  } catch {
    // URL đã bị chỉnh sửa sai hoặc không hợp lệ
  }

  console.warn('[presetCodec] Chuỗi preset URL không hợp lệ hoặc bị hỏng, trả về null:', clean);
  return null;
}

/**
 * Tạo URL hoàn chỉnh để chia sẻ mô phỏng kèm trạng thái
 */
export function getShareableUrl(
  simulationId: string,
  state?: Record<string, unknown>,
  baseHref?: string
): string {
  try {
    const origin = baseHref || (typeof window !== 'undefined' ? window.location.origin + window.location.pathname : '');
    const url = new URL(origin, typeof window !== 'undefined' ? window.location.href : 'http://localhost');
    
    url.searchParams.set('sim', simulationId);

    if (state && Object.keys(state).length > 0) {
      const encoded = encodePreset(state);
      if (encoded) {
        url.searchParams.set('preset', encoded);
      }
    } else {
      url.searchParams.delete('preset');
    }

    return url.toString();
  } catch (error) {
    console.error('[presetCodec] Lỗi khi tạo URL chia sẻ:', error);
    return '';
  }
}

/**
 * Đọc tham số URL hiện tại của trình duyệt
 */
export function readSimulationUrlParams(): {
  simId: string | null;
  presetData: Record<string, unknown> | null;
  rawPreset: string | null;
} {
  if (typeof window === 'undefined') {
    return { simId: null, presetData: null, rawPreset: null };
  }

  try {
    const params = new URLSearchParams(window.location.search);
    const simId = params.get('sim');
    const rawPreset = params.get('preset');
    const presetData = decodePreset(rawPreset);

    return {
      simId: simId && simId.trim() !== '' ? simId.trim() : null,
      presetData,
      rawPreset: rawPreset && rawPreset.trim() !== '' ? rawPreset.trim() : null,
    };
  } catch (error) {
    console.error('[presetCodec] Lỗi đọc URL params:', error);
    return { simId: null, presetData: null, rawPreset: null };
  }
}

/**
 * Sao chép liên kết chia sẻ vào clipboard của người dùng
 */
export async function copyShareableUrl(
  simulationId: string,
  state?: Record<string, unknown>
): Promise<{ success: boolean; url: string; error?: string }> {
  const url = getShareableUrl(simulationId, state);
  if (!url) {
    return { success: false, url: '', error: 'Không thể tạo URL hợp lệ' };
  }

  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(url);
      return { success: true, url };
    }

    // Dự phòng khi clipboard API bị giới hạn (insecure origin hoặc iframe)
    const textArea = document.createElement('textarea');
    textArea.value = url;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    textArea.style.top = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);

    if (successful) {
      return { success: true, url };
    }
    return { success: false, url, error: 'Trình duyệt chặn truy cập Clipboard' };
  } catch (err: any) {
    return { success: false, url, error: err.message || 'Lỗi sao chép' };
  }
}

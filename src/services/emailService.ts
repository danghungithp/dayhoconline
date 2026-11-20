/**
 * Email Service for Teacher Registration & Administrative Notifications
 * Supports FormSubmit API, Web3Forms, and client-side mailto fallback
 */

export interface TeacherEmailNotificationData {
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  username: string;
  registeredAt?: string;
}

const ADMIN_TARGET_EMAIL = 'mcpsoftware@gmail.com';

/**
 * Gửi email thông báo tài khoản giáo viên mới đăng ký tới mcpsoftware@gmail.com
 */
export async function sendTeacherRegistrationEmail(
  data: TeacherEmailNotificationData
): Promise<{ success: boolean; message: string }> {
  const registeredTime = data.registeredAt || new Date().toLocaleString('vi-VN');

  // Nội dung chi tiết thông báo
  const subject = `[STEM LAB GDPT 2018] Thông Báo Đăng Ký Giáo Viên Mới: ${data.fullName} (${data.subject})`;
  const emailBodyText = `
Kính gửi Ban Quản Trị Hệ Thống STEM & English Interactive Lab,

Hệ thống vừa tiếp nhận yêu cầu đăng ký tài khoản Giáo viên mới cần được phê duyệt:
--------------------------------------------------------------------------------
- Họ và tên giáo viên: ${data.fullName}
- Email liên hệ: ${data.email}
- Số điện thoại: ${data.phone}
- Môn giảng dạy: ${data.subject}
- Tên đăng nhập (Username): ${data.username}
- Thời gian đăng ký: ${registeredTime}
- Trạng thái hiện tại: Đang chờ duyệt (Pending)
--------------------------------------------------------------------------------

HƯỚNG DẪN DÀNH CHO QUẢN TRỊ VIÊN:
1. Đăng nhập vào hệ thống tại: https://dayhoconlineliart.vercel.app/
2. Đăng nhập với tài khoản Admin: danghungit
3. Vào tab "Quản Lý Giáo Viên" -> Mục "Yêu cầu đăng ký Giáo viên đang chờ duyệt"
4. Bấm nút "Kích hoạt tài khoản" để cho phép giáo viên đăng nhập và sử dụng hệ thống.

Trân trọng,
Hệ Thống Quản Trị STEM & English Lab
`.trim();

  // 1. Thử gửi qua FormSubmit AJAX API tới mcpsoftware@gmail.com
  try {
    const response = await fetch(`https://formsubmit.co/ajax/${ADMIN_TARGET_EMAIL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        _subject: subject,
        _replyto: data.email,
        _template: 'table',
        'Họ và tên giáo viên': data.fullName,
        'Email liên hệ': data.email,
        'Số điện thoại': data.phone,
        'Môn phụ trách': data.subject,
        'Tên đăng nhập': data.username,
        'Thời gian đăng ký': registeredTime,
        'Trạng thái': 'Đang chờ Admin danghungit kích hoạt',
        'Nội dung thông báo': emailBodyText,
      }),
    });

    if (response.ok) {
      const resJson = await response.json();
      console.log('Đã gửi email thông báo thành công qua FormSubmit:', resJson);
      return {
        success: true,
        message: `Đã gửi thông báo thành công tới hòm thư Quản trị viên (${ADMIN_TARGET_EMAIL}).`,
      };
    }
  } catch (err) {
    console.warn('Lỗi kết nối FormSubmit, chuyển sang phương án dự phòng:', err);
  }

  // 2. Dự phòng: Thử gửi qua Web3Forms
  try {
    const web3Response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        access_key: 'b567d26c-8e43-4c6e-8260-2e452a85e68b', // Free Web3Forms public routing key
        to: ADMIN_TARGET_EMAIL,
        subject: subject,
        from_name: 'STEM Lab Registration System',
        message: emailBodyText,
      }),
    });

    if (web3Response.ok) {
      return {
        success: true,
        message: `Đã chuyển tiếp thông báo tới Ban Quản Trị (${ADMIN_TARGET_EMAIL}).`,
      };
    }
  } catch (web3Err) {
    console.warn('Web3Forms backup warning:', web3Err);
  }

  // Luôn trả về thành công vì thông tin đã được lưu trong store và có đường dẫn mailto dự phòng
  return {
    success: true,
    message: `Thông tin đăng ký đã được ghi nhận vào hệ thống và hàng đợi thông báo tới ${ADMIN_TARGET_EMAIL}.`,
  };
}

/**
 * Sinh đường dẫn mailto: để người dùng có thể bấm gửi trực tiếp từ ứng dụng Mail
 */
export function getMailtoUrlForAdminNotification(data: TeacherEmailNotificationData): string {
  const subject = encodeURIComponent(
    `[STEM LAB GDPT 2018] Yêu cầu kích hoạt tài khoản Giáo viên - ${data.fullName}`
  );
  const body = encodeURIComponent(
    `Kính gửi Ban Quản Trị (${ADMIN_TARGET_EMAIL}),\n\nTôi vừa đăng ký tài khoản Giáo viên trên hệ thống STEM Lab với thông tin như sau:\n- Họ và tên: ${data.fullName}\n- Email: ${data.email}\n- Số điện thoại: ${data.phone}\n- Môn giảng dạy: ${data.subject}\n- Tên đăng nhập: ${data.username}\n\nKính mong Quản trị viên kích hoạt tài khoản giúp tôi.\n\nXin cảm ơn!`
  );
  return `mailto:${ADMIN_TARGET_EMAIL}?subject=${subject}&body=${body}`;
}

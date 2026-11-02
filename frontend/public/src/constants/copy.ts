import type { AuthCopy } from '@shared/auth/CredentialsForm'

export const authCopy: AuthCopy = {
  loginTitle: 'Chào mừng trở lại',
  loginIntro: 'Đăng nhập để tiếp tục hành trình nghề nghiệp.',
  forgotTitle: 'Quên mật khẩu?',
  forgotIntro: 'Nhập email để nhận liên kết đặt lại mật khẩu.',
  resetTitle: 'Đặt mật khẩu mới',
  resetIntro: 'Chọn mật khẩu mới cho tài khoản của bạn.',
  emailLabel: 'Email',
  emailPlaceholder: 'ban@email.com',
  passwordLabel: 'Mật khẩu',
  newPasswordLabel: 'Mật khẩu mới',
  passwordPlaceholder: 'Nhập mật khẩu',
  confirmLabel: 'Xác nhận mật khẩu',
  showPassword: 'Hiện mật khẩu',
  hidePassword: 'Ẩn mật khẩu',
  submitLogin: 'Đăng nhập',
  submitForgot: 'Gửi liên kết',
  submitReset: 'Đặt lại mật khẩu',
  submitting: 'Đang xử lý…',
  forgotLink: 'Quên mật khẩu?',
  backToLogin: 'Quay lại đăng nhập',
  goToLogin: 'Đến trang đăng nhập',
  forgotSuccess: 'Đã gửi hướng dẫn đặt lại mật khẩu vào email của bạn.',
  resetSuccess: 'Mật khẩu đã được đặt lại. Bạn có thể đăng nhập.',
  invalidEmail: 'Email chưa đúng định dạng.',
  passwordRequired: 'Nhập mật khẩu.',
  passwordMin: 'Mật khẩu cần ít nhất 8 ký tự.',
  confirmMismatch: 'Mật khẩu xác nhận chưa khớp.',
  missingToken: 'Liên kết đặt lại mật khẩu không hợp lệ.',
  genericError: 'Yêu cầu không thành công. Vui lòng thử lại.',
}

export const guardCopy = {
  loadingLabel: 'Đang kiểm tra phiên đăng nhập…',
  errorLabel: 'Không tải được phiên đăng nhập.',
  retryLabel: 'Thử lại',
  signOutLabel: 'Đăng xuất',
}

export const FALLBACK_NAME = 'Ứng viên'

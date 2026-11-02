# react-hook-form

Giữ state từng ô nhập và lỗi của ô đó. Không thay thế validation, không gọi API.

## Vì sao có

Form cũ là một chuỗi `useState` cho email, password, loading, error, fieldErrors. Mỗi cổng một bản. Thêm field là thêm state và thêm chỗ reset khi submit.

React Hook Form đăng ký từng input (`register` hoặc `Controller`). Chỉ ô đổi thì ô đó render lại. Submit nhận object đã gom, không đọc từng `useState`.

## MatchingJobs dùng ở đâu

| Form | File |
|------|------|
| Login, quên mật khẩu, đặt lại mật khẩu | `frontend/shared/auth/CredentialsForm.tsx` |
| Tạo / sửa job seeker | `frontend/admin/src/pages/job-seekers/JobSeekerFormPage.tsx` |

`register("email")` trả `name`, `onChange`, `onBlur`, `ref`. `TextField` và `PasswordField` dùng `forwardRef` để ref đó gắn vào `<input>` thật.

Form để `noValidate` để trình duyệt không hiện popup riêng, cạnh lỗi của mình.

## Quy tắc

- Luật "hợp lệ hay không" nằm ở Zod, không rải `required` trong JSX.
- Lỗi 422 từ Laravel gắn lại bằng `setError` (`frontend/shared/forms/applyApiErrors.ts`). Page không đọc `error.errors.email[0]`.
- `isSubmitting` của form là trạng thái nút. Không thêm `useState` loading song song.

## Cài

```bash
yarn add react-hook-form@^7.65.0
```

Chạy trong `frontend/public`, `frontend/company`, và `frontend/admin`.

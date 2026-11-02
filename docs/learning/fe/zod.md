# zod

Schema: mô tả dữ liệu hợp lệ, và từ schema đó suy ra type TypeScript (`z.infer`).

## Vì sao có

Backend đã validate (Form Request). Frontend validate trước để người dùng thấy lỗi ngay, và để type của form không bị viết tay lệch so với luật.

Một schema làm cả hai. Harukky khai báo Yup nhưng luật thật nằm trong chuỗi `rules` rời, message hard-code, type form viết riêng.

## MatchingJobs dùng ở đâu

| Schema | File |
|--------|------|
| Email / mật khẩu login, forgot, reset | `frontend/shared/auth/CredentialsForm.tsx` |
| Job seeker create và edit | `frontend/admin/src/pages/job-seekers/formValues.ts` |

Ví dụ luật edit: mật khẩu để trống thì được (không đổi), có nhập thì tối thiểu 8 ký tự — khớp `JobSeekerUpdateRequest` bên Laravel. Create thì mật khẩu bắt buộc, cũng tối thiểu 8.

`z.infer<typeof jobSeekerSchema>` là type của `useForm`. Không viết lại interface song song.

Gender, job seeking status, account status là `z.enum` các chuỗi `"1" | "2" | "9"` vì `<select>` luôn trả string. `toPayload` mới đổi sang number trước khi gọi API.

## Quy tắc

- Schema mô tả input của form, không mô tả JSON backend. Resource PHP là nguồn cho type ở service (`JobSeeker` trong `job-seeker.service.ts`).
- Message trong schema là câu user đọc. Public/company tiếng Việt. Admin tiếng Anh.
- Zod 3 (`z.string().email()`). Đừng trộn API Zod 4 (`z.email()`).

## Cài

```bash
yarn add zod@^3.25.76
```

Chạy trong `frontend/public`, `frontend/company`, và `frontend/admin`.

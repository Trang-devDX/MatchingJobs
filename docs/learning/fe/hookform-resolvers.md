# @hookform/resolvers

Cầu nối. Nó không validate và không giữ state form. Nó đưa một schema (ở đây là Zod) vào `resolver` của React Hook Form.

## Vì sao có

React Hook Form hiểu `resolver` theo một chữ ký riêng (giá trị vào, lỗi trả về đúng shape của form). Zod hiểu `safeParse`. Resolver dịch hai phía, để `formState.errors.email.message` hiện dưới ô input.

Harukky cài package này cùng Yup rồi không gọi. MatchingJobs gọi thật, với Zod.

## MatchingJobs dùng ở đâu

```ts
useForm({ resolver: zodResolver(schema) })
```

- `frontend/shared/auth/CredentialsForm.tsx`
- `frontend/admin/src/pages/job-seekers/JobSeekerFormPage.tsx` — schema đổi giữa tạo mới và sửa, nên được `useMemo` theo `isEdit`.

Import đúng đường này:

```ts
import { zodResolver } from '@hookform/resolvers/zod'
```

## Quy tắc

- Một form một resolver. Không vừa `rules={{ required: true }}` vừa Zod cho cùng một field.
- Package này phụ thuộc cặp `react-hook-form` + `zod`. Cài cả ba.

## Cài

```bash
yarn add @hookform/resolvers@^5.2.2
```

Chạy trong `frontend/public`, `frontend/company`, và `frontend/admin`.

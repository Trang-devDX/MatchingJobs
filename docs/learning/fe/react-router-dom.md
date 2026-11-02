# react-router-dom

Bộ định tuyến cho SPA. URL đổi, React đổi màn, trình duyệt không tải lại cả trang.

## Vì sao có

Ba app cũ đọc `window.location.pathname` một lần trong `App`. Bấm link là `<a href>`, trình duyệt tải lại document. Không có layout lồng nhau, không có 404, guard phải tự `location.replace`.

Router tách hai việc: **URL nào** và **ai được vào**.

## MatchingJobs dùng ở đâu

| Việc | File |
|------|------|
| Bảng route | `frontend/*/src/app/App.tsx` |
| Khách / đã đăng nhập | `frontend/shared/auth/guards.tsx` |
| Khung sidebar, `<Outlet>` là chỗ trang con hiện | `frontend/shared/ui/AppShell.tsx`, `AuthLayout.tsx` |
| Link không reload | `Link`, `NavLink` trong shell và landing |

Ba nhóm route:

- `GuestOnly` — đã có session thì khỏi ở form login.
- `RequireAuth` — chưa có token thì `/login?redirect=`.
- `reset-password` đứng ngoài `GuestOnly` để link trong email vẫn mở khi trình duyệt còn session cũ.

`redirect` chỉ nhận path cùng origin. `//evil.com` bị bỏ (`frontend/shared/auth/redirect.ts`).

401 vẫn `window.location.assign`. Đó là cố ý: lỗi session thì tải lại cả trang, không giữ cache React Query trong bộ nhớ.

## Quy tắc

- Path khai báo trong `src/constants/routes.ts`. JSX không hard-code `"/job-seekers"` rải rác nếu constant đã có.
- Trang lấy id bằng `useParams()`, không `pathname.split("/")`.
- `<Link>` / `navigate()` cho điều hướng trong app. Full reload chỉ cho hết phiên.

## Cài

```bash
yarn add react-router-dom@^7.9.4
```

Chạy trong `frontend/public`, `frontend/company`, và `frontend/admin`.

# @tanstack/react-query

Cache cho **dữ liệu server**: dashboard, profile, danh sách job seeker. Không dùng cho token.

## Vì sao có

`useEffect` + `useState` mỗi trang tự fetch, tự nuốt lỗi, tự giữ mảng. Đổi trang hoặc StrictMode gọi API hai lần. Xóa một dòng rồi tự sửa mảng trong tay dễ lệch pagination.

React Query giữ kết quả theo **query key**. Cùng key thì dùng lại. Key đổi (search, page, id) là cache khác.

## MatchingJobs dùng ở đâu

| Việc | File |
|------|------|
| Client mặc định: không retry, không refetch khi focus, stale 30 giây | `frontend/shared/query/client.ts` |
| Profile: query key `['auth', 'profile']`, chỉ chạy khi còn token | `frontend/shared/auth/AuthProvider.tsx` |
| Dashboard | `frontend/*/src/hooks/useDashboard.ts` |
| List / detail / save / delete | `frontend/admin/src/hooks/useJobSeekers.ts` |

Luồng đúng:

```
Page → hook (useQuery / useMutation) → service → api.request
```

Page không biết URL. Sau khi save hoặc delete, hook `invalidateQueries({ queryKey: ['job-seekers'] })` để list tự fetch lại. Không lọc mảng tại chỗ.

`signal` từ `queryFn` được truyền xuống `fetch` để hủy request khi key đổi hoặc component unmount.

Login gọi `queryClient.setQueryData` với user vừa nhận, để màn sau không chờ thêm một request `me`.

Token không nằm trong React Query. Token ở `localStorage`, qua `frontend/shared/auth/session.ts`.

## Quy tắc

- Server data: `useQuery` / `useMutation`. Session: `useAuth`.
- Không `fetch` trong page.
- Sau mutation làm đổi list, `invalidateQueries`. Không tự sửa mảng đang hiển thị.
- `retry: false` là mặc định của project. Lỗi 422 và 401 không nên tự gọi lại.

## Cài

```bash
yarn add @tanstack/react-query@^5.90.5
```

Chạy trong `frontend/public`, `frontend/company`, và `frontend/admin`. Devtools là package riêng, cài bằng `-D`.
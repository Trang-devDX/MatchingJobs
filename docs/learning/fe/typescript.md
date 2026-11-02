# typescript

Kiểm tra kiểu lúc viết và lúc `yarn typecheck` / `yarn build`. Vite vẫn dùng esbuild để chạy dev. `typescript` không có trong bundle gửi cho trình duyệt.

## Vì sao có

Ba app trước là JSX không type. Envelope API, user, lỗi field đều là giá trị ngầm. README gốc đã ghi TypeScript trong khi code là JavaScript.

TypeScript ở đây để **hợp đồng với API** đọc được: `LoginResult`, `JobSeeker`, `PageMeta`. Sai field là lỗi lúc gõ, không phải lúc bấm Save.

## MatchingJobs dùng ở đâu

| Việc | File |
|------|------|
| Compiler options chung (`strict`, JSX, không emit) | `frontend/tsconfig.base.json` |
| Alias `@/*` và `@shared/*` | `frontend/*/tsconfig.json` |
| Biến `import.meta.env.VITE_API_URL` | `frontend/*/src/vite-env.d.ts` |
| Kiểu response | `frontend/shared/api/types.ts` |
| Kiểu session | `frontend/shared/auth/session.ts` |

`yarn build` chạy `tsc --noEmit` trước `vite build`. Type sai thì không ra bản build.

`frontend/shared` không có `package.json` và không có `tsc` riêng. Mỗi app `include` thư mục `../shared`, nên `yarn typecheck` trong một app cũng kiểm tra shared.

## Quy tắc

- `strict` bật. Không thêm `any` để qua lỗi.
- Type của JSON backend nằm cạnh service (`JobSeeker` trong `job-seeker.service.ts`). Type của ô form suy ra từ Zod (`z.infer`), không viết hai bản.
- `vite.config.js` giữ JavaScript để không cần `@types/node` chỉ vì file cấu hình.

## Cài

```bash
yarn add -D typescript@^5.9.3
```

DevDependency. Chạy trong `frontend/public`, `frontend/company`, và `frontend/admin`.

# @tanstack/react-query-devtools

Panel nổi trên trình duyệt để xem cache React Query: key nào đang có, đang fetch, stale hay fresh.

## Vì sao có

Query key và `staleTime` là thứ dễ tưởng tượng sai. Devtools cho nhìn cache thật thay vì đoán từ UI.

Chỉ phục vụ lúc học và lúc dev. Không phải thư viện UI của sản phẩm.

## MatchingJobs dùng ở đâu

Mỗi `frontend/*/src/app/App.tsx` render:

```tsx
{import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />}
```

`import.meta.env.DEV` là `false` khi `yarn build`. Panel không hiện ở bản production. Package vẫn phải có lúc build vì import là câu lệnh tĩnh — Vite cần resolve được module.

## Quy tắc

- DevDependency (`yarn add -D`).
- Không gọi devtools trong page. Một chỗ, cạnh `QueryClientProvider`, là đủ.
- Không dựa vào devtools để sửa bug production.

## Cài

```bash
yarn add -D @tanstack/react-query-devtools@^5.90.2
```

Chạy trong `frontend/public`, `frontend/company`, và `frontend/admin`. Cài sau `@tanstack/react-query`.

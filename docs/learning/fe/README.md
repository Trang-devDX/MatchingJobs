# Thư viện frontend đang thêm

React và React DOM **đã có** từ trước (`react` / `react-dom` 19.2). Bảng dưới là các package **mới**, đã ghi trong `package.json` của cả ba app, chưa cài vào `node_modules`.

Không cài trong `frontend/shared`. Shared chỉ là source. Package resolve từ `node_modules` của app đang chạy.

| Package | Loại | Doc |
|---------|------|-----|
| `react-router-dom` | dependency | [react-router-dom.md](./react-router-dom.md) |
| `@tanstack/react-query` | dependency | [tanstack-react-query.md](./tanstack-react-query.md) |
| `@tanstack/react-query-devtools` | devDependency | [tanstack-react-query-devtools.md](./tanstack-react-query-devtools.md) |
| `react-hook-form` | dependency | [react-hook-form.md](./react-hook-form.md) |
| `@hookform/resolvers` | dependency | [hookform-resolvers.md](./hookform-resolvers.md) |
| `zod` | dependency | [zod.md](./zod.md) |
| `tailwindcss` | devDependency | [tailwindcss.md](./tailwindcss.md) |
| `@tailwindcss/vite` | devDependency | [tailwindcss-vite.md](./tailwindcss-vite.md) |
| `clsx` | dependency | [clsx.md](./clsx.md) |
| `tailwind-merge` | dependency | [tailwind-merge.md](./tailwind-merge.md) |
| `lucide-react` | dependency | [lucide-react.md](./lucide-react.md) |
| `typescript` | devDependency | [typescript.md](./typescript.md) |
| `typescript-eslint` | devDependency | [typescript-eslint.md](./typescript-eslint.md) |

Cài **từng lệnh**, trong **từng app** (`frontend/public`, `frontend/company`, `frontend/admin`). Version dưới khớp `package.json`.

```bash
yarn add react-router-dom@^7.9.4
yarn add @tanstack/react-query@^5.90.5
yarn add react-hook-form@^7.65.0
yarn add @hookform/resolvers@^5.2.2
yarn add zod@^3.25.76
yarn add clsx@^2.1.1
yarn add tailwind-merge@^3.3.1
yarn add lucide-react@^0.552.0
yarn add -D tailwindcss@^4.1.16
yarn add -D @tailwindcss/vite@^4.1.16
yarn add -D @tanstack/react-query-devtools@^5.90.2
yarn add -D typescript@^5.9.3
yarn add -D typescript-eslint@^8.46.2
```

`-D` là devDependency: chỉ cần khi dev và khi chạy `yarn build` / `yarn typecheck` / `yarn lint`. Không ship vào logic runtime, trừ devtools (import trong code nhưng Vite chỉ bật khi `import.meta.env.DEV`).

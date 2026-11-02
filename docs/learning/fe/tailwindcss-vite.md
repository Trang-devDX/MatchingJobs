# @tailwindcss/vite

Plugin Vite của Tailwind 4. Nó đọc `@import "tailwindcss"` và sinh CSS lúc dev và lúc build.

## Vì sao có

Tailwind 3 cần `postcss.config.js`, `autoprefixer`, và `tailwind.config.js`. Tailwind 4 trên Vite gom bước đó vào một plugin. Ba app không có PostCSS.

Không có plugin này thì `@import "tailwindcss"` và `@theme` trong CSS không được xử lý. Class trên JSX sẽ không có style.

## MatchingJobs dùng ở đâu

`frontend/public/vite.config.js`, và bản tương ứng của company (port 5174) và admin (port 5173):

```js
import tailwindcss from '@tailwindcss/vite'

plugins: [react(), tailwindcss()]
```

Plugin chạy trong process Vite của từng app. Vì thế package phải nằm trong `devDependencies` của từng app, dù CSS token nằm ở `frontend/shared`.

## Quy tắc

- Không thêm `postcss.config.js` cho Tailwind.
- Không cấu hình `content: []` kiểu Tailwind 3. Nguồn class là `@source` trong `src/index.css`.
- Sửa `theme.css` xong mà màu không đổi: kiểm tra app đã cài plugin và `index.css` đã `@import` file đó.

## Cài

```bash
yarn add -D @tailwindcss/vite@^4.1.16
```

Chạy trong `frontend/public`, `frontend/company`, và `frontend/admin`. Cài cùng `tailwindcss`.

# tailwindcss

CSS theo utility class trên JSX: `bg-brand`, `text-muted`, `rounded-xl`. Không file CSS cho từng component.

## Vì sao có

Ba app cũ mỗi nơi một `App.css`, cùng một màu viết lại bằng hex (`#172b4d`, `#225ca5`, `#b42318`). Sửa brand là sửa nhiều file, và class `text-button` có lúc không được định nghĩa.

Tailwind 4 để token màu ở một chỗ. Class không dùng sẽ không có trong CSS build.

Harukky dùng Tailwind 3 (PostCSS, `tailwind.config.js`). MatchingJobs dùng Tailwind 4 vì Vite 8 đã có: cấu hình nằm trong CSS, không thêm file PostCSS.

## MatchingJobs dùng ở đâu

Token và font:

```css
/* frontend/shared/styles/theme.css */
@theme {
  --color-ink: #172b4d;
  --color-brand: #225ca5;
  --color-brand-bright: #3973c6;
  --color-muted: #748197;
  --color-danger: #b42318;
  --color-canvas: #f4f7fb;
  --color-line: #e3e8f0;
}
```

`--color-brand` thành class `bg-brand`, `text-brand`, `border-brand`.

Mỗi app chỉ việc kéo Tailwind và token vào, rồi chỉ cho Tailwind đọc cả shared:

```css
/* frontend/public/src/index.css — company và admin giống vậy */
@import "tailwindcss";
@import "../../shared/styles/theme.css";
@source "../../shared";
@source ".";
```

`@source "../../shared"` là bắt buộc. Không có dòng này, class nằm trong `frontend/shared` sẽ mất ở bản build.

## Quy tắc

- Màu brand dùng token (`bg-brand`), không viết lại hex trong JSX.
- Layout mới dùng class có sẵn của shell (`AppShell`, `AuthLayout`, `Button`). Không thêm một `App.css` thứ hai.
- `tailwind-merge` giải quyết hai class đụng nhau. Xem doc riêng.

## Cài

```bash
yarn add -D tailwindcss@^4.1.16
```

DevDependency. Chạy trong `frontend/public`, `frontend/company`, và `frontend/admin`. Cài kèm `@tailwindcss/vite`.

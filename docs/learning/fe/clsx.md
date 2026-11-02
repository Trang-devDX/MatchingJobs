# clsx

Ghép class name. Bỏ giá trị `false`, `null`, `undefined`. Nhận object điều kiện.

## Vì sao có

Chuỗi class nối bằng template `` `a ${active ? 'b' : ''}` `` nhanh thành khó đọc, và dễ dính khoảng trắng thừa. `clsx` chỉ làm đúng việc đó.

Nó **không** hiểu Tailwind. Hai class `px-2` và `px-4` cùng lúc thì cả hai vẫn còn trong chuỗi. Việc "class sau thắng" là của `tailwind-merge`.

## MatchingJobs dùng ở đâu

Không import `clsx` trong page. Một hàm `cn` bọc cả `clsx` và `tailwind-merge`:

```ts
// frontend/shared/lib/cn.ts
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

Ví dụ điều kiện: nút nav active trong `frontend/shared/ui/AppShell.tsx`, pill Active/Disabled trong `JobSeekerListPage.tsx`.

```tsx
cn('rounded-xl px-3 py-2', isActive ? 'bg-brand text-white' : 'text-ink hover:bg-canvas')
```

## Quy tắc

- Page và component dùng `cn`, không gọi `clsx` trực tiếp.
- Điều kiện boolean đưa vào `cn`. Không nối chuỗi tay.

## Cài

```bash
yarn add clsx@^2.1.1
```

Chạy trong `frontend/public`, `frontend/company`, và `frontend/admin`.

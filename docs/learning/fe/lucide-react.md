# lucide-react

Bộ icon dạng component React. Import icon nào thì bundle icon đó.

## Vì sao có

Shell cũ dùng ký tự `▦` và `♙` làm icon nav. Không thống nhất, và không có trạng thái (ẩn/hiện mật khẩu) rõ ràng.

Harukky vừa có hàng trăm file SVG tự viết, vừa cài `lucide-react`. MatchingJobs chỉ dùng một bộ. Không thêm thư mục `components/ui/icons`.

## MatchingJobs dùng ở đâu

| Icon | Chỗ |
|------|-----|
| `LayoutDashboard`, `Users` | Sidebar public, company, admin (`src/pages/shell`) |
| `Eye`, `EyeOff` | Hiện / ẩn mật khẩu trong `frontend/shared/ui/PasswordField.tsx` |

`AppShell` nhận `icon: LucideIcon` trên từng mục nav và render `<Icon size={16} />`. Thêm mục menu là thêm một dòng trong mảng `items`, không thêm file SVG.

## Quy tắc

- Import tên icon, không import cả thư viện (`import { Users } from 'lucide-react'`).
- Icon trang trí để `aria-hidden`. Nút chỉ có icon thì phải có `aria-label` (nút hiện mật khẩu đang làm vậy).
- Không thêm icon pack thứ hai.

## Cài

```bash
yarn add lucide-react@^0.552.0
```

Chạy trong `frontend/public`, `frontend/company`, và `frontend/admin`.

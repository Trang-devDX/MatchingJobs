# tailwind-merge

Khi hai utility Tailwind đụng nhau, giữ class có ý nghĩa sau. `px-2` và `px-4` cùng lúc thì còn `px-4`.

## Vì sao có

Component có class mặc định, chỗ gọi truyền thêm class. Nối chuỗi thì cả hai cùng tồn tại và CSS thắng theo thứ tự trong file sinh ra, không theo thứ tự mình viết. `tailwind-merge` nhìn nhóm utility (padding, màu, display) và bỏ class cũ trong cùng nhóm.

`clsx` không làm việc này. Vì thế `cn` gọi `clsx` trước, `twMerge` sau.

Version 3 là bản đi với Tailwind 4. Đừng cài v2 (bản Harukky đang dùng cho Tailwind 3).

## MatchingJobs dùng ở đâu

`frontend/shared/lib/cn.ts` là chỗ duy nhất gọi `twMerge`.

`buttonClass` trong `frontend/shared/ui/buttonStyles.ts` dùng `cn` để variant (`bg-brand`) và class thêm từ ngoài (`mt-6`, `w-full`) gộp lại. `NotFound` truyền `buttonClass('primary', 'mt-6')` cho một `<Link>` trông như nút.

## Quy tắc

- Không gọi `twMerge` trong page. Gọi `cn`.
- Class ghi đè (margin, width, padding) truyền vào tham số cuối của `cn` / `buttonClass`.

## Cài

```bash
yarn add tailwind-merge@^3.3.1
```

Chạy trong `frontend/public`, `frontend/company`, và `frontend/admin`.

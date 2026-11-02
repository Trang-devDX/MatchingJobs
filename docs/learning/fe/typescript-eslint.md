# typescript-eslint

ESLint đọc được file `.ts` / `.tsx`. Không có nó, parser mặc định chỉ hiểu JavaScript và `yarn lint` bỏ qua hoặc báo lỗi cú pháp trên code TypeScript.

## Vì sao có

`tsc` và ESLint trả lời hai câu khác nhau.

- `tsc` — kiểu có đúng không (`string` gán vào `number`, quên return).
- ESLint — quy ước và một số bug React (`react-hooks`, component export lẫn hàm làm hỏng Fast Refresh).

Chỉ cài TypeScript thì `yarn lint` chưa soi file mới. Chỉ cài ESLint cũ thì file `.tsx` không được parse.

## MatchingJobs dùng ở đâu

`frontend/public/eslint.config.js`, cùng nội dung ở company và admin:

```js
import tseslint from 'typescript-eslint'

files: ['src/**/*.{ts,tsx}']
extends: [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  reactHooks.configs.flat.recommended,
  reactRefresh.configs.vite,
]
```

Chỉ lint `src` của app đó. `frontend/shared` được `tsc` kiểm tra qua `tsconfig` `include`, không bị lint ba lần.

File `.ts` (hook, service) tắt rule `react-refresh/only-export-components`, vì rule đó dành cho file component.

## Quy tắc

- `yarn typecheck` và `yarn lint` đều phải chạy trước khi coi một app là xong. Một cái không thay cái kia.
- Không tắt `recommended` cả gói để hết lỗi. Sửa chỗ báo, hoặc tắt một rule với lý do nằm trong config.
- DevDependency. Không import `typescript-eslint` trong code React.

## Cài

```bash
yarn add -D typescript-eslint@^8.46.2
```

Chạy trong `frontend/public`, `frontend/company`, và `frontend/admin`. Cài sau `typescript`.

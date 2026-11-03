# Frontend — ba cổng, một cách nghĩ

Đọc sau khi đã xem [01-KIEN-TRUC.md](./01-KIEN-TRUC.md). File này giải thích frontend MatchingJobs **sau đợt tách lớp**, không phải bản copy Harukky.

## 1. Ba app vẫn là ba app

`frontend/public` (5175), `frontend/company` (5174), `frontend/admin` (5173) vẫn build và deploy riêng. Không gộp thành một SPA.

Cái được gom là phần **lặp thật**: client HTTP, session, form đăng nhập, shell, nút, ô nhập. Chúng nằm ở `frontend/shared` và mỗi app import bằng alias `@shared`.

Đây không phải npm package. Không có `package.json` trong `shared`. Vite của từng app trỏ `@shared` vào thư mục đó và bundle cùng app. Ba app vẫn khai báo cùng một danh sách dependency, vì React và React Router phải resolve từ `node_modules` của app đang chạy.

Chưa nâng lên Yarn workspace. Mỗi app đã có lockfile và Yarn 4 riêng. Workspace là một lần đổi package manager, không phải lần đổi kiến trúc UI. Làm khi việc cài dependency ba lần bắt đầu gây lỗi lệch version.

## 2. Một request đi qua bốn lớp

Giống backend: mỗi lớp chỉ trả lời một câu hỏi.

| Lớp | Câu hỏi | Không được làm |
|-----|---------|----------------|
| **Page** | Người dùng thấy gì? | `fetch`, đọc `localStorage` |
| **Hook** | Cache nào, khi nào refetch? | Biết URL |
| **Service** | Gọi endpoint nào, body là gì? | Biết component nào đang mở |
| **API client** | Gắn token, đọc envelope, 401 thì sao? | Biết nghiệp vụ job seeker |

Ví dụ admin:

```
JobSeekerListPage → useJobSeekers → JobSeekerService.list → api.request
```

Page không biết URL. Service không biết bảng đang ở trang mấy trong React. Client không biết đây là job seeker hay dashboard.

Harukky cũng tách `services` + `hooks` + `dto`. Điểm yếu của Harukky là ba bản copy của client, và page đôi khi vẫn biết quá nhiều về Axios. MatchingJobs giữ cách tách, nhưng client chỉ có một bản trong `shared`.

## 3. Hai loại state, đừng trộn

**Server state** là dữ liệu backend sở hữu: dashboard, danh sách job seeker, profile. React Query giữ nó. Query key là danh tính của cache (`['job-seekers', { search, page }]`). Đổi search hoặc page là một cache khác. Xóa một dòng thì `invalidateQueries`, không tự sửa mảng trong tay — trang sau còn đúng.

**Session** là credential, không phải server cache. Token nằm trong `localStorage` (cùng key cũ: `matchingjobs.jobseeker.token`, `matchingjobs.company.token`, `matchingjobs.admin.token`). Profile thì fetch bằng React Query khi token còn. Login ghi token, rồi `setQueryData` để màn hình sau không phải chờ thêm một vòng `me`.

Không dùng Redux. Harukky dùng Redux cho auth trong khi server data đã ở React Query, và cấu hình `redux-persist` dù không cài package đó. Một context là đủ cho "ai đang đăng nhập".

## 4. Auth không phải một if trong App

Route khai báo ý đồ:

- `GuestOnly` — đã đăng nhập thì không ở lại form login.
- `RequireAuth` — chưa có token thì về `/login?redirect=`. Redirect chỉ nhận path cùng origin. `//evil.com` bị bỏ.
- `reset-password` đứng ngoài `GuestOnly`. Link trong email phải mở được cả khi trình duyệt còn session cũ.

401 trên request **đã gắn token** thì xóa session và tải lại trang login. Login gửi `token: null`, nên sai mật khẩu ở lại form, không tự reload.

Backend có `POST /refresh`, nhưng login **không** trả refresh token riêng. JWT refresh của Laravel dùng chính access token còn hạn. Harukky gọi refresh bằng Axios trần, URL tương đối, và không bao giờ lưu refresh token — luồng đó không chạy. MatchingJobs chưa làm refresh. Hết `expires_in` thì đăng xuất. Thêm refresh sau, khi còn hạn, bằng chính client này, không thêm thư viện.

Profile lỗi (không phải 401) hiện màn hình lỗi, có Thử lại và Đăng xuất. Bản cũ nuốt lỗi bằng `.catch(() => {})` rồi vẫn vẽ dashboard với tên fallback.

## 5. Form

`react-hook-form` giữ state ô nhập. `zod` là schema: một chỗ cho luật và cho kiểu TypeScript (`z.infer`). `@hookform/resolvers` nối hai thứ đó.

Harukky khai báo `yup` và `@hookform/resolvers` nhưng không dùng. Luật nằm rải trong `rules={{ required: '...' }}`. Schema dùng thật thì đỡ hơn dependency để đó.

Lỗi 422 của Laravel là `{ errors: { email: ['...'] } }`. `applyApiErrors` gắn message vào đúng field. Page không tự đọc `error.errors.email[0]`.

## 6. UI

Tailwind 4, token màu trong `frontend/shared/styles/theme.css`. Ba cổng dùng cùng ink / brand / danger, cùng `AppShell`, cùng màn login tách đôi. Public trước đây là thẻ giữa trang, company/admin là panel thương hiệu — giờ một layout.

Không có bộ icon SVG tự vẽ hàng trăm file như Harukky. `lucide-react` cho vài icon điều hướng. Không có MUI/Ant: app còn nhỏ, một design system ngoài sẽ lớn hơn chính sản phẩm.

Ngôn ngữ: public và company là tiếng Việt, admin là tiếng Anh. Chưa thêm i18next. Harukky cấu hình detector đa ngôn ngữ nhưng chỉ có `en`, và phần lớn chữ vẫn hard-code. Thêm i18n khi có ngôn ngữ thứ hai thật.

## 7. Cố ý không mang từ Harukky

| Thư viện Harukky | Vì sao chưa dùng |
|------------------|------------------|
| axios | `fetch` + một client là đủ. Interceptor của Harukky có lỗi refresh. |
| Redux | Session là một context. Server state là React Query. |
| yup | Đã chọn zod và dùng thật. |
| dayjs và date-fns | Cả hai đều có trong Harukky; date-fns không được gọi. Ngày ở admin format bằng `Date`. |
| i18next | Một ngôn ngữ mỗi cổng. |
| firebase, leaflet, echo, quill, swiper, framer-motion, lodash | Feature chưa có ở MatchingJobs. Đừng cài trước. |

## 8. Việc bạn cần làm trước khi chạy

Trong **từng** thư mục `frontend/public`, `frontend/company`, `frontend/admin`:

```bash
yarn
yarn dev
```

`yarn` ở đây là cài dependency đã khai trong `package.json`. Đừng `yarn` trong `frontend/shared`.

Chưa chạy được app trong lúc refactor vì các package này chưa được cài.

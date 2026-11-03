# Kiến trúc codebase

## 1. Bài toán gốc

Một ứng dụng “chạy được” và một ứng dụng “sống được 2 năm” khác nhau ở **ranh giới**.

Khi không có ranh giới:

- Controller chứa SQL, hash password, gửi mail, format JSON.
- Đổi DB hoặc đổi JSON response làm vỡ mọi thứ.
- Không test được logic mà không đứng HTTP.

Kiến trúc không phải để đẹp. Nó để **thay đổi một phần mà không phá phần còn lại**.

## 2. MatchingJobs đang là gì?

```
frontend/public   (job seeker, :5175)
frontend/company  (staff/company, :5174)
frontend/admin    (admin, :5173)
        \  |  /
     HTTP JSON + Bearer JWT
            |
      backend Laravel  (/api/admin, /api/company, /api/jobseeker)
            |
     PostgreSQL + (Redis/Mail trong Compose)
```

**Quyết định tách 3 frontend** (Harukky và MatchingJobs giống nhau):

| Lý do tốt | Cái giá |
|-----------|---------|
| Deploy, auth, UX, branding khác nhau | Trùng `api.js`, hook, layout |
| Giảm nguy cơ lộ UI admin cho public bundle | Ba pipeline build |
| Team có thể tách sau này | Convention phải siết, nếu không 3 app lệch nhau |

Ba app vẫn tách. Phần đã lặp thật (client HTTP, session, form login, shell) nằm ở `frontend/shared`, import bằng alias `@shared`. Đó là extract khi đau lặp logic, không phải một npm package. Chi tiết: [07-FRONTEND.md](./07-FRONTEND.md).

## 3. Layer backend (quy ước dự án)

Luồng **bắt buộc** trong MatchingJobs:

```
Route → Controller → Form Request (validate)
                  → Service (business)
                  → Repository (data)
                  → Eloquent Model
Controller ← API Resource / ApiResponse
```

### Mỗi lớp chịu một loại câu hỏi

| Lớp | Câu hỏi nó được phép trả lời | Câu hỏi nó không được trả |
|-----|------------------------------|---------------------------|
| **Controller** | HTTP method nào? Status code nào? | User được thuê không? SQL thế nào? |
| **Form Request** | Input có hợp lệ không? | Tạo user ra sao? |
| **Service** | Nghiệp vụ: tạo job seeker gồm User + JobSeeker trong 1 transaction | Raw query chi tiết? Header HTTP? |
| **Repository** | Tìm/lưu bản ghi thế nào? | Có được apply job khi hết hạn không? |
| **Resource** | JSON ra ngoài trông thế nào? | Có được xóa không? |
| **Model** | Quan hệ, cast, fillable | Workflow tuyển dụng |

`docs/CONVENTION.md` siết **đặt tên** (`fetch` vs `find`) để người mới đọc code biết lớp đang đứng. Đó là maintainability: não không phải đoán.

### Ví dụ thật trong MatchingJobs

`JobSeekerController` chỉ: nhận request đã validate, gọi service, bọc Resource.

`JobSeekerService::createJobSeeker` mới: set status, ghép name, `DB::transaction`, gọi repository.

Đây là đúng hướng.

## 4. Nhìn Harukky — học, đừng thờ

Harukky ghi “Clean Architecture”. Thực tế đây là **Layered Architecture kiểu Laravel**, không phải Clean Architecture kinh điển (không có entity thuần, use-case độc lập framework).

Gọi đúng tên rất quan trọng. Senior không gắn nhãn Clean khi code vẫn `Eloquent` xuyên service.

### Điểm tốt nên học

- Tách route theo portal (`apiAdmin`, `apiCompany`, `apiJobSeeker`).
- Envelope JSON thống nhất (`ApiResponse`).
- Upload qua **interface** + local/S3 implementation (sẽ gặp ở docs S3).
- Notification nhiều kênh (mail, database, FCM).

### Điểm không nên copy mù

1. **`new JobService()` trong constructor** (một số controller Harukky).  
   Laravel có **Dependency Injection**. `new` làm khó mock khi test và giấu dependency. MatchingJobs inject `private readonly JobSeekerService` — **giữ cách này**.

2. **“Service không được gọi Service khác”** (docs Harukky).  
   Ý định: tránh mạng lưới phụ thuộc. Hệ quả: logic dùng chung bị nhét repository hoặc copy. Cách senior hơn: cho phép **application service** gọi **domain service** nhỏ, cấm **cyclic** (A↔B) và cấm service HTTP gọi lung tung. Khi MatchingJobs lớn, mentor sẽ chỉ chỗ được gọi chéo.

3. **Dashboard dùng `DB::table` thay vì Model.**  
   Ổn khi bảng chưa có model. Không ổn nếu biến thành thói quen: mất observer, soft delete, quan hệ. Khi làm job listing, hãy tạo Model tử tế.

4. **Docs và code phải cùng một ngôn ngữ frontend.**  
   MatchingJobs dùng TypeScript cho cả ba cổng. Đừng khai báo thêm một ngôn ngữ thứ hai “cho giống Harukky” rồi để file JS cũ sống song song.

## 5. Nguyên lý thiết kế (nền, không buzzword)

Học 5 cái này, đủ dùng 80% quyết định:

**Single Responsibility** — một class một lý do để đổi. Controller đổi khi HTTP đổi; Service đổi khi luật tuyển dụng đổi.

**Dependency Inversion** — phụ thuộc abstraction khi *có hơn một cách* (local vs S3). Đừng tạo interface cho mọi Repository “cho có”.

**Fail at the boundary** — validate sớm (Form Request), lỗi nghiệp vụ thành exception có `render()` JSON, đừng `try/catch` nuốt lỗi rồi trả 200.

**Explicit over clever** — tên `fetchJobSeekerList` dài nhưng grep được. Magic helper 50 trách nhiệm thì “ngầu” một tuần.

**Idempotency & transactions** — tạo User + JobSeeker phải cùng transaction. Nếu User insert xong JobSeeker fail, bạn có rác. MatchingJobs đã làm đúng chỗ create job seeker.

## 6. Frontend architecture

Ba cổng dùng React Router, React Query, và một client `fetch` dùng chung. Page không gọi HTTP. Đọc [07-FRONTEND.md](./07-FRONTEND.md) trước khi thêm màn hình mới.

Token vẫn ở `localStorage`. Dễ XSS hơn `httpOnly cookie`. Ba origin khác nhau làm cookie cross-site khó, nên JWT Bearer là **trade-off có ý thức**, không phải best practice tuyệt đối.

## 7. Quy tắc khi bạn thêm feature vào MatchingJobs

1. Viết **use case 3–5 câu** (ai, làm gì, thành công/thất bại).
2. Quyết định **guard + policy** (admin/staff/job seeker).
3. Migration chỉ khi schema hiện có **không đủ** — đừng tạo bảng vì “sẽ cần”.
4. Đủ bộ: Request, Service, Repository, Resource, Feature test tối thiểu.
5. Frontend: page → hook → service → client. Không `fetch` trong JSX.

## 8. Sai lầm phổ biến

- God Service 2000 dòng.
- Repository trả JSON sẵn (lẫn format với data).
- Controller `return JobSeeker::all()`.
- Thêm Redux, axios, hoặc i18n vì Harukky có. MatchingJobs đã chọn một cách; đừng chồng cách thứ hai lên.
- Implement matching algorithm trước khi có job + profile. Không có data thì không có matching.

## 9. Bài tập (không cần PR)

Mở `backend/app/Http/Controllers/Api/Admin/JobSeekerController.php` và `JobSeekerService.php`. Viết tay (giấy hoặc note):

- 4 việc controller **không** làm.
- Chuyện gì xảy ra nếu `insertJobSeeker` fail giữa chừng nếu **không** có `DB::transaction`?

Buổi sau mentor sẽ hỏi lại hai câu đó trước khi đụng Docker sâu hoặc module mới.

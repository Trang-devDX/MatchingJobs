# Thực hành senior (xuyên suốt mọi phase)

Những thứ này không phải “feature”, nhưng thiếu thì không phải production-ready.

## 1. Bảo mật ứng dụng web (OWASP tối thiểu)

- **Authn ≠ Authz.** JWT chứng minh *ai*; Policy chứng minh *được làm gì*. Admin CRUD job seeker hiện dựa guard `administrators` — tạm ổn. Khi staff xem ứng viên, **phải** lọc `company_id`, không tin id trên URL.
- **Mass assignment:** `$request->all()` vào model là thảm họa. Form Request `validated()` + fillable/guarded.
- **IDOR:** `GET /job-seekers/{id}` — user A không được ra user B. UUID khó đoán hơn int, **không thay** authorization.
- **Rate limit:** MatchingJobs throttle login `10,1` — đúng hướng brute force.
- **Secret:** `.env`, JWT_SECRET, AWS, Firebase JSON.
- **XSS:** React escape mặc định; `dangerouslySetInnerHTML` (job description HTML) là điểm nóng — sanitize.
- **CORS:** `cors.php` permissive lúc học; production whitelist đúng origin 3 portal.
- **Upload:** xem docs S3.

## 2. API design

- Version tư duy: breaking change khó. Envelope `{ success, data, message, meta }` đã chọn — giữ nhất quán.
- HTTP status: 201 create, 422 validate, 401/403 tách. Convention đã ghi; đừng trả 200 + `success: false` cho mọi thứ (một số API cũ làm vậy — MatchingJobs có `success` **và** status: dùng cả hai cho client cũ, nhưng status phải đúng).
- Pagination: list job seeker đã `ApiResponse::paginated`. List lớn không `::all()`.
- Idempotent GET; POST create không gọi 2 lần nếu client retry — sau này dùng Idempotency-Key cho payment.

OpenAPI (`docs/api.yaml`): Harukky có, MatchingJobs **thiếu** dù Compose mount Swagger. Senior coi contract API là sản phẩm. Khi làm module mới, viết spec hoặc generate, đừng để Swagger 404.

## 3. Database

- Migration là lịch sử. Không sửa migration đã chạy trên máy người khác; thêm migration mới.
- Foreign key, index cho cột filter (`email`, `company_id`, `status`).
- Soft delete: hiểu `deleted_at` — unique email phải tính bản ghi xóa.
- N+1: `with()` eager load. Feature test có thể bắt.
- MatchingJobs schema rộng: **đừng migrate:fresh** trên dữ liệu quý.

## 4. Queue & mail

Mail trong request HTTP làm login chậm và fail theo SMTP. Laravel queue: request chỉ `Mail::queue`, worker gửi.

Compose có Redis nhưng `.env.example` backend có thể `QUEUE_CONNECTION=database`. Senior **khớp** docs với config thật. Mailcatcher chỉ local.

Job phải idempotent: worker crash-retry.

## 5. Test

Thứ tự giá trị:

1. Feature test API (auth, 422, 403, happy path) — Harukky/MatchingJobs đã có mầm `AuthControllerTest`.
2. Không thay thế bằng “test” chỉ assert `true`.
3. Không e2e Playwright cho mọi thứ khi API còn mỏng.

Khi thêm Job Listing: test tạo/list/filter **trước hoặc cùng** code — định nghĩa xong mới implementation.

## 6. Git & CI

- Commit nhỏ theo ý định. Không commit `.env`, `node_modules`, `vendor`.
- Harukky có GitLab CI + MR template. MatchingJobs học: pipeline tối thiểu `phpunit` + `eslint` + `php-cs-fixer dry-run`.
- Review bản thân: diff có secret không, có `dd()` không.

## 7. Observability

- `Log::error` có context (id), không dump request cả password.
- Health `/up`.
- Khi có worker: monitor failed jobs.

## 8. Frontend senior (vẫn JS)

- Một API client.
- Error state / empty / loading — dashboard đang happy-path.
- Accessibility sau; đừng `div` giả button cho login.
- TypeScript: nâng **khi** convention ổn, không giữa sprint copy Harukky `.tsx` lẫn `.jsx`.

## 9. Gap kiến thức nền mentor sẽ chủ động dạy

Khi đụng từng phase:

| Gap | Xuất hiện khi |
|-----|----------------|
| TCP vs HTTP, DNS | Docker network |
| Process, PID 1, signal | Supervisor |
| JWT structure (header/payload/sig) | Auth sâu |
| ACID transaction | Create user+profile |
| CAP / cache stampede | Redis cache listing |
| TLS, cookie SameSite | Cân JWT vs cookie |
| Webhook retry | Stripe/FCM |
| Complexity thuật toán | Matching/search |

Bạn không cần học hết trước. Học **đúng lúc đau**.

## 10. Quy tắc mentor trong MatchingJobs

- Không paste nguyên module Harukky.
- Mỗi PR học: 1 ý kiến trúc viết trong mô tả (dù chỉ local).
- Nếu bạn yêu cầu “code giúp Stripe ngay”, mentor sẽ hỏi use case tiền tệ trước.

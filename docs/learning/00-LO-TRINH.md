# Lộ trình học (không nhảy cóc)

Mục tiêu: hiểu **thiết kế → cấu trúc → vận hành → tích hợp bên thứ ba**.  
Thứ tự dưới đây có lý do. Đảo thứ tự thường tạo “feature chạy được nhưng không bảo trì được”.

## Nguyên tắc học

- **Một khái niệm, một vòng lặp:** đọc docs → xem Harukky → so MatchingJobs → viết/sửa **một** chỗ nhỏ → giải thích lại bằng lời của bạn.
- **Schema ≠ sản phẩm.** MatchingJobs có rất nhiều bảng (job, chat, screening) nhưng chưa có model/API. Senior không “code hết migration”. Senior hỏi: *use case nào cần trước?*
- **Copy có điều kiện.** Chỉ copy pattern sau khi nêu được: vấn đề nó giải, trade-off, và chỗ nào bạn sẽ làm khác.

## Các phase

### Phase 0 — Bản đồ hệ thống (bạn đang ở đây)

Hiểu monorepo: 1 API + 3 frontend. Hiểu *ai nói chuyện với ai*.

**Kiến thức nền thường thiếu (sẽ được dạy):** HTTP, REST vs RPC, JSON envelope, authentication vs authorization, env vs config, 12-factor (config trong môi trường, process stateless).

**Bài tập tư duy (chưa code):**
1. Vẽ trên giấy: browser → Vite/Nginx → Laravel → Postgres/Redis.
2. Nêu 3 loại user và vì sao tách 3 app thay vì 1 app + role.

### Phase 1 — Kiến trúc & convention

Đọc [01-KIEN-TRUC.md](./01-KIEN-TRUC.md).  
Nắm: Controller / Form Request / Service / Repository / Resource.  
Nắm: tại sao MatchingJobs inject service qua constructor, còn một số controller Harukky `new Service()` là điểm yếu.

**Chỉ khi nắm layer:** mới thêm module (ví dụ Job Listing) theo đúng pipeline.

### Phase 2 — Docker & môi trường

Đọc [02-DOCKER.md](./02-DOCKER.md).  
Mục tiêu: giải thích được từng service trong `docker-compose.yml`, image vs container, volume, network, multi-stage frontend build.

**Chưa tối ưu Dockerfile production** cho đến khi bạn chạy được stack và biết log nằm ở đâu.

### Phase 3 — Domain cốt lõi (trước cloud)

Thứ tự gợi ý cho MatchingJobs (bám sản phẩm, không bám “công nghệ hot”):

1. Company + Staff (đã có auth staff)
2. Job listing (CRUD + status)
3. Job application
4. Matching / search (sau khi có data)

Mỗi nhóm task sẽ có buổi “khái niệm trước” (aggregate, status machine, authorization).

### Phase 4 — File storage (S3)

[03-AWS-S3.md](./03-AWS-S3.md). Local disk → MinIO (S3-compatible) → AWS thật.  
Không upload thẳng S3 từ browser với key vĩnh viễn.

### Phase 5 — Thông báo (Firebase)

[04-FIREBASE.md](./04-FIREBASE.md). Database notification trước, FCM sau.  
Token thiết bị là dữ liệu nhạy cảm theo nghĩa *spam/abuse*, không phải password nhưng phải dọn rác.

### Phase 6 — Thanh toán (Stripe)

[05-STRIPE.md](./05-STRIPE.md). Webhook là nguồn sự thật, không phải “frontend nói đã trả tiền”.  
Harukky **chỉ có config Stripe**, chưa phải bài học hoàn chỉnh — mentor sẽ dạy chuẩn Stripe, không giả vờ Harukky đã xong.

### Phase 7 — Senior practices xuyên suốt

[06-THUC-HANH-SENIOR.md](./06-THUC-HANH-SENIOR.md): bảo mật, test, queue, CI, quan sát hệ thống.

## Definition of done cho “tôi đã hiểu”

Bạn tự giải thích được (không nhìn docs) các câu:

- Request đi qua những lớp nào trước khi chạm DB?
- Vì sao Postgres trong Compose bind `127.0.0.1`?
- Vì sao file CV không nên public ACL trên S3?
- Vì sao không tin `payment_status` gửi từ React?
- Sự khác nhau: JWT hết hạn vs refresh vs blacklist?

Khi trả lời được, mới sang phase tiếp theo.

## Cách báo với mentor mỗi buổi

Nói rõ: *phase nào, khái niệm nào còn mơ hồ, muốn đi sâu hay muốn làm bài tập nhỏ*.  
Mentor sẽ chủ động chỉ gap; bạn không cần hỏi đúng thuật ngữ.

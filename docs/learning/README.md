# MatchingJobs — Nhật ký học senior

Tài liệu này không phải copy Harukky. Đây là **lớp học**: nguyên lý trước, code sau.

## Cách mentor sẽ làm việc với bạn

1. Trước mỗi nhóm task: giải thích khái niệm, quyết định kiến trúc, và quy tắc.
2. Khi nhìn Harukky: nêu **vì sao hay / vì sao không nên copy**.
3. Không implement hàng loạt feature khi bạn chưa nắm nền.
4. Mỗi công nghệ lớn có file riêng trong thư mục này.
5. Bạn hỏi “làm sao” thì mentor vẫn trả “tại sao” trước.

## Bản đồ tài liệu

| File | Đọc khi nào |
|------|-------------|
| [00-LO-TRINH.md](./00-LO-TRINH.md) | Ngay bây giờ — thứ tự học |
| [01-KIEN-TRUC.md](./01-KIEN-TRUC.md) | Trước khi thêm bất kỳ module nào |
| [02-DOCKER.md](./02-DOCKER.md) | Khi muốn hiểu môi trường local/prod |
| [03-AWS-S3.md](./03-AWS-S3.md) | Khi làm upload file |
| [04-FIREBASE.md](./04-FIREBASE.md) | Khi làm push notification |
| [05-STRIPE.md](./05-STRIPE.md) | Khi làm thanh toán |
| [06-THUC-HANH-SENIOR.md](./06-THUC-HANH-SENIOR.md) | Bảo mật, test, queue, CI, API |
| [07-FRONTEND.md](./07-FRONTEND.md) | Sau khi đụng UI — lớp page / hook / service / client |
| [fe/README.md](./fe/README.md) | Khi cài thư viện FE — một file cho một package |

## Hai dự án trong workspace

- **Harukky**: sản phẩm gần hoàn chỉnh — dùng như **bằng chứng thực tế**, không phải đáp án duy nhất.
- **MatchingJobs**: sandbox học — schema đã rộng, API/UI còn hẹp. Đó là chỗ tốt để luyện: bạn sẽ **lấp khoảng trống có chủ đích**, không copy nguyên repo.

## Trạng thái MatchingJobs (điểm xuất phát)

Đã có: 3 portal React, Laravel JWT 3 guard, dashboard đếm số, CRUD job seeker phía admin, Docker Compose, convention đặt tên.

Chưa có (và **cố ý chưa làm ngay**): matching engine, job listing API, S3/MinIO, FCM, Stripe, OpenAPI đầy đủ.

Senior không bắt đầu bằng Stripe. Senior bắt đầu bằng ranh giới module, luồng dữ liệu, và môi trường chạy ổn định.

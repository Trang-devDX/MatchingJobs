# AWS S3 — lưu file đúng cách

MatchingJobs hiện mặc định **local disk**. Harukky đã có Local + S3 + MinIO. Tài liệu này dạy *mô hình*, không dán credential.

## 1. S3 là gì (và không là gì)

S3 (Simple Storage Service) là **object storage**: bạn lưu file theo key (`resumes/uuid.pdf`), không phải ổ đĩa gắn vào một server.

Hệ quả:

- Web server **stateless**: scale 3 instance Laravel, file không nằm “máy nào nhận upload”.
- Backup/lifecycle (xóa CV sau 2 năm) làm ở phía storage.
- URL có thể tách khỏi app (CloudFront) hoặc **ký tạm thời**.

S3 **không** phải database. Metadata quan hệ (file thuộc user nào) vẫn nằm Postgres.

## 2. Khái niệm nền

| Thuật ngữ | Nghĩa |
|-----------|--------|
| Bucket | Thùng chứa (một tên global) |
| Object key | Path logic `avatars/abc.jpg` |
| Region | Nơi data nằm (latency + luật dữ liệu) |
| ACL / Bucket policy | Ai được `s3:GetObject` |
| IAM user/role | App được quyền gì |
| Presigned URL | Link tạm, hết hạn |
| MinIO | Server S3-compatible, chạy local (Harukky Compose) |

Laravel `Storage::disk('s3')` nói chuyện qua API S3. Nếu `AWS_ENDPOINT` trỏ MinIO, **cùng code** chạy local.

Đây là lý do senior thích S3 API: **đổi endpoint, không đổi nghiệp vụ**.

## 3. Mô hình đúng trong app

Luồng production nên thế:

1. Browser **không** cầm AWS secret.
2. User upload vào API (hoặc nhận presigned PUT từ API).
3. API ghi **bảng `uploaded_files`**: `path`, `disk`, `mime`, `size`, `type`, quan hệ model.
4. Download: API check quyền → stream hoặc trả presigned GET.

Harukky làm gần đúng:

- `UploadFileServiceInterface`
- `LocalUploadFileService` / `S3UploadFileService`
- `UploadFileServiceProvider` bind theo `filesystems.default`
- `FileController` stream theo `storage_disk`
- `UploadedFilePolicy` — **điểm senior**: file không public chỉ vì biết UUID.

`S3UploadFileService` đặt tên file = UUID + extension: tránh path traversal và đụng tên gốc `../../../etc/passwd.jpg`.

## 4. Public vs private — quyết định bảo mật số 1

| Loại file | Sai | Đúng |
|-----------|-----|------|
| Logo công ty | — | Public hoặc CDN |
| Avatar | Bucket public cả prefix | Cân nhắc: public được, nhưng hotlink |
| CV, căn cước, chat attachment | `visibility public` trên S3 | Private + presigned hoặc stream qua API |

Harukky comment “store with public visibility” trong S3 service — **cần cảnh giác**. CV public vì đoán URL là lỗ hổng. UUID làm khó đoán, **không phải ACL**.

Quyền: `UploadedFilePolicy` + auth. Không trả URL S3 vĩnh viễn trên JSON list job seeker.

## 5. Best practices

- Validate **size + mime thật** (finfo), không chỉ extension. Harukky có `Rules\FileType`, `UploadableFile`.
- Giới hạn loại: pdf/jpeg, không `application/x-php`.
- Virus scan sau này (ClamAV queue) nếu làm hồ sơ thật.
- `DB::afterCommit` rồi mới xóa object S3 (Harukky delete) — nếu transaction rollback, file còn; nếu xóa S3 trước rồi DB fail, mất file. Học pattern này.
- Lifecycle rule: incomplete multipart, file rác.
- Encryption: SSE-S3 đủ cho nhiều app; dữ liệu rất nhạy thì SSE-KMS.
- Không log nội dung file; log `id` + `path`.

## 6. MinIO vs AWS thật

Học S3 **bằng MinIO trước**:

- Không tốn tiền, không lộ bill.
- Cùng SDK.
- Console :9001 xem bucket.

Khi lên AWS: tạo bucket private, IAM least privilege (`s3:PutObject` đúng prefix), **không** Access Key trong frontend, rotate key, bật Block Public Access trừ khi có lý do CDN.

`AWS_USE_PATH_STYLE_ENDPOINT=true` thường cần cho MinIO; AWS virtual-host style là mặc định.

## 7. MatchingJobs nên làm gì (khi tới phase)

1. Thêm service `minio` giống Harukky (không copy password yếu lên prod).
2. Port interface upload, **không** nhét `Storage::disk('s3')` rải service chat/profile.
3. Test: upload local disk trong PHPUnit (fake disk), không gọi AWS.

Chưa làm nếu chưa có use case file (avatar, CV). Đừng “gắn S3 cho vui”.

## 8. Sai lầm phổ biến

- Access key trong React.
- Bucket listable (`s3:ListBucket` public).
- Tin `Content-Type` client.
- Dùng tên file gốc làm key.
- Mix disk: DB ghi `s3` nhưng file nằm `local`.
- CORS S3 mở `*` kèm bucket public.

## 9. Liên hệ Laravel

`config/filesystems.php` disk `s3` đọc `AWS_*`.  
`FILESYSTEM_DISK=local` lúc test.  
App code chỉ phụ thuộc interface.

Khi mentor bảo “implement upload”, checklist: Request rule → Service interface → DB row → Policy → không public ACL.

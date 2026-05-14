# Run format code trước khi tạo PR
 ```
vendor/bin/php-cs-fixer fix
```
# Hướng dẫn triển khai module và quy tắc đặt tên

## 1. Quy tắc chung

### 1.1. Định dạng thời gian
- Sử dụng định dạng ISO8061 (extended format)
- Ví dụ: `2022-03-01T21:28:13+09:00`

### 1.2. Nguyên tắc đặt tên cơ bản
- Sử dụng tiếng Anh là ngôn ngữ chính
- Tránh viết tắt trừ khi phổ biến và được chấp nhận rộng rãi
- Ưu tiên tính rõ ràng hơn là ngắn gọn
- Duy trì tính nhất quán trong toàn bộ codebase

## 2. Backend Implementation

### 2.1. Service Layer
#### Quy tắc đặt tên
- Format: `{Verb} + {Target}`
- Tên class: `{Noun}Service`
- Các động từ thường dùng:
  - `fetch`: Lấy một bản ghi
  - `fetchList`: Lấy nhiều bản ghi
  - `create`: Tạo mới
  - `update`: Cập nhật một bản ghi
  - `bulkUpdate`: Cập nhật nhiều bản ghi
  - `destroy`: Xóa một bản ghi
  - `bulkDestroy`: Xóa nhiều bản ghi
  - `count`: Đếm số bản ghi
  - `exists`: Kiểm tra tồn tại

### 2.2. Repository Layer
#### Quy tắc đặt tên
- Format: `{Verb} + {Target}`
- Tên class: `{Noun}Repository`
- Các động từ thường dùng:
  - `find`: Lấy một bản ghi
  - `search`: Tìm kiếm nhiều bản ghi
  - `insert`: Thêm một bản ghi
  - `bulkInsert`: Thêm nhiều bản ghi
  - `update`: Cập nhật một bản ghi
  - `bulkUpdate`: Cập nhật nhiều bản ghi
  - `delete`: Xóa một bản ghi
  - `bulkDelete`: Xóa nhiều bản ghi

### 2.3. Controller Layer
#### Quy tắc đặt tên action
- `index`: Hiển thị danh sách
- `create`: Form tạo mới
- `store`: Xử lý tạo mới
- `show`: Hiển thị chi tiết
- `edit`: Form chỉnh sửa
- `update`: Xử lý cập nhật
- `destroy`: Xử lý xóa
- `bulkDestroy`: Xử lý xóa hàng loạt

### 2.4. API Response Standards
#### Success Cases
- GET (List/Search): 200 + list results
- GET (Details): 200 + resource info
- POST (Create): 201 + resource info
- PUT (Edit): 200 + resource info
- DELETE: 200 + empty response

#### Error Cases
- 401: Authentication error
- 403: Authorization error
- 404: Resource not found
- 409: Concurrency conflict
- 422: Validation error
- 500: Internal server error

## 4. Lưu ý quan trọng
- Đảm bảo tính nhất quán trong toàn bộ dự án
- Ưu tiên khả năng đọc hiểu code
- Tránh sử dụng từ viết tắt không phổ biến
- Luôn có comment giải thích cho logic phức tạp
- Tuân thủ quy tắc REST trong thiết kế API

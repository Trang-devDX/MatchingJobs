# Docker — đóng gói môi trường

## 1. Vì sao senior buộc phải hiểu Docker?

“Chạy được trên máy tôi” không phải môi trường. Docker giải:

- **Parity:** PHP 8.3, Postgres 12.7, Redis 7 giống nhau giữa các máy.
- **Isolation:** không cài Postgres system-wide rồi xung đột port.
- **Onboarding:** clone → compose up (lý tưởng).
- **Gần production:** cùng Nginx + PHP-FPM, không phải `php artisan serve` khác hẳn prod.

Docker **không** tự biến app thành microservices. MatchingJobs vẫn là **monolith API + 3 static frontend**. Compose chỉ là nhiều process cộng tác.

## 2. Khái niệm nền (đừng nhảy tới Compose)

**Image** = snapshot bất biến (công thức + filesystem).  
**Container** = process chạy từ image, có thể xóa không tiếc.  
**Dockerfile** = công thức build image.  
**Layer** = mỗi `RUN`/`COPY` là một lớp cache. Đổi dòng trên → rebuild đắt.  
**Volume** = dữ liệu sống lâu hơn container (Postgres data).  
**Network** = DNS nội bộ: service `api` gọi host `psql`, không gọi `localhost` của máy bạn.  
**Bind mount** = map folder máy vào container (`./backend:/usr/share/nginx/html/laravel`) để sửa code không rebuild.

`localhost` **bên trong container** ≠ `localhost` máy host. Đó là bug số 1 của người mới: Laravel trong Docker phải `DB_HOST=psql`, không phải `127.0.0.1` trừ khi bạn publish port và chạy PHP **ngoài** container.

## 3. Đọc `docker-compose.yml` MatchingJobs

Mỗi `service` là một container:

| Service | Việc | Port host |
|---------|------|-----------|
| `frontend-*` | Nginx phục vụ bản build React | 5173/5174/5175 → 80 |
| `api` | Nginx + PHP-FPM + supervisor (Laravel) | 8000 → 80 |
| `psql` | PostgreSQL | **127.0.0.1:5433** → 5432 |
| `redis` | Cache/queue tiềm năng | 127.0.0.1:6379 |
| `mailcatcher` | Bắt SMTP, UI xem mail | 1080 / 1025 |
| `swagger-ui` | Đọc `docs/api.yaml` (file này **đang thiếu**) | 8081 |
| `wiremock` | Giả reCAPTCHA | 8080 |

### Quyết định tốt trong MatchingJobs

- Postgres **chỉ bind loopback** `127.0.0.1`. Máy khác trong LAN không vào DB. Harukky publish `${POSTGRES_PORT:-5432}:5432` ra mọi interface — tiện, **kém an toàn** trên Wi‑Fi quán cà phê.
- Port DB host `5433` tránh đụng Postgres local `:5432`.

### Điểm yếu / nợ kỹ thuật

- Network vẫn tên `harukky-network` — dấu clone. Đổi tên không bắt buộc để học, nhưng production naming nên khớp sản phẩm.
- Frontend image là **build tĩnh** (Nginx). `yarn dev` trên máy bạn **không** phải container frontend. Hai cách chạy khác nhau: đừng trộn trong đầu.
- `api` mount source → image vẫn `composer install --no-dev` lúc build, lúc dev volume đè code. Hiểu: **dev dùng mount; prod nên copy code vào image, không mount.**
- Harukky có **MinIO** (S3 giả lập). MatchingJobs chưa có — khi học S3 sẽ thêm, có lý do.

## 4. Dockerfile backend — đọc từng ý

File: `docker/backend/Dockerfile`.

Ý tưởng: **một container nhiều process** (Nginx + PHP-FPM + cron-like supercronic) nhờ **Supervisor**.

Đây là pattern phổ biến cho team nhỏ. Trade-off:

- Pros: một service Compose, đơn giản.
- Cons: không scale PHP độc lập Nginx; log nhiều process; “container nên 1 process” (triết lý Docker gốc) bị phá.

Senior hiểu rule và **cố ý phá** khi chi phí vận hành 3 container chưa đáng.

Chi tiết nên nhớ:

- Base `php:8.3-fpm-alpine`: nhỏ, phải `apk add` extension (`pdo_pgsql`, `gd`, …).
- `UID` arg: map user `www-data` với UID máy host để file mount không ra permission 13.
- `pecl install xdebug` nhưng `xdebug.mode=off` mặc định — bật bằng env `XDEBUG_MODE`. Không để debug bật trên prod (chậm, lộ path).
- `COPY --from=composer:2` — multi-stage kiểu “vay binary”, không cần cài Composer bằng tay.
- `CMD supervisord` — process PID 1 phải nhận signal. Supervisor làm được; `php-fpm` trần dễ zombie nếu không cẩn thận.

### So Harukky

Harukky `build: ./docker/backend` (context nhỏ, COPY ini cùng thư mục).  
MatchingJobs `dockerfile: ./docker/backend/Dockerfile` + `context: .` (root repo) nên `COPY docker/backend/...` và `COPY backend/ ./`.

MatchingJobs frontend dùng `corepack` + `yarn install --immutable` — **chặt hơn** Harukky `yarn install` (có thể lệch lockfile). Giữ `--immutable` khi CI.

## 5. Multi-stage frontend

```
stage build (node)  → yarn build → dist/
stage nginx         → chỉ copy dist + nginx.conf
```

Image cuối **không chứa** `node_modules`. Nhỏ hơn, ít CVE hơn. Đây là best practice thật sự — copy.

Sai thường gặp: dùng `node` image để chạy `vite preview` trên prod. Không cần; Nginx đủ cho SPA.

SPA cần `try_files $uri /index.html` trong Nginx, nếu không refresh `/job-seekers` ra 404. Kiểm tra `nginx.default.conf`.

## 6. Data & secrets

- **Volume `postgres_data`:** `docker compose down` giữ data; `down -v` xóa. Đừng `down -v` trên máy có data thật.
- **Secrets:** `.env` không commit. Compose truyền `POSTGRES_PASSWORD`. Image **không** `ENV PASSWORD=...` hardcode.
- File `.env` Laravel trong `backend/` khác `.env` root Compose. Hai lớp config — nhầm chỗ này mất nửa buổi.

## 7. Dev workflow đúng

1. Infra: `psql redis mailcatcher`.
2. `composer install` **trong** container (`--user www-data`) để vendor khớp OS Alpine.
3. `migrate` trong container (host `psql`).
4. Code PHP: sửa local, nhờ bind mount, không rebuild mỗi dòng.
5. Rebuild image khi đổi Dockerfile, extension, hoặc frontend Dockerfile.

Queue mail: process `queue:work` **không** tự có nếu supervisor chưa khai worker. README bảo exec `queue:work` — nghĩa là **bạn phải hiểu job không chạy nếu worker ngủ**.

## 8. Sai lầm phổ biến

- `docker compose up` rồi sửa Dockerfile nhưng quên `--build`.
- Gắn cả `vendor` từ Windows vào Linux rồi lạ lỗi binary.
- Chạy Postgres trên host **và** trong Compose cùng port.
- Copy `COPY . .` trước `composer install` / `yarn install` → phá cache layer, build chậm.
- Chạy container `:latest` không pin (Harukky `composer:latest` vs MatchingJobs `composer:2`). Pin major version.

## 9. Bảo mật (mức cần biết sớm)

- Không expose DB ra `0.0.0.0`. MatchingJobs đang tốt hơn Harukky ở Postgres.
- Không chạy Compose production với Mailcatcher + Xdebug.
- Scan: image Alpine + ít package. Đừng `apk add` toolchain compile nếu tách được build stage (backend hiện compile extension ngay image chạy — chấp nhận được cho PHP official pattern, nhưng image nặng hơn lý tưởng).

## 10. Khi nào mới “production Docker”?

Chưa phải lúc. Tiêu chí sau này: non-root, healthcheck, read-only FS nếu được, secrets manager, không mount source, tách worker/cron khỏi web, resource limits.

Bây giờ: giải thích được **DNS service name**, **volume vs bind**, **multi-stage**, **vì sao DB_HOST không phải localhost**.

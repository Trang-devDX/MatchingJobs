# Stripe — thanh toán

Harukky có `config/services.php` key Stripe. **Không có luồng charge/subscription hoàn chỉnh trong app.**  
Bài học: config ≠ integration. Copy 10 dòng env không biến bạn thành người biết payment.

MatchingJobs cũng **chưa** có sản phẩm trả phí rõ (job slot, featured listing, subscription company). Trước khi code Stripe, cần **sản phẩm tiền tệ**.

## 1. Nguyên tắc số 0

**Frontend không phải nguồn sự thật của tiền.**

Sai: React nhận “success” từ Stripe.js → `POST /mark-paid`. User sửa request là xong.

Đúng:

1. Server tạo **Checkout Session** hoặc **PaymentIntent** với số tiền **server tính**.
2. User trả trên Stripe.
3. Stripe gọi **webhook** `checkout.session.completed` / `payment_intent.succeeded`.
4. Server verify chữ ký webhook → ghi `payments` / kích hoạt feature.
5. UI chỉ **poll** hoặc query status đã lưu DB.

Nếu webhook chậm, UI có thể hiện “đang xử lý”, không hiện “đã mua” cho đến khi DB xác nhận.

## 2. Khái niệm nền

| Khái niệm | Vai trò |
|-----------|---------|
| Customer | Đối tượng Stripe (map `companies.id`) |
| Product / Price | Gói (monthly 50 USD) — giá **không** tin client |
| PaymentIntent | Một lần thu |
| Checkout Session | Trang Stripe hosted, ít PCI hơn |
| Subscription | Định kỳ, invoice |
| Webhook | Event bất đồng bộ |
| Idempotency key | Tránh double charge khi retry |

**PCI:** đừng tự nhận số thẻ raw trên server bạn trừ khi bạn muốn gánh compliance. Checkout hoặc Stripe Elements + PaymentIntent là đường mặc định.

## 3. Mô hình dữ liệu nên có (khi làm)

Bảng ví dụ (ý tưởng, chưa migrate vội):

- `plans` — mã gói, stripe_price_id
- `subscriptions` — company_id, status, current_period_end
- `payments` — amount, currency, stripe_event_id **unique**, status

`stripe_event_id` unique: webhook Stripe **at-least-once**. Xử lý 2 lần không được cộng 2 slot tuyển dụng.

## 4. Best practices

- Secret `sk_live_` / `whsec_` chỉ server. Publishable `pk_` được nằm frontend.
- Verify webhook: raw payload + `Stripe-Signature`, tolerance clock (Harukky có `webhook.tolerance` 300s — đúng hướng).
- Chưa verify thì **không** tin body.
- Số tiền: integer **cents**, không float.
- Test mode `sk_test_` + Stripe CLI `listen` forward localhost.
- Hóa đơn, VAT, refund: lưu event, đừng xóa lịch sử.
- Failed payment subscription: dunning, không im lặng.

## 5. Bảo mật

- CSRF không áp cho webhook: dùng signature, exclude CSRF, rate limit IP Stripe nếu được.
- Không log full webhook (PII). Log `event.id` + type.
- Quyền: chỉ owner company mua gói cho company đó.
- Replay: idempotency DB, không chỉ “đã thấy event”.

## 6. Sai lầm phổ biến

- Giá 9.99 từ JSON client.
- Không webhook, chỉ success_url.
- `success_url` tin query `?session_id=` mà không retrieve session từ Stripe.
- Dùng một Stripe account test/live nhầm key.
- Retry tạo session mỗi click không idempotent → user bị charge 2 lần (với một số flow).
- Currency mismatch JPY (zero-decimal) vs USD.

## 7. Khi nào MatchingJobs nên đụng Stripe?

Khi có use case: ví dụ “company trả phí để mở N job listing”.  
Lúc đó mentor sẽ:

1. Vẽ state machine `incomplete → active → past_due → canceled`.
2. Chọn Checkout (học nhanh, an toàn) trước PaymentIntent custom.
3. Viết test webhook với payload fixture, không gọi Stripe mạng thật trong CI.

Không cài package Stripe tuần này “cho có”.

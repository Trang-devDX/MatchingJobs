# Firebase — push notification (FCM)

Harukky dùng Firebase **Cloud Messaging (FCM)** cho web push, không dùng Firebase Auth làm nguồn user chính (user vẫn JWT Laravel). Đó là lựa chọn đúng cho stack hiện tại.

## 1. Tách khái niệm (gap hay gặp)

Firebase là **nhiều sản phẩm**: Auth, Firestore, FCM, Storage, Analytics…

MatchingJobs **không cần** “cả Firebase”. Cần **FCM**: gửi thông báo tới trình duyệt/app khi có sự kiện (tin nhắn, apply job).

Hai kênh thông báo khác nhau:

| Kênh | Khi nào | Nguồn sự thật |
|------|---------|----------------|
| **In-app / database** | User đang mở web, lịch sử chuông | Bảng notifications Laravel |
| **Push FCM** | Tab đóng, cần gõ cửa OS | Device token |

Harukky gửi cả `database` lẫn `FirebaseCloudMessagingChannel` — user mở app vẫn thấy history nếu push thất bại. **Làm database trước, FCM sau.**

## 2. Luồng thật

```
Browser xin quyền Notification
  → Firebase JS SDK lấy device token (FCM)
  → POST kèm login/profile lên Laravel
  → lưu device_tokens (user, token, platform)

Sự kiện (có người apply)
  → Notification Laravel
  → Channel FCM
  → FirebaseCloudMessagingService.sendNotification(tokens)
  → FCM → browser (foreground: onMessage; background: service worker)
```

Token **không phải password**, nhưng:

- Ai có token có thể bị spam nếu server bạn bị lạm dụng.
- Token hết hạn / user gỡ quyền → FCM trả invalid → **phải xóa DB** (Harukky `invalidTokens()` + `bulkDeleteTokens` + command `device_token:prune`). Đây là chi tiết production, đừng bỏ.

## 3. Web push cần gì

- HTTPS (localhost được ngoại lệ).
- `firebase-messaging-sw.js` ở **root** site (service worker scope).
- VAPID / config public (apiKey, projectId, messagingSenderId, appId).  
  Các giá trị này **cố ý public** trên client. Vẫn không commit lung tung project production vào git public nếu không cần.

Harukky có `public/firebase-config.js` bị service worker `importScripts` — pattern cũ FCM v8 trong SW, SDK v9+ trên app. **Lệch version SW vs app** là bẫy; khi implement MatchingJobs, thống nhất version và docs chính thức hiện tại, đừng copy nguyên file 8.2.0 nếu team đang dùng modular SDK.

## 4. Backend pattern đáng học

- `kreait/laravel-firebase`: Admin SDK, credential **service account JSON** chỉ trên server, `GOOGLE_APPLICATION_CREDENTIALS` hoặc `FIREBASE_CREDENTIALS`. **Cấm** đưa JSON này vào frontend.
- Custom `FirebaseCloudMessagingChannel` + `toFirebase()` trên từng Notification: payload title/body/data.
- `data` payload: id job, type event — để click notification **điều hướng đúng màn**, không chỉ hiện text.

## 5. Best practices

- Một user nhiều token (máy tính + điện thoại): gửi **tất cả**, đừng 1 cột user.
- Đăng xuất: xóa hoặc detach token máy đó, không xóa hết máy khác.
- Không nhét PII trong body push (email, tên đầy đủ nhạy cảm) — lock screen người khác đọc được.
- Rate limit: không FCM mỗi keystroke chat; debounce hoặc chỉ “bạn có tin mới”.
- iOS/Android/Web khác permission UX — MatchingJobs web-first.
- Test: fake channel, không bắn FCM thật trong PHPUnit.

## 6. Bảo mật & quyền riêng tư

- Hỏi permission **đúng lúc** (sau khi user hiểu lợi ích), không ngay landing — vừa UX vừa tránh block vĩnh viễn.
- Tuân luật: cho opt-out.
- Service account = admin FCM: quyền rất mạnh, lưu secrets manager, không screenshot vào Slack.

## 7. Sai lầm phổ biến

- Coi FCM là database realtime (dùng Firestore cho chat thay Postgres) — lệch kiến trúc MatchingJobs.
- Chỉ push, không lưu notification in-app.
- Không dọn invalid token → mỗi lần gửi càng chậm, Firebase báo quota/error.
- Hardcode icon path sai (`/Logo.png`) — push xấu, không vỡ bảo mật nhưng lộ sự cẩu thả.

## 8. MatchingJobs hiện tại

Admin AuthService đã có chỗ device token (theo clone). **Chưa** đủ FCM. Khi tới phase: credential local, 1 notification end-to-end (ví dụ admin tạo job seeker — không cần), use case thật hơn: “ứng tuyển → staff nhận push”.

Mentor sẽ không bảo “cài Firebase tuần này” nếu job application chưa tồn tại. Push không có sự kiện nghiệp vụ thì chỉ là demo SDK.

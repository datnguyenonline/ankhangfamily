# An Khang Family — Learning Portal

Trang tổng hợp e-learning, games, reading, videos và ôn tập Toán cho gia đình An Khang.

## Tech Stack

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS v4**
- **NextAuth.js v5** (đăng nhập)

## Tính năng

- 🔐 Đăng nhập bảo vệ toàn bộ portal
- 🔢 **Ôn tập Toán** — 500 câu/lớp (lớp 1–5), bộ sách Chân Trời Sáng Tạo
- 🏆 Bảng xếp hạng điểm tích lũy
- 📚 E-Learning, 🎮 Games, 📖 Reading, 🎬 Videos, 🎨 Creativity

## Tài khoản

| Username | Mật khẩu | Ghi chú |
|----------|----------|---------|
| `giaan` | `123456` | Gia An |
| `dinhkhang` | `123456` | Đinh Khang |
| `admin` | `AnKhang2026!` | Quản trị |

## Ôn tập Toán

- Truy cập `/on-tap-toan` → chọn lớp 1–5
- Mỗi lần làm bài: **10 câu trắc nghiệm ngẫu nhiên** từ ngân hàng 500 câu
- Sau khi nộp bài → trang kết quả + cộng điểm vào bảng xếp hạng
- Điểm = (số câu đúng / 10) × 100

## Chạy local

```bash
npm install
npm run dev
```

Tạo lại ngân hàng câu hỏi (nếu cần):

```bash
npm run generate:math
```

## Deploy Vercel

Environment Variables:

| Variable | Mô tả |
|----------|-------|
| `AUTH_SECRET` | Chuỗi random (openssl rand -base64 32) |
| `AUTH_URL` | https://ankhangfamily.vercel.app |
| `UPSTASH_REDIS_REST_URL` | (Khuyến nghị) Lưu điểm bảng xếp hạng |
| `UPSTASH_REDIS_REST_TOKEN` | Token Upstash Redis |

> Bảng xếp hạng trên Vercel cần Upstash Redis (free tier) để lưu điểm lâu dài. Không có Redis thì dùng bộ nhớ tạm (reset khi server restart).

## License

Private — Gia đình An Khang

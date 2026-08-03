# An Khang Family — Learning Portal

Trang tổng hợp e-learning, games, reading, videos và creativity cho gia đình An Khang.

## Tech Stack

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS v4**
- **NextAuth.js v5** (đăng nhập)

## Tính năng

- 🔐 Đăng nhập bảo vệ toàn bộ portal
- 📚 E-Learning — Khan Academy, Duolingo, Scratch...
- 🎮 Games — Coolmath, Chess, TypingClub...
- 📖 Reading — StoryWeaver, Gutenberg, Epic...
- 🎬 Videos — YouTube Kids, TED-Ed, Crash Course...
- 🎨 Creativity — Canva, MuseScore, Tinkercad...

## Chạy local

```bash
npm install
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000)

### Đăng nhập mặc định

| Email | Mật khẩu |
|-------|----------|
| `admin@ankhangfamily.com` | `AnKhang2026!` |

> ⚠️ Đổi mật khẩu trên production bằng cách set `AUTH_USER_PASSWORD_HASH` trong env Vercel.

## Deploy Vercel

1. Push code lên GitHub
2. Import project trên [vercel.com](https://vercel.com)
3. Thêm Environment Variables:
   - `AUTH_SECRET` — chuỗi random (openssl rand -base64 32)
   - `AUTH_URL` — URL production (vd: https://ankhangfamily.vercel.app)
   - `AUTH_USER_EMAIL` — email đăng nhập
   - `AUTH_USER_PASSWORD_HASH` — bcrypt hash mật khẩu

## Tạo hash mật khẩu mới

```bash
node -e "require('bcryptjs').hash('MAT_KHAU_MOI', 10).then(console.log)"
```

## License

Private — Gia đình An Khang

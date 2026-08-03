import Link from "next/link";
import { Header } from "@/components/Header";
import { CategoryCard } from "@/components/CategoryCard";
import { portalCategories } from "@/lib/data";

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-grid">
      <div className="glow-orb -left-32 top-0 h-96 w-96 bg-green-600/10" />
      <div className="glow-orb -right-32 top-1/3 h-80 w-80 bg-emerald-500/8" />

      <Header />

      <main className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <section className="mb-16">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-green-500">
            Gia đình An Khang
          </p>
          <h1 className="font-display max-w-2xl text-4xl font-extrabold leading-tight tracking-tight text-green-50 sm:text-5xl">
            Cổng học tập &{" "}
            <span className="bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
              giải trí
            </span>{" "}
            gia đình
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-green-300/60">
            Tổng hợp e-learning, trò chơi, đọc sách, video và sáng tạo — tất cả
            ở một nơi, an toàn cho cả gia đình.
          </p>
        </section>

        <section className="mb-16">
          <Link
            href="/on-tap-toan"
            className="group block overflow-hidden rounded-2xl border border-green-700/40 bg-gradient-to-br from-green-950/60 to-[#0d120d] p-8 transition-all hover:border-green-500/50 hover:shadow-[0_0_50px_-10px_rgba(34,197,94,0.3)]"
          >
            <div className="flex items-center gap-6">
              <span className="text-5xl">🔢</span>
              <div>
                <p className="text-xs uppercase tracking-widest text-green-500">
                  Chân Trời Sáng Tạo
                </p>
                <h2 className="font-display text-2xl font-bold text-green-50 group-hover:text-green-400">
                  Ôn tập Toán — Lớp 1 đến Lớp 5
                </h2>
                <p className="mt-1 text-sm text-green-300/60">
                  500 câu/lớp · 10 câu ngẫu nhiên/lần · Bảng xếp hạng
                </p>
              </div>
              <span className="ml-auto hidden text-green-500 transition-transform group-hover:translate-x-1 sm:block">
                →
              </span>
            </div>
          </Link>
        </section>

        <section>
          <h2 className="mb-6 font-display text-sm font-semibold uppercase tracking-widest text-green-500/80">
            Danh mục
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {portalCategories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </section>

        <section className="mt-16 rounded-2xl border border-green-900/30 bg-[#0d120d]/80 p-8">
          <h2 className="font-display text-lg font-bold text-green-50">
            Mẹo sử dụng
          </h2>
          <ul className="mt-4 space-y-2 text-sm text-green-300/60">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-green-500">→</span>
              Chọn danh mục phù hợp với mục tiêu học tập hoặc giải trí
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-green-500">→</span>
              Các liên kết mở tab mới — an toàn và dễ quay lại
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-green-500">→</span>
              Chỉ thành viên gia đình mới truy cập được cổng này
            </li>
          </ul>
        </section>
      </main>

      <footer className="border-t border-green-900/20 py-8 text-center text-xs text-green-700">
        © {new Date().getFullYear()} An Khang Family · Made with 💚
      </footer>
    </div>
  );
}

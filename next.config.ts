import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: "/", destination: "/pages" },
      { source: "/login", destination: "/pages/login" },
      { source: "/settings", destination: "/pages/settings" },
      { source: "/leaderboard", destination: "/pages/leaderboard" },
      { source: "/math/results", destination: "/pages/math/results" },
      {
        source: "/math/:gradeSlug/quiz",
        destination: "/pages/math/:gradeSlug/quiz",
      },
      { source: "/math/:gradeSlug", destination: "/pages/math/:gradeSlug" },
      { source: "/math", destination: "/pages/math" },
      { source: "/games/chess", destination: "/pages/games/chess" },
      { source: "/games/sudoku", destination: "/pages/games/sudoku" },
      { source: "/elearning/typing", destination: "/pages/elearning/typing" },
      { source: "/:slug", destination: "/pages/:slug" },
    ];
  },
  async redirects() {
    return [
      { source: "/on-tap-toan", destination: "/math", permanent: true },
      {
        source: "/on-tap-toan/ket-qua",
        destination: "/math/results",
        permanent: true,
      },
      {
        source: "/on-tap-toan/lop-:grade",
        destination: "/math/grade-:grade",
        permanent: true,
      },
      {
        source: "/on-tap-toan/lop-:grade/lam-bai",
        destination: "/math/grade-:grade/quiz",
        permanent: true,
      },
      {
        source: "/on-tap-toan/grade-:grade",
        destination: "/math/grade-:grade",
        permanent: true,
      },
      {
        source: "/on-tap-toan/grade-:grade/quiz",
        destination: "/math/grade-:grade/quiz",
        permanent: true,
      },
      {
        source: "/bang-xep-hang",
        destination: "/leaderboard",
        permanent: true,
      },
      { source: "/hoc-tap", destination: "/elearning", permanent: true },
      { source: "/games/co-vua", destination: "/games/chess", permanent: true },
    ];
  },
};

export default nextConfig;

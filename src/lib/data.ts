export type PortalItem = {
  id: string;
  title: string;
  description: string;
  url: string;
  tags?: string[];
};

export type PortalCategory = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  items: PortalItem[];
};

export const portalCategories: PortalCategory[] = [
  {
    id: "elearning",
    slug: "elearning",
    title: "E-Learning",
    subtitle: "Học tập trực tuyến",
    icon: "📚",
    color: "from-emerald-600/20 to-green-900/10",
    items: [
      {
        id: "khan",
        title: "Khan Academy",
        description: "Toán, khoa học, lập trình miễn phí",
        url: "https://www.khanacademy.org",
        tags: ["Toán", "Khoa học"],
      },
      {
        id: "duolingo",
        title: "Duolingo",
        description: "Học ngoại ngữ qua trò chơi",
        url: "https://www.duolingo.com",
        tags: ["Tiếng Anh", "Ngôn ngữ"],
      },
      {
        id: "scratch",
        title: "Scratch",
        description: "Lập trình sáng tạo cho trẻ em",
        url: "https://scratch.mit.edu",
        tags: ["Lập trình", "Sáng tạo"],
      },
      {
        id: "codecademy",
        title: "Codecademy",
        description: "Học lập trình tương tác",
        url: "https://www.codecademy.com",
        tags: ["Code", "Web"],
      },
    ],
  },
  {
    id: "games",
    slug: "games",
    title: "Games",
    subtitle: "Trò chơi giáo dục",
    icon: "🎮",
    color: "from-lime-600/20 to-emerald-900/10",
    items: [
      {
        id: "coolmath",
        title: "Coolmath Games",
        description: "Trò chơi logic và tư duy",
        url: "https://www.coolmathgames.com",
        tags: ["Logic", "Tư duy"],
      },
      {
        id: "poki",
        title: "Poki",
        description: "Game giải trí an toàn cho trẻ",
        url: "https://poki.com",
        tags: ["Giải trí"],
      },
      {
        id: "chess",
        title: "Chess.com",
        description: "Học và chơi cờ vua",
        url: "https://www.chess.com",
        tags: ["Cờ vua", "Chiến thuật"],
      },
      {
        id: "typing",
        title: "TypingClub",
        description: "Luyện gõ phím nhanh",
        url: "https://www.typingclub.com",
        tags: ["Gõ phím", "Kỹ năng"],
      },
    ],
  },
  {
    id: "reading",
    slug: "reading",
    title: "Reading",
    subtitle: "Đọc sách & truyện",
    icon: "📖",
    color: "from-green-700/20 to-teal-900/10",
    items: [
      {
        id: "storyweaver",
        title: "StoryWeaver",
        description: "Truyện đa ngôn ngữ miễn phí",
        url: "https://storyweaver.org.in",
        tags: ["Truyện", "Đa ngôn ngữ"],
      },
      {
        id: "gutenberg",
        title: "Project Gutenberg",
        description: "Sách điện tử miễn phí",
        url: "https://www.gutenberg.org",
        tags: ["Sách", "Classic"],
      },
      {
        id: "epic",
        title: "Epic!",
        description: "Thư viện sách thiếu nhi",
        url: "https://www.getepic.com",
        tags: ["Thiếu nhi"],
      },
      {
        id: "wikipedia",
        title: "Wikipedia",
        description: "Bách khoa toàn thư mở",
        url: "https://vi.wikipedia.org",
        tags: ["Kiến thức"],
      },
    ],
  },
  {
    id: "videos",
    slug: "videos",
    title: "Videos",
    subtitle: "Video học tập & giải trí",
    icon: "🎬",
    color: "from-emerald-500/15 to-green-950/10",
    items: [
      {
        id: "youtube-kids",
        title: "YouTube Kids",
        description: "Video an toàn cho trẻ em",
        url: "https://www.youtubekids.com",
        tags: ["An toàn", "Giải trí"],
      },
      {
        id: "ted-ed",
        title: "TED-Ed",
        description: "Bài giảng ngắn sáng tạo",
        url: "https://ed.ted.com",
        tags: ["Giáo dục"],
      },
      {
        id: "crashcourse",
        title: "Crash Course",
        description: "Khóa học video nhanh",
        url: "https://www.youtube.com/user/crashcourse",
        tags: ["Khoa học", "Lịch sử"],
      },
      {
        id: "national-geo",
        title: "National Geographic Kids",
        description: "Khám phá thế giới tự nhiên",
        url: "https://kids.nationalgeographic.com",
        tags: ["Thiên nhiên"],
      },
    ],
  },
  {
    id: "creativity",
    slug: "creativity",
    title: "Creativity",
    subtitle: "Sáng tạo & nghệ thuật",
    icon: "🎨",
    color: "from-green-600/15 to-lime-950/10",
    items: [
      {
        id: "canva",
        title: "Canva",
        description: "Thiết kế đồ họa dễ dàng",
        url: "https://www.canva.com",
        tags: ["Thiết kế"],
      },
      {
        id: "musescore",
        title: "MuseScore",
        description: "Soạn nhạc và học nhạc cụ",
        url: "https://musescore.com",
        tags: ["Âm nhạc"],
      },
      {
        id: "tinkercad",
        title: "Tinkercad",
        description: "Thiết kế 3D cho người mới",
        url: "https://www.tinkercad.com",
        tags: ["3D", "STEM"],
      },
      {
        id: "pixilart",
        title: "Pixilart",
        description: "Vẽ pixel art trực tuyến",
        url: "https://www.pixilart.com",
        tags: ["Vẽ", "Pixel"],
      },
    ],
  },
];

export function getCategoryBySlug(slug: string): PortalCategory | undefined {
  return portalCategories.find((c) => c.slug === slug);
}

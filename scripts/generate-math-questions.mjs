import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "../src/app/assets/data/math");

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickWrong(correct, pool, count = 3) {
  const filtered = pool.filter((v) => v !== correct);
  return shuffle(filtered).slice(0, count);
}

function makeOptions(correct, pool) {
  const correctStr = String(correct);
  const wrong = pickWrong(correct, pool, 20);
  const options = [correctStr];
  const seen = new Set([correctStr]);

  for (const w of wrong) {
    const s = String(w);
    if (!seen.has(s) && options.length < 4) {
      seen.add(s);
      options.push(s);
    }
  }

  let offset = 1;
  while (options.length < 4) {
    const candidate = String(Number(correctStr) + offset);
    if (!seen.has(candidate)) {
      seen.add(candidate);
      options.push(candidate);
    }
    offset += 1;
  }

  const shuffled = shuffle(options);
  return { options: shuffled, correctIndex: shuffled.indexOf(correctStr) };
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}

const BOOK = "Chân Trời Sáng Tạo";

function generateGrade1() {
  const questions = [];
  const topics = [
    "Số đếm",
    "Cộng trừ",
    "So sánh số",
    "Hình học",
    "Thời gian",
    "Đo lường",
  ];

  for (let i = 0; i < 500; i++) {
    const topic = topics[i % topics.length];
    let q;

    if (topic === "Số đếm") {
      const n = randInt(0, 99);
      const ans = n + 1;
      const pool = Array.from({ length: 101 }, (_, x) => x);
      const { options, correctIndex } = makeOptions(ans, pool);
      q = {
        question: `Số liền sau của ${n} là số nào?`,
        options,
        correctIndex,
        topic,
      };
    } else if (topic === "Cộng trừ") {
      const a = randInt(1, 20);
      const b = randInt(1, 20 - a);
      const sum = a + b;
      const pool = Array.from({ length: 40 }, (_, x) => x + 1);
      const { options, correctIndex } = makeOptions(sum, pool);
      q = {
        question: `${a} + ${b} = ?`,
        options,
        correctIndex,
        topic,
      };
    } else if (topic === "So sánh số") {
      const a = randInt(1, 99);
      let b = randInt(1, 99);
      while (b === a) b = randInt(1, 99);
      const correct = a > b ? ">" : a < b ? "<" : "=";
      const options = shuffle([">", "<", "=", "≠"]);
      q = {
        question: `Điền dấu thích hợp: ${a} ... ${b}`,
        options,
        correctIndex: options.indexOf(correct),
        topic,
      };
    } else if (topic === "Hình học") {
      const shapes = [
        { name: "hình vuông", sides: 4 },
        { name: "hình tam giác", sides: 3 },
        { name: "hình tròn", sides: 0 },
        { name: "hình chữ nhật", sides: 4 },
      ];
      const shape = shapes[i % shapes.length];
      const pool = [0, 3, 4, 5, 6, 8];
      const ans = shape.sides;
      const { options, correctIndex } = makeOptions(ans, pool);
      q = {
        question:
          shape.sides === 0
            ? "Hình tròn có bao nhiêu cạnh?"
            : `${shape.name.charAt(0).toUpperCase() + shape.name.slice(1)} có bao nhiêu cạnh?`,
        options,
        correctIndex,
        topic,
      };
    } else if (topic === "Thời gian") {
      const hour = randInt(1, 12);
      const options = shuffle(["Giờ", "Phút", "Giây", String(hour)]);
      q = {
        question: `Kim ngắn chỉ số ${hour} trên đồng hồ. Kim ngắn chỉ gì?`,
        options,
        correctIndex: options.indexOf("Giờ"),
        topic,
      };
    } else {
      const len = randInt(1, 30);
      const pool = Array.from({ length: 50 }, (_, x) => x + 1);
      const { options, correctIndex } = makeOptions(len, pool);
      q = {
        question: `Đoạn thẳng dài ${len} cm. Độ dài đoạn thẳng là bao nhiêu cm?`,
        options,
        correctIndex,
        topic,
      };
    }

    questions.push({
      id: `g1-${String(i + 1).padStart(4, "0")}`,
      grade: 1,
      book: BOOK,
      ...q,
    });
  }
  return questions;
}

function generateGrade2() {
  const questions = [];
  const topics = ["Cộng trừ có nhớ", "Nhân", "Chia", "Đo lường", "Hình học", "Tiền Việt"];

  for (let i = 0; i < 500; i++) {
    const topic = topics[i % topics.length];
    let q;

    if (topic === "Cộng trừ có nhớ") {
      const a = randInt(10, 99);
      const b = randInt(10, 99);
      const sum = a + b;
      const pool = Array.from({ length: 200 }, (_, x) => x + 1);
      const { options, correctIndex } = makeOptions(sum, pool);
      q = { question: `${a} + ${b} = ?`, options, correctIndex, topic };
    } else if (topic === "Nhân") {
      const a = randInt(2, 9);
      const b = randInt(2, 9);
      const prod = a * b;
      const pool = Array.from({ length: 81 }, (_, x) => x + 1);
      const { options, correctIndex } = makeOptions(prod, pool);
      q = { question: `${a} × ${b} = ?`, options, correctIndex, topic };
    } else if (topic === "Chia") {
      const b = randInt(2, 9);
      const ans = randInt(2, 9);
      const a = b * ans;
      const pool = Array.from({ length: 20 }, (_, x) => x + 1);
      const { options, correctIndex } = makeOptions(ans, pool);
      q = { question: `${a} : ${b} = ?`, options, correctIndex, topic };
    } else if (topic === "Đo lường") {
      const m = randInt(1, 9);
      const cm = m * 100;
      const pool = [m * 10, m * 50, cm, cm + 50, cm - 50, m * 1000];
      const { options, correctIndex } = makeOptions(cm, pool);
      q = { question: `${m} m = ? cm`, options, correctIndex, topic };
    } else if (topic === "Hình học") {
      const side = randInt(2, 12);
      const perim = side * 4;
      const pool = Array.from({ length: 60 }, (_, x) => x + 1);
      const { options, correctIndex } = makeOptions(perim, pool);
      q = {
        question: `Hình vuông cạnh ${side} cm có chu vi bao nhiêu cm?`,
        options,
        correctIndex,
        topic,
      };
    } else {
      const notes = [1000, 2000, 5000, 10000, 20000, 50000];
      const a = notes[randInt(0, notes.length - 1)];
      const b = notes[randInt(0, notes.length - 1)];
      const sum = a + b;
      const wrongPool = notes.concat([sum + 1000, sum - 1000, sum + 5000, sum + 2000]);
      const wrong = pickWrong(sum, wrongPool, 3);
      const options = shuffle([sum, ...wrong]).map((n) =>
        n.toLocaleString("vi-VN")
      );
      q = {
        question: `${a.toLocaleString("vi-VN")} + ${b.toLocaleString("vi-VN")} = ? đồng`,
        options,
        correctIndex: options.indexOf(sum.toLocaleString("vi-VN")),
        topic,
      };
    }

    questions.push({
      id: `g2-${String(i + 1).padStart(4, "0")}`,
      grade: 2,
      book: BOOK,
      ...q,
    });
  }
  return questions;
}

function generateGrade3() {
  const questions = [];
  const topics = ["Nhân chia", "Số lớn", "Phân số", "Chu vi", "Diện tích", "Thời gian"];

  for (let i = 0; i < 500; i++) {
    const topic = topics[i % topics.length];
    let q;

    if (topic === "Nhân chia") {
      const a = randInt(10, 99);
      const b = randInt(2, 9);
      const prod = a * b;
      const pool = Array.from({ length: 900 }, (_, x) => x + 1);
      const { options, correctIndex } = makeOptions(prod, pool);
      q = { question: `${a} × ${b} = ?`, options, correctIndex, topic };
    } else if (topic === "Số lớn") {
      const n = randInt(1000, 9999);
      const rounded = Math.round(n / 100) * 100;
      const pool = [n, n + 100, n - 100, rounded, rounded + 100];
      const { options, correctIndex } = makeOptions(
        rounded,
        pool.map(String)
      );
      q = {
        question: `Làm tròn ${n} đến hàng trăm được số nào?`,
        options,
        correctIndex,
        topic,
      };
    } else if (topic === "Phân số") {
      const num = randInt(1, 5);
      const den = randInt(num + 1, 10);
      const options = shuffle([
        `${num}/${den}`,
        `${num + 1}/${den}`,
        `${num}/${den + 1}`,
        `${den}/${num}`,
      ]);
      q = {
        question: `Phân số "${num} phần ${den}" viết là?`,
        options,
        correctIndex: options.indexOf(`${num}/${den}`),
        topic,
      };
    } else if (topic === "Chu vi") {
      const l = randInt(5, 20);
      const w = randInt(3, 15);
      const p = 2 * (l + w);
      const pool = Array.from({ length: 100 }, (_, x) => x + 1);
      const { options, correctIndex } = makeOptions(p, pool);
      q = {
        question: `Hình chữ nhật dài ${l} cm, rộng ${w} cm. Chu vi = ? cm`,
        options,
        correctIndex,
        topic,
      };
    } else if (topic === "Diện tích") {
      const l = randInt(3, 15);
      const w = randInt(2, 12);
      const s = l * w;
      const pool = Array.from({ length: 200 }, (_, x) => x + 1);
      const { options, correctIndex } = makeOptions(s, pool);
      q = {
        question: `Hình chữ nhật ${l} cm × ${w} cm có diện tích ? cm²`,
        options,
        correctIndex,
        topic,
      };
    } else {
      const h = randInt(1, 12);
      const m = randInt(0, 59);
      const totalMin = h * 60 + m;
      const pool = [totalMin, totalMin + 60, totalMin - 60, h + m];
      const { options, correctIndex } = makeOptions(totalMin, pool);
      q = {
        question: `${h} giờ ${m} phút = ? phút`,
        options,
        correctIndex,
        topic,
      };
    }

    questions.push({
      id: `g3-${String(i + 1).padStart(4, "0")}`,
      grade: 3,
      book: BOOK,
      ...q,
    });
  }
  return questions;
}

function generateGrade4() {
  const questions = [];
  const topics = ["Phân số", "Thập phân", "Chia dài", "Diện tích", "Đơn vị đo", "Trung bình"];

  for (let i = 0; i < 500; i++) {
    const topic = topics[i % topics.length];
    let q;

    if (topic === "Phân số") {
      const a = randInt(1, 9);
      const b = randInt(a + 1, 12);
      const c = randInt(1, 9);
      const d = randInt(c + 1, 12);
      const num = a * d + c * b;
      const den = b * d;
      const gcd = (x, y) => (y === 0 ? x : gcd(y, x % y));
      const g = gcd(num, den);
      const ans = `${num / g}/${den / g}`;
      const options = shuffle(
        [...new Set([ans, `${a + c}/${b + d}`, `${a * c}/${b * d}`, `${num}/${den}`])].slice(0, 4)
      );
      while (options.length < 4) {
        options.push(`${randInt(1, 9)}/${randInt(2, 12)}`);
      }
      q = {
        question: `${a}/${b} + ${c}/${d} = ? (rút gọn)`,
        options,
        correctIndex: options.indexOf(ans),
        topic,
      };
    } else if (topic === "Thập phân") {
      const a = randInt(1, 99);
      const b = randInt(1, 99);
      const sum = (a + b) / 10;
      const pool = [sum, sum + 0.1, sum - 0.1, sum + 1, a + b];
      const { options, correctIndex } = makeOptions(
        sum.toFixed(1),
        pool.map((v) => v.toFixed(1))
      );
      q = {
        question: `${(a / 10).toFixed(1)} + ${(b / 10).toFixed(1)} = ?`,
        options,
        correctIndex,
        topic,
      };
    } else if (topic === "Chia dài") {
      const div = randInt(2, 12);
      const ans = randInt(10, 99);
      const n = div * ans;
      const pool = Array.from({ length: 200 }, (_, x) => x + 1);
      const { options, correctIndex } = makeOptions(ans, pool);
      q = { question: `${n} : ${div} = ?`, options, correctIndex, topic };
    } else if (topic === "Diện tích") {
      const b = randInt(2, 20) * 2;
      const h = randInt(3, 15);
      const s = (b * h) / 2;
      const pool = [s, b * h, b + h, 2 * (b + h), s + 2, s - 2];
      const { options, correctIndex } = makeOptions(s, pool);
      q = {
        question: `Tam giác đáy ${b} cm, cao ${h} cm. Diện tích = ? cm²`,
        options,
        correctIndex,
        topic,
      };
    } else if (topic === "Đơn vị đo") {
      const kg = randInt(1, 9);
      const g = kg * 1000;
      const pool = [g, kg * 100, kg * 10, kg * 10000];
      const { options, correctIndex } = makeOptions(g, pool);
      q = { question: `${kg} kg = ? g`, options, correctIndex, topic };
    } else {
      const a = randInt(10, 99);
      const b = randInt(10, 99);
      const c = randInt(10, 99);
      const avg = Math.round((a + b + c) / 3);
      const pool = [avg, avg + 1, avg - 1, a + b + c];
      const { options, correctIndex } = makeOptions(avg, pool);
      q = {
        question: `Trung bình cộng của ${a}, ${b}, ${c} là?`,
        options,
        correctIndex,
        topic,
      };
    }

    questions.push({
      id: `g4-${String(i + 1).padStart(4, "0")}`,
      grade: 4,
      book: BOOK,
      ...q,
    });
  }
  return questions;
}

function generateGrade5() {
  const questions = [];
  const topics = ["Phân số", "Phần trăm", "Tỉ số", "Thể tích", "Tốc độ", "Hình học"];

  for (let i = 0; i < 500; i++) {
    const topic = topics[i % topics.length];
    let q;

    if (topic === "Phân số") {
      const a = randInt(2, 9);
      const b = randInt(2, 9);
      const prod = a * b;
      const pool = Array.from({ length: 100 }, (_, x) => x + 1);
      const { options, correctIndex } = makeOptions(prod, pool);
      q = { question: `${a} × ${b} = ?`, options, correctIndex, topic };
    } else if (topic === "Phần trăm") {
      const n = randInt(10, 200);
      const pct = randInt(10, 50);
      const ans = Math.round((n * pct) / 100);
      const pool = [ans, ans + n, ans * 2, pct, n];
      const { options, correctIndex } = makeOptions(ans, pool);
      q = {
        question: `${pct}% của ${n} = ?`,
        options,
        correctIndex,
        topic,
      };
    } else if (topic === "Tỉ số") {
      let a = randInt(2, 8);
      let b = randInt(2, 8);
      while (gcd(a, b) !== 1) {
        a = randInt(2, 8);
        b = randInt(2, 8);
      }
      const k = randInt(2, 5);
      const ans = `${a}:${b}`;
      const raw = `${a * k}:${b * k}`;
      const options = shuffle([
        ans,
        `${a + 1}:${b}`,
        `${a}:${b + 1}`,
        `${a + b}:${k}`,
      ]);
      q = {
        question: `Rút gọn tỉ số ${raw}`,
        options,
        correctIndex: options.indexOf(ans),
        topic,
      };
    } else if (topic === "Thể tích") {
      const l = randInt(2, 10);
      const w = randInt(2, 10);
      const h = randInt(2, 10);
      const v = l * w * h;
      const pool = [v, l * w, l + w + h, 2 * (l * w + w * h + l * h)];
      const { options, correctIndex } = makeOptions(v, pool);
      q = {
        question: `Hình hộp chữ nhật ${l}×${w}×${h} cm. Thể tích = ? cm³`,
        options,
        correctIndex,
        topic,
      };
    } else if (topic === "Tốc độ") {
      const s = randInt(2, 10);
      const t = randInt(2, 6);
      const v = s * t;
      const pool = [v, s + t, s / t, v * 2];
      const { options, correctIndex } = makeOptions(v, pool);
      q = {
        question: `Đi ${s} km/h trong ${t} giờ được ? km`,
        options,
        correctIndex,
        topic,
      };
    } else {
      const r = randInt(2, 10);
      const c = 2 * 3.14 * r;
      const ans = Math.round(c * 10) / 10;
      const pool = [ans, ans + 1, r * 2, 3.14 * r];
      const { options, correctIndex } = makeOptions(
        ans,
        pool.map((v) => Math.round(v * 10) / 10)
      );
      q = {
        question: `Hình tròn bán kính ${r} cm. Chu vi ≈ ? cm (π ≈ 3,14)`,
        options: options.map(String),
        correctIndex,
        topic,
      };
    }

    questions.push({
      id: `g5-${String(i + 1).padStart(4, "0")}`,
      grade: 5,
      book: BOOK,
      ...q,
    });
  }
  return questions;
}

mkdirSync(OUT_DIR, { recursive: true });

const generators = [
  [1, generateGrade1],
  [2, generateGrade2],
  [3, generateGrade3],
  [4, generateGrade4],
  [5, generateGrade5],
];

for (const [grade, gen] of generators) {
  const questions = gen();
  const path = join(OUT_DIR, `grade-${grade}.json`);
  writeFileSync(path, JSON.stringify(questions));
  console.log(`Grade ${grade}: ${questions.length} questions → ${path}`);
}

console.log("Done!");

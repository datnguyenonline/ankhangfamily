import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, "../src/app/assets/data/math");

const errors = [];
const warnings = [];

function parseViNumber(s) {
  return Number(String(s).replace(/\./g, "").replace(/,/g, ""));
}

function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}

function computeExpected(q) {
  const text = q.question;

  // Grade 1
  let m = text.match(/^Số liền sau của (\d+) là số nào\?$/);
  if (m) return String(Number(m[1]) + 1);

  m = text.match(/^(\d+) \+ (\d+) = \?$/);
  if (m) return String(Number(m[1]) + Number(m[2]));

  m = text.match(/^Điền dấu thích hợp: (\d+) \.\.\. (\d+)$/);
  if (m) {
    const a = Number(m[1]);
    const b = Number(m[2]);
    return a > b ? ">" : a < b ? "<" : "=";
  }

  m = text.match(/^Hình tròn có bao nhiêu cạnh\?$/);
  if (m) return "0";

  m = text.match(/^Hình (vuông|tam giác|chữ nhật) có bao nhiêu cạnh\?$/);
  if (m) {
    const map = { vuông: "4", "tam giác": "3", "chữ nhật": "4" };
    return map[m[1]];
  }

  m = text.match(/^Kim ngắn chỉ số \d+ trên đồng hồ\. Kim ngắn chỉ gì\?$/);
  if (m) return "Giờ";

  m = text.match(/^Đoạn thẳng dài (\d+) cm\. Độ dài đoạn thẳng là bao nhiêu cm\?$/);
  if (m) return m[1];

  // Grade 2
  m = text.match(/^(\d+) × (\d+) = \?$/);
  if (m) return String(Number(m[1]) * Number(m[2]));

  m = text.match(/^(\d+) : (\d+) = \?$/);
  if (m) return String(Number(m[1]) / Number(m[2]));

  m = text.match(/^(\d+) m = \? cm$/);
  if (m) return String(Number(m[1]) * 100);

  m = text.match(/^Hình vuông cạnh (\d+) cm có chu vi bao nhiêu cm\?$/);
  if (m) return String(Number(m[1]) * 4);

  m = text.match(/^([\d.]+) \+ ([\d.]+) = \? đồng$/);
  if (m) {
    const sum = parseViNumber(m[1]) + parseViNumber(m[2]);
    return sum.toLocaleString("vi-VN");
  }

  // Grade 3
  m = text.match(/^Làm tròn (\d+) đến hàng trăm được số nào\?$/);
  if (m) return String(Math.round(Number(m[1]) / 100) * 100);

  m = text.match(/^Phân số "(\d+) phần (\d+)" viết là\?$/);
  if (m) return `${m[1]}/${m[2]}`;

  m = text.match(/^Hình chữ nhật dài (\d+) cm, rộng (\d+) cm\. Chu vi = \? cm$/);
  if (m) return String(2 * (Number(m[1]) + Number(m[2])));

  m = text.match(/^Hình chữ nhật (\d+) cm × (\d+) cm có diện tích \? cm²$/);
  if (m) return String(Number(m[1]) * Number(m[2]));

  m = text.match(/^(\d+) giờ (\d+) phút = \? phút$/);
  if (m) return String(Number(m[1]) * 60 + Number(m[2]));

  // Grade 4
  m = text.match(/^(\d+)\/(\d+) \+ (\d+)\/(\d+) = \? \(rút gọn\)$/);
  if (m) {
    const a = Number(m[1]);
    const b = Number(m[2]);
    const c = Number(m[3]);
    const d = Number(m[4]);
    const num = a * d + c * b;
    const den = b * d;
    const g = gcd(num, den);
    return `${num / g}/${den / g}`;
  }

  m = text.match(/^([\d.]+) \+ ([\d.]+) = \?$/);
  if (m && q.topic === "Thập phân") {
    return (Number(m[1]) + Number(m[2])).toFixed(1);
  }

  m = text.match(/^Tam giác đáy (\d+) cm, cao (\d+) cm\. Diện tích = \? cm²$/);
  if (m) return String((Number(m[1]) * Number(m[2])) / 2);

  m = text.match(/^(\d+) kg = \? g$/);
  if (m) return String(Number(m[1]) * 1000);

  m = text.match(/^Trung bình cộng của (\d+), (\d+), (\d+) là\?$/);
  if (m) {
    return String(
      Math.round((Number(m[1]) + Number(m[2]) + Number(m[3])) / 3)
    );
  }

  // Grade 5
  m = text.match(/^(\d+)% của (\d+) = \?$/);
  if (m) return String(Math.round((Number(m[2]) * Number(m[1])) / 100));

  m = text.match(/^Rút gọn tỉ số (\d+):(\d+)$/);
  if (m) {
    const a = Number(m[1]);
    const b = Number(m[2]);
    const g = gcd(a, b);
    return `${a / g}:${b / g}`;
  }

  m = text.match(/^Hình hộp chữ nhật (\d+)×(\d+)×(\d+) cm\. Thể tích = \? cm³$/);
  if (m) return String(Number(m[1]) * Number(m[2]) * Number(m[3]));

  m = text.match(/^Đi (\d+) km\/h trong (\d+) giờ được \? km$/);
  if (m) return String(Number(m[1]) * Number(m[2]));

  m = text.match(/^Hình tròn bán kính (\d+) cm\. Chu vi ≈ \? cm \(π ≈ 3,14\)$/);
  if (m) {
    const r = Number(m[1]);
    return String(Math.round(2 * 3.14 * r * 10) / 10);
  }

  return null;
}

function validateQuestion(q) {
  const issues = [];

  if (!q.options || q.options.length !== 4) {
    issues.push("Phải có đúng 4 lựa chọn");
  }

  if (q.correctIndex < 0 || q.correctIndex > 3) {
    issues.push(`correctIndex không hợp lệ: ${q.correctIndex}`);
  }

  const expected = computeExpected(q);
  if (expected === null) {
    issues.push("Không parse được câu hỏi");
    return issues;
  }

  const marked = q.options[q.correctIndex];
  if (String(marked) !== String(expected)) {
    issues.push(
      `Đáp án sai: đánh dấu "${marked}" (index ${q.correctIndex}), đúng phải là "${expected}"`
    );
  }

  if (!q.options.includes(String(expected)) && !q.options.includes(expected)) {
    issues.push(`Đáp án đúng "${expected}" không có trong options: [${q.options.join(", ")}]`);
  }

  const unique = new Set(q.options);
  if (unique.size !== q.options.length) {
    warnings.push(`${q.id}: options trùng lặp [${q.options.join(", ")}]`);
  }

  return issues;
}

let total = 0;
let bad = 0;

for (let grade = 1; grade <= 5; grade++) {
  const file = join(DATA_DIR, `grade-${grade}.json`);
  const questions = JSON.parse(readFileSync(file, "utf-8"));

  for (const q of questions) {
    total++;
    const issues = validateQuestion(q);
    if (issues.length) {
      bad++;
      errors.push({ id: q.id, grade, topic: q.topic, question: q.question, issues });
    }
  }
}

console.log(`\n=== KẾT QUẢ KIỂM TRA ===`);
console.log(`Tổng: ${total} câu`);
console.log(`Lỗi: ${bad} câu (${((bad / total) * 100).toFixed(1)}%)`);
console.log(`Cảnh báo: ${warnings.length}`);

if (errors.length) {
  const byTopic = {};
  for (const e of errors) {
    byTopic[e.topic] = (byTopic[e.topic] || 0) + 1;
  }
  console.log("\nLỗi theo chủ đề:");
  for (const [topic, count] of Object.entries(byTopic).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${topic}: ${count}`);
  }

  console.log("\nMẫu lỗi (10 câu đầu):");
  for (const e of errors.slice(0, 10)) {
    console.log(`  [${e.id}] ${e.question}`);
    for (const issue of e.issues) console.log(`    → ${issue}`);
  }

  writeFileSync(
    join(__dirname, "../data/question-errors.json"),
    JSON.stringify(errors, null, 2)
  );
  console.log(`\nChi tiết: data/question-errors.json`);
}

process.exit(bad > 0 ? 1 : 0);

import bcrypt from "bcryptjs";

export type AppUser = {
  id: string;
  username: string;
  name: string;
  email?: string;
  passwordHash: string;
};

const PASSWORD_123456 =
  process.env.AUTH_PASSWORD_123456_HASH ??
  "$2b$10$gbEi49p0Bzm9cOtyK8.wAuCTlYDfQbGZu18m2jx.ra.bEKtxWxF.i";

const ADMIN_PASSWORD =
  process.env.AUTH_USER_PASSWORD_HASH ??
  "$2b$10$Xh8dNmQmPsuvnaUR9AsIduNiqaVNOgGJWhZULj7yQKz0.zDcYMQyS";

export const APP_USERS: AppUser[] = [
  {
    id: "1",
    username: "giaan",
    name: "Gia An",
    passwordHash: PASSWORD_123456,
  },
  {
    id: "2",
    username: "dinhkhang",
    name: "Đinh Khang",
    passwordHash: PASSWORD_123456,
  },
  {
    id: "3",
    username: "admin",
    name: "Gia đình An Khang",
    email: "admin@ankhangfamily.com",
    passwordHash: ADMIN_PASSWORD,
  },
  {
    id: "4",
    username: "thuydam",
    name: "Thúy Đàm",
    passwordHash: PASSWORD_123456,
  },
];

export async function findUserByLogin(
  login: string,
  password: string
): Promise<AppUser | null> {
  const normalized = login.trim().toLowerCase();
  const user = APP_USERS.find(
    (u) =>
      u.username === normalized ||
      u.email?.toLowerCase() === normalized
  );

  if (!user) return null;

  const isValid = await bcrypt.compare(password, user.passwordHash);
  return isValid ? user : null;
}

export function findUserById(id: string): AppUser | undefined {
  return APP_USERS.find((u) => u.id === id);
}

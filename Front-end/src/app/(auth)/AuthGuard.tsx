"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

type User = {
  username: string;
  role: string;
};

// User
const USER_ALLOWED_PATHS = [
  "/blog",
  "/blog-detail",
  "/chat",
  "/profile",
  "/assistant",
];

// Login thì không vào được
const BLOCKED_AFTER_LOGIN = ["/register", "/login"];

// Hàm lấy session
const getUserSession = (): User | null => {
  if (typeof window === "undefined") return null;
  const itemStr = sessionStorage.getItem("user");
  if (!itemStr) return null;

  const item = JSON.parse(itemStr);
  if (Date.now() > item.expiry) {
    sessionStorage.removeItem("user");
    return null;
  }

  return item.value as User;
};

// Component AuthGuard
export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setUser(getUserSession());
  }, []);

  useEffect(() => {
    if (user === undefined) return;

    // ALL
    if (!user && pathname === "/") return;

    // Login mà vào /register /login → Chuyển về "/"
    if (user && BLOCKED_AFTER_LOGIN.includes(pathname)) {
      router.replace("/");
      return;
    }

    // Chưa Login → Chuyển về "/login"
    if (!user) {
      router.replace("/login");
      return;
    }

    // ADMiN
    if (user.role === "ROLE_ADMIN") return;

    // Kiểm tra nếu user có quyền vào trang này không
    const isAllowed = USER_ALLOWED_PATHS.includes(pathname);

    //  Nếu user vào trang không được phép → Chuyển về "/"
    if (!isAllowed) {
      router.replace("/");
    }
  }, [user, pathname, router]);

  // Chờ `user` được xác định để tránh render sai(lộ thông tin)
  if (user === undefined) return null;

  return <>{children}</>;
}

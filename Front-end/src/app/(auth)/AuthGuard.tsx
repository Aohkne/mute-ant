"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

type User = {
  username: string;
  role: string;
};

// Paths allowed for regular users
const USER_ALLOWED_PATHS = [
  "/blog",
  "/blog-detail",
  "/chat",
  "/profile",
  "/assistant",
  "/"
];

// Paths allowed for admin users (in addition to user paths)
const ADMIN_ADDITIONAL_PATHS = [
  "/dashboard",
  "/profile",
  "/management-blogs",
  "/management-users",
];

// Paths blocked after login
const BLOCKED_AFTER_LOGIN = ["/register", "/login"];

// Function to get user session
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
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const sessionUser = getUserSession();
    setUser(sessionUser);

    if (sessionUser?.role === "ROLE_ADMIN" && pathname !== "/dashboard") {
      setIsFirstLogin(true);
    }
  }, [pathname]);

  useEffect(() => {
    if (user === undefined) return;

    if (isFirstLogin && user?.role === "ROLE_ADMIN") {
      setIsFirstLogin(false);
      return;
    }

    if (!user && (pathname === "/" || BLOCKED_AFTER_LOGIN.includes(pathname)))
      return;

    if (user && BLOCKED_AFTER_LOGIN.includes(pathname)) {
      router.replace("/");
      return;
    }

    if (!user) {
      router.replace("/login");
      return;
    }
    // Check path access based on user role
    let isAllowed = false;
    if (user.role === "ROLE_USER") {
      isAllowed = USER_ALLOWED_PATHS.some((path) => pathname.startsWith(path));
    } else if (user.role === "ROLE_ADMIN") {
      isAllowed =
        ADMIN_ADDITIONAL_PATHS.some((path) => pathname.startsWith(path));
    }

    // Redirect if path is not allowed
    if (!isAllowed) {
      router.replace("/");
    }
  }, [user, pathname, router]);

  // Wait for user to be determined to prevent incorrect rendering
  if (user === undefined) return null;
  return <>{children}</>;
}
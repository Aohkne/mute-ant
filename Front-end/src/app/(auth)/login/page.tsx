"use client";

import { ModeToggle } from "@/components/ui/mode-toggle";
import classNames from "classnames/bind";
import styles from "./Login.module.scss";
import Image from "next/image";
import { Eye, EyeClosed, LockKeyhole, UserRound } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAppDispatch } from "../../../hooks";
import { useRouter } from "next/navigation";
import { loginAction } from "../../../redux/features/auth";
import { toast } from "react-toastify";

const cx = classNames.bind(styles);

type User = {
  username: string;
  role: string;
};

type StorageItem<T> = {
  value: T;
  expiry: number;
};

const EXPIRE_TIME = 30 * 24 * 60 * 60 * 1000;

// Sử dụng sessionStorage thay vì localStorage
const setWithExpiry = <T,>(key: string, value: T, ttl: number) => {
  const now = new Date();
  const item: StorageItem<T> = {
    value: value,
    expiry: now.getTime() + ttl,
  };
  sessionStorage.setItem(key, JSON.stringify(item));
};

const getWithRedirect = <T,>(key: string, router: any): User | null => {
  const itemStr = sessionStorage.getItem(key);
  if (!itemStr) return null;

  const item: StorageItem<T> = JSON.parse(itemStr);
  const now = new Date();

  if (now.getTime() > item.expiry) {
    sessionStorage.removeItem(key);
    return null;
  }

  const user = item.value as User;
  if (user.role === "ROLE_ADMIN") {
    router.replace("/dashboard");
  } else {
    router.replace("/");
  }

  return user;
};

export default function Login() {
  const [showPass, setShowPass] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    getWithRedirect<User>("user", router);
  }, [router]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (username === "admin" && password === "muteantpassword") {
      setWithExpiry<User>(
        "user",
        { username, role: "ROLE_ADMIN" },
        EXPIRE_TIME
      );
      toast.success("Welcome, Admin!");
      router.replace("/dashboard");
      return;
    }

    try {
      const result = await dispatch(loginAction({ username, password }));
      if (result.payload) {
        setWithExpiry<User>("user", result.payload, EXPIRE_TIME);
        toast.success("Login successfully!");
        router.replace("/");
      } else {
        toast.error("Invalid credentials!");
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className={cx("wrapper")}>
      <div className={cx("fixed top-0 right-0 p-4")}>
        <ModeToggle />
      </div>

      <div className={cx("login-container", "border-gradient-3")}>
        <Image
          className={cx("logo")}
          src="/images/ant.png"
          alt="logo"
          width={38}
          height={38}
        />

        <h2 className={cx("title", "text-title")}>Welcome Back!</h2>
        <p className={cx("description", "text-description")}>
          Reconnect and share through sign language
        </p>

        <form className={cx("form-container", "my-10")} onSubmit={handleLogin}>
          <div className={cx("input-container", "border-gradient-3")}>
            <UserRound className={cx("icon")} />
            <input
              placeholder="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className={cx("input-container", "border-gradient-3")}>
            <LockKeyhole className={cx("icon")} />
            <input
              placeholder="Password"
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className={cx("icon-eye")}
              onClick={() => setShowPass(!showPass)}
            >
              {showPass ? <Eye /> : <EyeClosed />}
            </span>
          </div>

          <button type="submit" className={cx("btn", "bg-gradient-3")}>
            <span>SIGN IN</span>
          </button>
        </form>

        <div className={cx("action", "text-description")}>
          Not a member?
          <Link href={"/register"} className={cx("text-gradient-3")}>
            Sign up now
          </Link>
        </div>
      </div>
    </div>
  );
}

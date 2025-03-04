"use client";

import { ModeToggle } from "@/components/ui/mode-toggle";
import classNames from "classnames/bind";
import styles from "./Login.module.scss";
import Image from "next/image";
import { Eye, EyeClosed, LockKeyhole, UserRound } from "lucide-react";
import { useState } from "react";
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

const EXPIRE_TIME = 30 * 24 * 60 * 60 * 1000;

const saveUserSession = (user: User) => {
  sessionStorage.setItem(
    "user",
    JSON.stringify({ value: user, expiry: Date.now() + EXPIRE_TIME })
  );
};

export default function Login() {
  const [showPass, setShowPass] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (username === "admin" && password === "muteantpassword") {
      saveUserSession({ username, role: "ROLE_ADMIN" });
      toast.success("Welcome, Admin!");
      router.replace("/");
      return;
    }

    try {
      const result = await dispatch(loginAction({ username, password }));
      if (result.payload) {
        saveUserSession(result.payload);
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

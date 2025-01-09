"use client";

import { ModeToggle } from "@/components/ui/mode-toggle";

import classNames from "classnames/bind";
import styles from "./Register.module.scss";
import Image from "next/image";
import { Eye, EyeClosed, LockKeyhole, UserRound } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

const cx = classNames.bind(styles);

export default function Login() {
  const [showPass, setShowPass] = useState(false);

  return (
    <div className={cx("wrapper")}>
      <div className={cx("fixed top-0 right-0 p-4")}>
        <ModeToggle />
      </div>

      <div className={cx("register-container", "border-gradient-3")}>
        <Image
          className={cx("logo")}
          src="/images/ant.png"
          alt="logo"
          width={38}
          height={38}
        />

        <h2 className={cx("title", "text-title")}>Hello, Friend!</h2>
        <p className={cx("description", "text-description")}>
          Join us to connect beyond boundaries
        </p>

        <form className={cx("form-container", "my-10")}>
          <div
            className={cx(
              "input-container",
              "text-description",
              "border-gradient-3"
            )}
          >
            <UserRound className={cx("icon")} />
            <input
              placeholder="Name"
              className={cx("text-description")}
              type="text"
              name="name"
            />
          </div>

          <div
            className={cx(
              "input-container",
              "text-description",
              "border-gradient-3"
            )}
          >
            <LockKeyhole className={cx("icon")} />
            <input
              placeholder="Password"
              className={cx("text-description")}
              type={showPass ? "text" : "password"}
              name="password"
            />
            <span
              className={cx("icon-eye")}
              onClick={() => setShowPass(!showPass)}
            >
              {showPass ? <Eye /> : <EyeClosed />}
            </span>
          </div>
        </form>

        <button className={cx("btn", "bg-gradient-3")}>
          <span>SIGN IN</span>
        </button>

        <div className={cx("action", "text-description")}>
          Not a member?
          <Link href={"/login"} className={cx("text-gradient-3")}>
            Sign up now
          </Link>
        </div>
      </div>
    </div>
  );
}

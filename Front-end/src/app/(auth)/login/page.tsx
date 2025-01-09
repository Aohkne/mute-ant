"use client";

import { ModeToggle } from "@/components/ui/mode-toggle";

import classNames from "classnames/bind";
import styles from "./Login.module.scss";
import Image from "next/image";
import { Eye, EyeClosed, LockKeyhole, Recycle, UserRound } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

const cx = classNames.bind(styles);

export default function Login() {
  const [showPass, setShowPass] = useState(false);
  const [showConPass, setShowConPass] = useState(false);

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

          <div
            className={cx(
              "input-container",
              "text-description",
              "border-gradient-3"
            )}
          >
            <LockKeyhole className={cx("icon")} />
            <input
              placeholder="Confirm Password"
              className={cx("text-description")}
              type={showConPass ? "text" : "password"}
              name="confirm-password"
            />
            <span
              className={cx("icon-eye")}
              onClick={() => setShowConPass(!showConPass)}
            >
              {showConPass ? <Eye /> : <EyeClosed />}
            </span>
          </div>

          <div
            className={cx(
              "input-container",
              "text-description",
              "border-gradient-3"
            )}
          >
            <Recycle className={cx("icon")} />
            <input
              placeholder="Captcha"
              className={cx("text-description")}
              type="text"
              name="captcha"
            />
          </div>
        </form>

        <button className={cx("btn", "bg-gradient-3")}>
          <span>SIGN UP</span>
        </button>

        <div className={cx("action", "text-description")}>
          Join us?
          <Link href={"/register"} className={cx("text-gradient-3")}>
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
}

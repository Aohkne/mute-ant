"use client";

import { ModeToggle } from "@/components/ui/mode-toggle";
import classNames from "classnames/bind";
import styles from "./Register.module.scss";
import Image from "next/image";
import { Eye, EyeClosed, LockKeyhole, UserRound, Mail } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/hooks";
import {
  setRegisterData,
  registerUser,
} from "@/redux/features/auth/registerSlice";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const cx = classNames.bind(styles);

export default function Register() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const {
    full_name,
    username,
    email,
    birthdate,
    gender,
    password,
    rePassword,
    loading,
  } = useAppSelector((state) => state.register);

  const [showPass, setShowPass] = useState(false);
  const [showConPass, setShowConPass] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setRegisterData({ [e.target.name]: e.target.value }));
  };

  const handleRegister = async () => {
    if (
      !full_name ||
      !username ||
      !email ||
      !birthdate ||
      !gender ||
      !password ||
      !rePassword
    ) {
      toast.error("All fields are required!");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Invalid email format!");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be longer than 8 characters!");
      return;
    }

    if (password !== rePassword) {
      toast.error("Passwords do not match!");
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    if (birthdate === today) {
      toast.error("Birthdate cannot be today!");
      return;
    }

    try {
      const result = await dispatch(
        registerUser({
          full_name,
          username,
          password,
          rePassword,
          email,
          birthdate,
          gender,
        })
      ).unwrap();

      if (result) {
        toast.success("Registration successful!");
        router.push("/login");
      }
    } catch (err) {
      if (err) {
        toast.error("Username or Gmail is already taken");
      }
    }
  };

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

        <form
          className={cx("form-container", "my-10")}
          onSubmit={(e) => e.preventDefault()}
        >
          <div className={cx("input-container", "border-gradient-3")}>
            <UserRound className={cx("icon")} />
            <input
              placeholder="Full Name"
              name="full_name"
              value={full_name}
              onChange={handleChange}
            />
          </div>

          <div className={cx("input-container", "border-gradient-3")}>
            <UserRound className={cx("icon")} />
            <input
              placeholder="Username"
              name="username"
              value={username}
              onChange={handleChange}
            />
          </div>

          <div className={cx("input-container", "border-gradient-3")}>
            <Mail className={cx("icon")} />
            <input
              placeholder="Gmail"
              name="email"
              value={email}
              onChange={handleChange}
            />
          </div>

          <div className={cx("input-container", "border-gradient-3")}>
            <LockKeyhole className={cx("icon")} />
            <input
              placeholder="Password"
              type={showPass ? "text" : "password"}
              name="password"
              value={password}
              onChange={handleChange}
            />
            <span
              className={cx("icon-eye")}
              onClick={() => setShowPass(!showPass)}
            >
              {showPass ? <Eye /> : <EyeClosed />}
            </span>
          </div>

          <div className={cx("input-container", "border-gradient-3")}>
            <LockKeyhole className={cx("icon")} />
            <input
              placeholder="Confirm Password"
              type={showConPass ? "text" : "password"}
              name="rePassword"
              value={rePassword}
              onChange={handleChange}
            />
            <span
              className={cx("icon-eye")}
              onClick={() => setShowConPass(!showConPass)}
            >
              {showConPass ? <Eye /> : <EyeClosed />}
            </span>
          </div>

          <div className={cx("input-container", "border-gradient-3")}>
            <input
              type="date"
              name="birthdate"
              value={birthdate}
              onChange={handleChange}
            />
          </div>

          <div className={cx("gender-container")}>
            <label>
              <input
                type="radio"
                name="gender"
                value="male"
                checked={gender === "male"}
                onChange={handleChange}
              />
              Male
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="female"
                checked={gender === "female"}
                onChange={handleChange}
              />
              Female
            </label>
          </div>
        </form>

        <button
          className={cx("btn", "bg-gradient-3")}
          onClick={handleRegister}
          disabled={loading}
        >
          <span>{loading ? "Signing Up..." : "SIGN UP"}</span>
        </button>

        <div className={cx("action", "text-description")}>
          Already have an account?
          <Link href={"/login"} className={cx("text-gradient-3")}>
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
}

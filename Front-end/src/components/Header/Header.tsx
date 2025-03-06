"use client";

import styles from "./Header.module.scss";
import classNames from "classnames/bind";
import Link from "next/link";
import Image from "next/image";
import { useAppDispatch } from "../../hooks";
import { logout } from "../../redux/features/auth";
import { ModeToggle } from "@/components/ui/mode-toggle";
const cx = classNames.bind(styles);

function Header() {
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className={cx("container", "py-5")}>
      <div className={cx("wrapper", "z-10")}>
        <Image
          className={cx("img")}
          src="/images/ant.png"
          alt="logo"
          width={38}
          height={38}
        />
        <ul className={cx("nav")}>
          <li className={cx("nav-item")}>
            <Link className={cx("text-gradient-3")} href={"/"}>
              Home
            </Link>
          </li>
          <li className={cx("nav-item")}>
            <Link className={cx("text-gradient-3")} href={"/assistant"}>
              Assistant
            </Link>
          </li>
          <li className={cx("nav-item")}>
            <Link className={cx("text-gradient-3")} href={"/chat"}>
              Chat
            </Link>
          </li>
          <li className={cx("nav-item")}>
            <Link className={cx("text-gradient-3")} href={"/blog"}>
              Blog
            </Link>
          </li>
          <li className={cx("nav-item")}>
            <Link className={cx("log-out")} href="/" onClick={handleLogout}>
              Logout
            </Link>
          </li>
        </ul>
      </div>
      <div className={cx("fixed top-0 right-0 p-4")}>
        <ModeToggle />
      </div>
    </div>
  );
}

export default Header;

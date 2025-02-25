"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Book,
  LayoutDashboardIcon,
  LogOut,
  UserRound,
  UserRoundPen,
} from "lucide-react";
import classNames from "classnames/bind";
import styles from "./Sidebar.module.scss";
import { useAppDispatch } from "../../hooks";
import { logout } from "../../redux/features/auth";
import { useRouter } from "next/navigation";

const cx = classNames.bind(styles);

const Sidebar: React.FC = () => {
  const [isLocked, setIsLocked] = useState<boolean | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  let timeoutId: NodeJS.Timeout | null = null;

  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    const sidebarLock = localStorage.getItem("sidebarLock");
    if (sidebarLock !== null) {
      setIsLocked(sidebarLock === "true");
    } else {
      setIsLocked(true);
    }
  }, []);

  useEffect(() => {
    if (isLocked !== null) {
      localStorage.setItem("sidebarLock", isLocked.toString());
    }
  }, [isLocked]);

  const hideSidebar = (): void => {
    if (!isLocked) {
      setIsVisible(false);
    }
  };

  const resetTimeout = (): void => {
    if (timeoutId) clearTimeout(timeoutId);
    if (!isLocked) {
      timeoutId = setTimeout(hideSidebar, 2000);
    }
  };

  useEffect(() => {
    resetTimeout();
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isVisible, isLocked]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent): void => {
      if (e.clientX < 50) {
        setIsVisible(true);
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    router.replace("/login");
  };

  return (
    <div
      className={cx("wrapper", { hide: !isVisible })}
      onMouseEnter={() => setIsVisible(true)}
      onMouseMove={resetTimeout}
    >
      <div className={cx("content")}>
        <Image
          src="/images/mute-ant_horizontal.png"
          alt="logo"
          height={200}
          width={200}
        />
        <div className={cx("title")}>Menu</div>

        <div className={cx("list", "flex-1")}>
          <div className={cx("item")}>
            <Link href={"/dashboard"}>
              <LayoutDashboardIcon />
              <span>Dashboard</span>
            </Link>
          </div>

          <div className={cx("item")}>
            <Link href={"/profile"}>
              <UserRoundPen />
              <span>Profile</span>
            </Link>
          </div>

          <div className={cx("item")}>
            <Link href={"/management-blogs"}>
              <Book />
              <span>Blog</span>
            </Link>
          </div>

          <div className={cx("item")}>
            <Link href={"/management-users"}>
              <UserRound />
              <span>User</span>
            </Link>
          </div>
        </div>

        <div className={cx("title")}>Setting</div>
        <div className={cx("setting-bg")}>
          <div className={cx("item")}>
            Lock
            <label className={cx("toggle-switch")}>
              <input
                type="checkbox"
                checked={isLocked || false}
                onChange={() => setIsLocked((prev) => !prev)}
              />
              <span className={cx("slider")}></span>
            </label>
          </div>
        </div>
      </div>

      <div className={cx("action")}>
        <button className={cx("logout-btn")} onClick={handleLogout}>
          <LogOut />
          <span>LOGOUT</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

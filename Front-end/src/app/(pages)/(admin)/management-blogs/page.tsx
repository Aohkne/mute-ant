"use client";

import TableBlogs from "@/components/TableBlogs/TableBlogs";
import { ModeToggle } from "@/components/ui/mode-toggle";
import Sidebar from "@/components/Sidebar/Sidebar";

import classNames from "classnames/bind";
import styles from "./Blogs.module.scss";
const cx = classNames.bind(styles);

function Blogs() {
  return (
    <div className={cx("wrapper")}>
      <Sidebar />

      <div className={cx("title", "text-title")}>Blogs</div>

      <TableBlogs />

      <div className={cx("fixed top-0 right-0 p-4")}>
        <ModeToggle />
      </div>
    </div>
  );
}

export default Blogs;

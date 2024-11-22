"use client";

import styles from "./Blog.module.scss";
import classNames from "classnames/bind";
import { useEffect, useState } from "react";
import Card from "@/components/Card/Card";
const cx = classNames.bind(styles);

interface Blog {
  id: number;
  img: string;
  title: string;
  author: string;
  date?: string;
  content?: string;
  source?: string;
}

function Blog() {
  const [blogs, setBlogs] = useState<Blog[]>([]); // Lưu trữ dữ liệu blog
  const [loading, setLoading] = useState<boolean>(true); // Trạng thái loading

  useEffect(() => {
    // Lấy dữ liệu từ API
    async function fetchBlogs() {
      try {
        const res = await fetch("/api/blog");
        const data = await res.json();
        setBlogs(data); // Cập nhật dữ liệu blog
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchBlogs();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={cx("wrapper", "text-center", "px-10", "py-5")}>
      <div className={cx("title", "text-title")}>
        Sharing tips, stories, and insights about sign language
      </div>

      <div
        className={cx(
          "grid",
          "grid-cols-1",
          "sm:grid-cols-2",
          "md:grid-cols-2",
          "lg:grid-cols-3",
          "gap-4",
          "md:w-3/4",
          "lg:w-3/4",
          "mx-auto"
        )}
      >
        {blogs.slice(0, 3).map((blog, index) => (
          <div
            key={blog.id}
            className={
              index === 2 ? cx("sm:hidden", "md:hidden", "lg:block") : ""
            }
          >
            <Card
              id={blog.id}
              img={blog.img}
              title={blog.title}
              author={blog.author}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Blog;

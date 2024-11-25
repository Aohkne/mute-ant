"use client";

import styles from "./Blog.module.scss";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

import { useEffect, useState } from "react";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import Card from "@/components/Card/Card";

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
    return <div className={cx("text-center")}>Loading...</div>;
  }
  return (
    <div>
      <div className={cx("px-10")}>
        <Header />
      </div>

      <div className={cx("wrapper", "p-10")}>
        <div className={cx("title", "my-5")}>
          <div className={cx("text-gradient-3")}>BLOG</div>
        </div>

        <div
          className={cx(
            "grid",
            "grid-cols-1",
            "sm:grid-cols-2",
            "md:grid-cols-2",
            "lg:grid-cols-4",
            "gap-4"
          )}
        >
          {Array.isArray(blogs) &&
            blogs.map((blog) => (
              <div key={blog.id}>
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

      <Footer />
    </div>
  );
}

export default Blog;

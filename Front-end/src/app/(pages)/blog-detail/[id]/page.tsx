"use client";

import React, { useState, useEffect } from "react";
import styles from "./BlogDetail.module.scss";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Blog {
  id: number;
  img: string;
  title: string;
  author: string;
  date?: string;
  content?: string;
  source?: string;
}

function BlogDetail({
  params: paramsPromise,
}: {
  params: Promise<{ id: string }>;
}) {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Sử dụng async function trong useEffect
    const fetchBlog = async () => {
      try {
        const params = await paramsPromise; // Chờ giải quyết params
        const res = await fetch("/api/blog/");
        if (!res.ok) {
          throw new Error("Failed to fetch blog");
        }
        const data = await res.json();

        const foundBlog = data.find(
          (blog: Blog) => blog.id === parseInt(params.id)
        );
        setBlog(foundBlog || null);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBlog(); // Gọi hàm async
  }, [paramsPromise]);

  if (loading) {
    return <div className={cx("text-center")}>Loading...</div>;
  }

  if (error) {
    return <div className={cx("text-center")}>Error: {error}</div>;
  }

  if (!blog) {
    return <div className={cx("text-center")}>Blog not found</div>;
  }

  return (
    <div>
      <div className={cx("px-10")}>
        <Header />
        <div className={cx("wrapper", "my-10")}>
          <h1 className={cx("title", "text-title")}>{blog.title}</h1>

          <div className={cx("img")}>
            <Image src={blog.img} alt="blog-img" width={500} height={500} />
          </div>

          <ul className={cx("icon-list", "flex")}>
            <li className={cx("icon")}>
              <i className={cx("fa-solid fa-user")}></i>
              <span className={cx("text-description")}>{blog.author}</span>
            </li>
            <li className={cx("icon")}>
              <i className={cx("fa-solid fa-calendar-days")}></i>
              <span className={cx("text-description")}>{blog.date}</span>
            </li>
          </ul>

          <div className={cx("content", "text-title")}>{blog.content}</div>

          <div className={cx("source", "text-title")}>
            Source:
            <Link href={`${blog.source}`} target="_blank">
              <span>{blog.source}</span>
            </Link>
          </div>

          <Link href={"/blog"}>
            <div className={cx("my-5")}>
              <Button className={cx("back-btn", "text-title")}>Back</Button>
            </div>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default BlogDetail;

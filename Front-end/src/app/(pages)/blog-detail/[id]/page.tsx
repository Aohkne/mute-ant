"use client";

import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { Button } from "@/components/ui/button";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { fetchBlogById } from "@/redux/features/blogs/blogDetailSlice";

import styles from "./BlogDetail.module.scss";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

function BlogDetail() {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();

  const { blog, loading, error } = useSelector(
    (state: RootState) => state.blogDetail
  );

  const [processedContent, setProcessedContent] = useState<string>("");

  useEffect(() => {
    if (id) {
      dispatch(fetchBlogById(Number(id)));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (blog) {
      let newContent = blog.content;
      const emptyPTagRegex = /<p>\s*<\/p>/g;
      const emptyPTags = [...newContent.matchAll(emptyPTagRegex)];

      if (emptyPTags.length > 0 && blog.images.length > 0) {
        let imageIndex = 0;
        newContent = newContent.replace(emptyPTagRegex, () => {
          if (imageIndex < blog.images.length) {
            return `<img src="${
              blog.images[imageIndex++]
            }" alt="Blog Image" class="blog-image"/>`;
          }
          return "<p></p>";
        });
      }

      setProcessedContent(newContent);
    }
  }, [blog]);

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
    <div className={cx("wrapper")}>
      <div className={cx("px-10")}>
        <Header />
      </div>

      <div className={cx("img")}>
        <Image
          src={blog.thumbnail || "/images/blog/default-img.png"}
          alt="blog-img"
          width={500}
          height={500}
        />
      </div>

      <div className={cx("content", "my-10", "px-10")}>
        <h1 className={cx("title", "text-title")}>{blog.title}</h1>

        <ul className={cx("icon-list", "flex")}>
          <li className={cx("icon")}>
            <i className={cx("fa-solid fa-user")}></i>
            <span className={cx("text-description")}>{blog.author}</span>
          </li>
          <li className={cx("icon")}>
            <i className={cx("fa-solid fa-calendar-days")}></i>
            <span className={cx("text-description")}>
              {new Date(blog.created_date || "").toLocaleDateString()}
            </span>
          </li>
        </ul>

        <div
          className={cx("content", "text-title")}
          dangerouslySetInnerHTML={{ __html: processedContent }}
        />

        <div className={cx("source", "text-title")}>
          Source: <span>{blog.status}</span>
        </div>

        <Link href={"/blog"}>
          <div className={cx("my-5")}>
            <Button className={cx("back-btn", "text-title")}>Back</Button>
          </div>
        </Link>
      </div>
      <Footer />
    </div>
  );
}

export default BlogDetail;

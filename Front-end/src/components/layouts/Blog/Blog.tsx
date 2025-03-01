"use client";

import styles from "./Blog.module.scss";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

import { useEffect } from "react";
import Card from "@/components/Card/Card";

import { useSelector, useDispatch } from "react-redux";
import { fetchBlogs } from "@/redux/features/blogs";
import { RootState, AppDispatch } from "@/redux/store";

function Blog() {
  const dispatch = useDispatch<AppDispatch>();
  const { blogs } = useSelector((state: RootState) => state.blogs);

  useEffect(() => {
    dispatch(fetchBlogs(0));
  }, [dispatch]);

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
        {Array.isArray(blogs) &&
          blogs.slice(0, 3).map((blog, index) => (
            <div
              key={blog.id}
              className={
                index === 2 ? cx("sm:hidden", "md:hidden", "lg:block") : ""
              }
            >
              <Card
                id={blog.id}
                img={blog.thumbnail}
                title={blog.title}
                author={blog.author}
                description={blog.description}
              />
            </div>
          ))}
      </div>
    </div>
  );
}

export default Blog;

"use client";

import styles from "./Blog.module.scss";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

import { useEffect, useState } from "react";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import Card from "@/components/Card/Card";

import { useSelector, useDispatch } from "react-redux";
import { fetchBlogs } from "@/redux/features/blogs";
import { RootState, AppDispatch } from "@/redux/store";

function Blog() {
  const dispatch = useDispatch<AppDispatch>();
  const { blogs, loading, pagination } = useSelector(
    (state: RootState) => state.blogs
  );
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    dispatch(fetchBlogs(currentPage));
  }, [dispatch, currentPage]);

  const handleNextPage = () => {
    if (currentPage < pagination.totalElements - 1) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

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
                  img={blog.thumbnail}
                  title={blog.title}
                  author={blog.author}
                  description={blog.description}
                />
              </div>
            ))}
        </div>

        {/* Phân trang */}
        <div className={cx("pagination")}>
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 0}
            className={cx(
              "px-3",
              "py-1",
              "bg-gray-300",
              "hover:bg-gray-400",
              "rounded",
              "mr-2",
              currentPage === 0 && "opacity-50 cursor-not-allowed"
            )}
          >
            Previous
          </button>

          <span>
            Page {currentPage + 1} of {pagination.totalElements}
          </span>

          <button
            onClick={handleNextPage}
            disabled={currentPage >= pagination.totalElements - 1}
            className={cx(
              "px-3",
              "py-1",
              "bg-gray-300",
              "hover:bg-gray-400",
              "rounded",
              "ml-2",
              currentPage >= pagination.totalElements - 1 &&
                "opacity-50 cursor-not-allowed"
            )}
          >
            Next
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Blog;

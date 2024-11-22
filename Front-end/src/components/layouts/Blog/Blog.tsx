import styles from "./Blog.module.scss";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

import Card from "@/components/Card/Card";

function Blog() {
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
        <div className={cx("")}>
          <Card />
        </div>
        <div className={cx("")}>
          <Card />
        </div>
        <div className={cx("", "sm:hidden", "md:hidden", "lg:block")}>
          <Card />
        </div>
      </div>
    </div>
  );
}

export default Blog;

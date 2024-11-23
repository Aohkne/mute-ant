"use client";

import styles from "./Author.module.scss";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

import { useEffect, useState } from "react";
import Tag from "@/components/Tag/Tag";

function Author() {
  const [authorData, setAuthorData] = useState([]);

  useEffect(() => {
    fetch("/data/author.json")
      .then((response) => response.json())
      .then((data) => setAuthorData(data))
      .catch((error) => console.error("Error loading author data:", error));
  }, []);

  return (
    <div className={cx("wrapper", "text-center", "m-auto")}>
      <div className={cx("title", "text-title")}>About us</div>

      <div className={cx()}>
        {/* Left */}
        <div className={cx("list")}>
          {authorData.map((author, index) => (
            <Tag key={index} author={author} className={cx("item")} />
          ))}
        </div>

        {/* Right */}
        <div className={cx("list")}>
          {authorData.map((author, index) => (
            <Tag key={index} author={author} right className={cx("item")} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Author;

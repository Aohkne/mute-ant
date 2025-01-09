"use client";

import styles from "./Card.module.scss";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CardProps {
  id: number;
  img: string;
  title: string;
  author: string;
}

function Card({ id, img, title, author }: CardProps) {
  return (
    <div className={cx("wrapper")}>
      <div className={cx("img")}>
        <Image
          src={img}
          alt="blog-img"
          width={500}
          height={500}
          className={cx("w-auto", "h-[38px]")}
        />
      </div>
      <div
        className={cx("content", "flex-conlumn", "text-left", "px-5", "py-3")}
      >
        <div className={cx("title", "text-title")}>{title}</div>
        <div
          className={cx("description", "text-description", "flex-1", "my-5")}
        >
          {author}
        </div>
        <div className={cx("action")}>
          <Link href={`/blog-detail/${id}`}>
            <div
              className={cx(
                "action-container",
                "title",
                "flex",
                "items-center"
              )}
            >
              <Button className={cx("btn")}>DETAILS</Button>
              <ChevronRight className={cx("icon")} />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Card;

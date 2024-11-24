import styles from "./Tag.module.scss";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

import Image from "next/image";
import Link from "next/link";

interface TagProps {
  author: {
    img: string;
    name: string;
    github: string;
  };
  right?: boolean;
  className?: string;
}

function Tag({ author, right = false, className = "" }: TagProps) {
  return (
    <div className={cx("wrapper", { right }, className)}>
      <Link href={author.github} target="blank">
        {/* Container */}
        <div className={cx("container")}>
          <div className={cx("img")}>
            <Image
              src={author.img || "/images/default-author.png"}
              alt="author-img"
              width={100}
              height={100}
            />
          </div>

          {/* Content */}
          <div className={cx("content")}>
            <div className={cx("name")}>{author.name}</div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default Tag;

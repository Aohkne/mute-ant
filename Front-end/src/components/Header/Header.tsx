import Image from "next/image";

import classNames from "classnames/bind";
import styles from "./Header.module.scss";
import Link from "next/link";
import { ModeToggle } from "@/components/ui/mode-toggle";

const cx = classNames.bind(styles);

function Header() {
  return (
    <div className={cx("container", "px-10", "py-5")}>
      <div className={cx("wrapper")}>
        <Image
          className={cx("img")}
          src="/images/ant.png"
          alt="logo"
          width={38}
          height={38}
        />
        <ul className={cx("nav", "flex")}>
          <li className={cx("nav-item", "text-gradient-3")}>
            <Link href={"/"}>Home</Link>
          </li>
          <li className={cx("nav-item", "text-gradient-3")}>
            <Link href={"/assistant"}>Assistant</Link>
          </li>
          <li className={cx("nav-item", "text-gradient-3")}>
            <Link href={"/chat"}>Chat</Link>
          </li>
          <li className={cx("nav-item", "text-gradient-3")}>
            <Link href={"/blog"}>Blog</Link>
          </li>
        </ul>
      </div>
      <div className={cx("fixed bottom-0 right-0 p-4")}>
        <ModeToggle />
      </div>
    </div>
  );
}

export default Header;

import styles from "./Footer.module.scss";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

import Image from "next/image";
import Link from "next/link";
import "@fortawesome/fontawesome-free/css/all.min.css";

function Footer() {
  return (
    <div className={cx("wrapper", "grid ", "grid-cols-12", "gap-4")}>
      <div
        className={cx(
          "flex-column",
          "col-span-12",
          "md:col-span-12",
          "lg:col-span-4"
        )}
      >
        <Image
          src={"/images/mute-ant_horizontal.png"}
          alt="logo"
          width={250}
          height={150}
        />
        <div className={cx("description", "text-title")}>
          This platform helps learn and communicate through sign language,
          offering valuable resources and insights.
        </div>

        <ul className={cx("icon-list", "flex")}>
          <li className={cx("icon")}>
            <Link href={"https://github.com/Aohkne/mute-ant"}>
              <i className={cx("fa-solid fa-envelope")}></i>
            </Link>
          </li>
          <li className={cx("icon")}>
            <Link href={"https://github.com/Aohkne/mute-ant"}>
              <i className={cx("fa-brands fa-github")}></i>
            </Link>
          </li>
          <li className={cx("icon")}>
            <Link href={""}>
              <i className={cx("fa-brands fa-facebook")}></i>
            </Link>
          </li>
          <li className={cx("icon")}>
            <Link href={""}>
              <i className={cx("fa-brands fa-youtube")}></i>
            </Link>
          </li>
        </ul>
      </div>

      <div
        className={cx("px-5", "col-span-12", "md:col-span-6", "lg:col-span-4")}
      >
        <div className={cx("title", "mt-auto")}>Product</div>
        <ul className={cx("product-list", "flex-column")}>
          <li className={cx("product")}>
            <Link href={"/"}>Home</Link>
          </li>
          <li className={cx("product")}>
            <Link href={"/assistant"}>Assistant</Link>
          </li>
          <li className={cx("product")}>
            <Link href={"/chat"}>Chat</Link>
          </li>
          <li className={cx("product")}>
            <Link href={"/blog"}>Blog</Link>
          </li>
        </ul>
      </div>

      <div
        className={cx("px-5", "col-span-12", "md:col-span-6", "lg:col-span-4")}
      >
        <div className={cx("title", "mt-auto")}>RESOURCES</div>
        <ul className={cx("product-list", "flex-column")}>
          <li className={cx("product")}>
            <Link href={"/"}>Help docs</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Footer;

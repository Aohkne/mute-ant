import styles from "./Assistant.module.scss";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

import Header from "@/components/Header/Header";

function Assistant() {
  return (
    <div>
      <div className={cx("assistant", "px-10")}>
        <Header />
      </div>
    </div>
  );
}

export default Assistant;

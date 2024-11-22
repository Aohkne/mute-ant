import styles from "./Chat.module.scss";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

import Header from "@/components/Header/Header";

function Chat() {
  return (
    <div>
      <div className={cx("chat", "px-10")}>
        <Header />
      </div>
    </div>
  );
}

export default Chat;

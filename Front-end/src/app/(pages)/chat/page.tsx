import styles from "./Chat.module.scss";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";

function Chat() {
  return (
    <div>
      <div className={cx("px-10")}>
        <Header />
      </div>

      <div className={cx("wrapper", "p-10")}>{/* Chat */}</div>

      <Footer />
    </div>
  );
}

export default Chat;